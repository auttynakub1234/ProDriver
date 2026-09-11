import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ใช้ Token เพื่อ Login และดาวน์โหลด APK (ไม่จำกัดเครื่อง)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกรหัส Token" },
        { status: 400 }
      );
    }

    // ค้นหา Token
    const tokenData = await prisma.token.findUnique({
      where: { token: token.toUpperCase() },
      include: {
        product: true,
      },
    });

    if (!tokenData) {
      return NextResponse.json(
        { success: false, message: "รหัส Token ไม่ถูกต้อง" },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าหมดอายุหรือไม่
    if (tokenData.expiresAt && new Date() > tokenData.expiresAt) {
      return NextResponse.json(
        { success: false, message: "รหัส Token หมดอายุแล้ว" },
        { status: 403 }
      );
    }

    // อัปเดตการใช้งาน Token (เพิ่มจำนวนดาวน์โหลด)
    await prisma.token.update({
      where: { id: tokenData.id },
      data: {
        downloadCount: tokenData.downloadCount + 1,
        lastUsedAt: new Date(),
      },
    });

    // บันทึกประวัติดาวน์โหลด
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await prisma.download.create({
      data: {
        tokenId: tokenData.id,
        productId: tokenData.productId,
        ipAddress: ip,
        userAgent: userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      product: {
        name: tokenData.product.name,
        version: tokenData.product.version,
        size: tokenData.product.size,
        apkUrl: tokenData.product.apkUrl,
        downloadCount: tokenData.downloadCount + 1,
      },
    });
  } catch (error) {
    console.error("Token login error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
