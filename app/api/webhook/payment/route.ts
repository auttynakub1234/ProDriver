import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendTelegramNotification } from "@/lib/telegram";

// ⚠️ ใส่ Secret Key จาก Payment Gateway
const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || "your-webhook-secret";

/**
 * รับ Webhook จากระบบชำระเงิน
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-webhook-signature");

    // ตรวจสอบ Signature
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);

    // ตรวจสอบว่าชำระเงินสำเร็จหรือไม่
    if (data.status === "success" || data.event === "payment.success") {
      await handlePaymentSuccess(data);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

async function handlePaymentSuccess(data: any) {
  const { orderId, amount, productId, customerName, customerPhone } = data;

  // ดึงข้อมูลสินค้า
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // สร้าง Token (8 หลัก)
  const generateToken = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  let token = generateToken();

  // Check if token already exists
  let existingToken = await prisma.token.findUnique({
    where: { token },
  });

  while (existingToken) {
    token = generateToken();
    existingToken = await prisma.token.findUnique({
      where: { token },
    });
  }

  // สร้าง Token
  await prisma.token.create({
    data: {
      token,
      productId: product.id,
      customerName: customerName || "Customer",
      customerPhone: customerPhone || "N/A",
    },
  });

  // ส่งการแจ้งเตือนไปยัง Telegram
  await sendTelegramNotification({
    key: token,
    deviceId: "Token System (ไม่ล็อกเครื่อง)",
    productName: product.name,
    userEmail: customerPhone || customerName,
  });

  console.log(`✅ Token created: ${token} for ${customerName}`);
}
