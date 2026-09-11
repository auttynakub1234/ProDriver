import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import License from "@/models/License";
import Product from "@/models/Product";
import User from "@/models/User";
import { sendTelegramNotification } from "@/lib/telegram";
import crypto from "crypto";

// ⚠️ ใส่ Secret Key จาก Payment Gateway
const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || "your-webhook-secret";

/**
 * รับ Webhook จากระบบชำระเงิน (เช่น PromptPay, TrueMoney, SCB Easy)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-webhook-signature");

    // ตรวจสอบ Signature (ป้องกันการปลอมแปลง)
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

/**
 * ตรวจสอบ Webhook Signature
 */
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

/**
 * จัดการเมื่อชำระเงินสำเร็จ
 */
async function handlePaymentSuccess(data: any) {
  await connectDB();

  const { orderId, amount, productId, userEmail, userName } = data;

  // สร้างผู้ใช้ใหม่ (ถ้ายังไม่มี)
  let user = await User.findOne({ email: userEmail });
  if (!user) {
    user = await User.create({
      email: userEmail,
      name: userName || "Customer",
      password: crypto.randomBytes(16).toString("hex"), // รหัสผ่านสุ่ม
      role: "user",
    });
  }

  // ดึงข้อมูลสินค้า
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // สร้าง License Key
  const licenseKey = generateLicenseKey();

  const license = await License.create({
    key: licenseKey,
    productId: product._id,
    userId: user._id,
    isActivated: false,
  });

  // ส่งการแจ้งเตือนไปยัง Telegram (แจ้ง Admin)
  await sendTelegramNotification({
    key: licenseKey,
    deviceId: "N/A (ยังไม่ได้เปิดใช้งาน)",
    productName: product.name,
    userEmail: user.email,
  });

  // TODO: ส่งอีเมลแจ้ง License Key ให้ลูกค้า
  // sendEmailToCustomer(user.email, licenseKey, product.name);

  console.log(`✅ License created: ${licenseKey} for ${user.email}`);
}

/**
 * สร้าง License Key แบบสุ่ม (XXXX-XXXX-XXXX-XXXX)
 */
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
