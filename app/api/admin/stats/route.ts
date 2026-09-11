import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import License from "@/models/License";
import User from "@/models/User";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    // ตรวจสอบ Admin Token
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 });
    }

    await connectDB();

    // นับจำนวนข้อมูล
    const [totalProducts, totalLicenses, activatedLicenses, totalUsers] = await Promise.all([
      Product.countDocuments(),
      License.countDocuments(),
      License.countDocuments({ isActivated: true }),
      User.countDocuments(),
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
