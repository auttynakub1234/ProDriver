import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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
  const { orderId, amount, productId, userEmail, userName } = data;

  // สร้างผู้ใช้ใหม่ (ถ้ายังไม่มี)
  let user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);
    user = await prisma.user.create({
      data: {
        email: userEmail,
        name: userName || "Customer",
        password: hashedPassword,
        role: "user",
      },
    });
  }

  // ดึงข้อมูลสินค้า
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // สร้าง License Key
  const licenseKey = generateLicenseKey();

  await prisma.license.create({
    data: {
      key: licenseKey,
      productId: product.id,
      userId: user.id,
      isActivated: false,
    },
  });

  // ส่งการแจ้งเตือนไปยัง Telegram
  await sendTelegramNotification({
    key: licenseKey,
    deviceId: "N/A (ยังไม่ได้เปิดใช้งาน)",
    productName: product.name,
    userEmail: user.email,
  });

  console.log(`✅ License created: ${licenseKey} for ${user.email}`);
}

function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segments = 4;
  const segmentLength = 4;
  let key = "";

  for (let i = 0; i < segments; i++) {
    if (i > 0) key += "-";
    for (let j = 0; j < segmentLength; j++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return key;
}
