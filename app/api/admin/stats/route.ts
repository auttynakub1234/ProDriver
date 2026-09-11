import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    // ตรวจสอบ Admin Token
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 });
    }

    // นับจำนวนข้อมูล
    const [totalProducts, totalLicenses, activatedLicenses, totalUsers] = await Promise.all([
      prisma.product.count(),
      prisma.license.count(),
      prisma.license.count({ where: { isActivated: true } }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalLicenses,
        activatedLicenses,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
