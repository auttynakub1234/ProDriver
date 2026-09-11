import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import License from "@/models/License";
import Product from "@/models/Product";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { sendTelegramNotification } from "@/lib/telegram";
import { ActivateKeyRequest, ActivateKeyResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

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
    const license = await License.findOne({ key: key.toUpperCase() });

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
        const product = await Product.findById(license.productId);
        const user = await User.findById(license.userId);

        const token = signToken({
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
        });

        return NextResponse.json<ActivateKeyResponse>({
          success: true,
          message: "เข้าสู่ระบบสำเร็จ",
          token,
          product: {
            name: product?.name || "",
            downloadUrl: product?.downloadUrl || "",
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
    license.isActivated = true;
    license.deviceId = deviceId;
    license.activatedAt = new Date();
    await license.save();

    // ดึงข้อมูลสินค้าและผู้ใช้
    const product = await Product.findById(license.productId);
    const user = await User.findById(license.userId);

    // ส่งการแจ้งเตือนไปยัง Telegram
    await sendTelegramNotification({
      key: key.toUpperCase(),
      deviceId,
      productName: product?.name,
      userEmail: user?.email,
    });

    // สร้าง JWT Token สำหรับผู้ใช้
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json<ActivateKeyResponse>(
      {
        success: true,
        message: "เปิดใช้งานคีย์สำเร็จ",
        token,
        product: {
          name: product?.name || "",
          downloadUrl: product?.downloadUrl || "",
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
