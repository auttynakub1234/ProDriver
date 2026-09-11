import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import License from "@/models/License";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 });
    }

    await connectDB();

    const licenses = await License.find()
      .populate("productId", "name")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      data: licenses,
    });
  } catch (error) {
    console.error("Get licenses error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { key, productId, userId, expiresAt } = body;

    const newLicense = await License.create({
      key: key.toUpperCase(),
      productId,
      userId,
      expiresAt: expiresAt || null,
      isActivated: false,
    });

    return NextResponse.json(
      {
        success: true,
        data: newLicense,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create license error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "คีย์นี้มีในระบบแล้ว" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
