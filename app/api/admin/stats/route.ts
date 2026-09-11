import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Count stats
    const [totalProducts, totalTokens, pendingPayments, totalDownloads] = await Promise.all([
      prisma.product.count(),
      prisma.token.count(),
      prisma.payment.count({ where: { status: "pending" } }),
      prisma.download.count({
        where: {
          downloadedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalTokens,
        pendingPayments,
        totalDownloads,
        todayRevenue: 0, // Calculate if needed
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
