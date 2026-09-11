import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

// ⚠️ สำหรับ Demo เท่านั้น - ใน Production ควรเก็บใน Database
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123", // เปลี่ยนใน production!
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const token = signToken({
        userId: "admin",
        email: "admin@prodriver.local",
        role: "admin",
      });

      return NextResponse.json({
        success: true,
        token,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Username หรือ Password ไม่ถูกต้อง" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
