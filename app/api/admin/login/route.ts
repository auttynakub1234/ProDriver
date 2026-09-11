import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Get admin password from settings
    const adminPasswordSetting = await prisma.settings.findUnique({
      where: { key: "admin_password" },
    });

    if (!adminPasswordSetting) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลผู้ดูแลระบบ" },
        { status: 500 }
      );
    }

    // Check username
    if (username !== "admin") {
      return NextResponse.json(
        { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, adminPasswordSetting.value);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // Generate token
    const token = signToken({
      userId: "admin",
      email: "admin@prodriver.com",
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
