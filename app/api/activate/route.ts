import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { sendTelegramNotification } from "@/lib/telegram";
import { ActivateKeyRequest, ActivateKeyResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: ActivateKeyRequest = await request.json();
    const { key, deviceId } = body;

    if (!key || !deviceId) {
      return NextResponse.json<ActivateKeyResponse>(
        {
          success: false,
          message: "กรุณาระบุ Key และ Device ID",
        },
        { status: 400 }
      );
    }

    // ค้นหาคีย์ในฐานข้อมูล
    const license = await prisma.license.findUnique({
      where: { key: key.toUpperCase() },
      include: {
        product: true,
        user: true,
      },
    });

    if (!license) {
      return NextResponse.json<ActivateKeyResponse>(
        {
          success: false,
          message: "คีย์ไม่ถูกต้องหรือไม่มีในระบบ",
        },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าคีย์ถูกใช้งานแล้วหรือไม่
    if (license.isActivated) {
      // ถ้าคีย์ถูกใช้งานแล้ว ตรวจสอบว่าเป็นเครื่องเดียวกันหรือไม่
      if (license.deviceId === deviceId) {
        // เครื่องเดียวกัน ให้ข้อมูลสินค้า
        const token = signToken({
          userId: license.user.id,
          email: license.user.email,
          role: license.user.role,
        });

        return NextResponse.json<ActivateKeyResponse>({
          success: true,
          message: "เข้าสู่ระบบสำเร็จ",
          token,
          product: {
            name: license.product.name,
            downloadUrl: license.product.downloadUrl,
          },
        });
      } else {
        // คีย์ถูกใช้กับเครื่องอื่นแล้ว
        return NextResponse.json<ActivateKeyResponse>(
          {
            success: false,
            message: "คีย์นี้ถูกเปิดใช้งานกับอุปกรณ์อื่นแล้ว",
          },
          { status: 403 }
        );
      }
    }

    // ตรวจสอบว่าคีย์หมดอายุหรือไม่
    if (license.expiresAt && new Date() > license.expiresAt) {
      return NextResponse.json<ActivateKeyResponse>(
        {
          success: false,
          message: "คีย์นี้หมดอายุแล้ว",
        },
        { status: 403 }
      );
    }

    // อัปเดตสถานะคีย์ - เปิดใช้งาน
    await prisma.license.update({
      where: { id: license.id },
      data: {
        isActivated: true,
        deviceId: deviceId,
        activatedAt: new Date(),
      },
    });

    // ส่งการแจ้งเตือนไปยัง Telegram
    await sendTelegramNotification({
      key: key.toUpperCase(),
      deviceId,
      productName: license.product.name,
      userEmail: license.user.email,
    });

    // สร้าง JWT Token
    const token = signToken({
      userId: license.user.id,
      email: license.user.email,
      role: license.user.role,
    });

    return NextResponse.json<ActivateKeyResponse>(
      {
        success: true,
        message: "เปิดใช้งานคีย์สำเร็จ",
        token,
        product: {
          name: license.product.name,
          downloadUrl: license.product.downloadUrl,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json<ActivateKeyResponse>(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการเปิดใช้งานคีย์",
      },
      { status: 500 }
    );
  }
}
