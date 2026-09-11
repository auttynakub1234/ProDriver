import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { ApiResponse, RegisterRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: RegisterRequest = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าอีเมลนี้มีในระบบแล้วหรือไม่
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: "user",
    });

    // สร้าง JWT Token
    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "สมัครสมาชิกสำเร็จ",
        data: {
          token,
          user: {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" },
      { status: 500 }
    );
  }
}
