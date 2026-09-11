import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    // ค้นหาสินค้าที่เปิดใช้งาน
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า" },
      { status: 500 }
    );
  }
}
