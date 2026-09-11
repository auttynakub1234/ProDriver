import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 });
    }

    const licenses = await prisma.license.findMany({
      include: {
        product: {
          select: { name: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

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

    const body = await request.json();
    const { key, productId, userId, expiresAt } = body;

    const newLicense = await prisma.license.create({
      data: {
        key: key.toUpperCase(),
        productId,
        userId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActivated: false,
      },
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

    if (error.code === 'P2002') {
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
