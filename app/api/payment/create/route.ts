import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { productId, amount, customerName, customerEmail } = body;

    // ตรวจสอบสินค้า
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "ไม่พบสินค้า" },
        { status: 404 }
      );
    }

    // สร้าง Payment Link (ตัวอย่าง)
    const paymentData = {
      amount: amount || product.price,
      productName: product.name,
      customerName,
      customerEmail,
      orderId: `ORDER-${Date.now()}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/payment`,
    };

    // TODO: เรียก Payment Gateway API
    // const paymentLink = await createPaymentLink(paymentData);

    // Mock Payment Link (แทนที่ด้วย API จริง)
    const mockPaymentLink = `https://payment.example.com/pay?order=${paymentData.orderId}`;

    return NextResponse.json({
      success: true,
      paymentUrl: mockPaymentLink,
      orderId: paymentData.orderId,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
