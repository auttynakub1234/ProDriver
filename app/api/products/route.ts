import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    // ค้นหาสินค้าที่เปิดใช้งาน
    const query: any = { isActive: true };
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

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
