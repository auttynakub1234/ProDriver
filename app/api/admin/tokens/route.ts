import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all tokens
export async function GET(request: NextRequest) {
  try {
    const tokens = await prisma.token.findMany({
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    console.error("Get tokens error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

// Create new token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, customerName, customerPhone, expiresInDays } = body;

    // Validate
    if (!productId || !customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
    }

    // Check product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "ไม่พบสินค้า" },
        { status: 404 }
      );
    }

    // Generate 8-digit token
    const generateToken = () => {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    let token = generateToken();

    // Check if token already exists (rare case)
    let existingToken = await prisma.token.findUnique({
      where: { token },
    });

    while (existingToken) {
      token = generateToken();
      existingToken = await prisma.token.findUnique({
        where: { token },
      });
    }

    // Calculate expiration date
    let expiresAt = null;
    if (expiresInDays && parseInt(expiresInDays) > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
    }

    // Create token
    const newToken = await prisma.token.create({
      data: {
        token,
        productId,
        customerName,
        customerPhone,
        expiresAt,
        isUsed: false,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "สร้าง Token สำเร็จ",
        data: newToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create token error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
