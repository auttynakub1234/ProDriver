"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  name: string;
  downloadUrl: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบว่ามี Token หรือไม่
    const token = localStorage.getItem("token");
    const productData = localStorage.getItem("product");

    if (!token || !productData) {
      router.push("/activate");
      return;
    }

    setProduct(JSON.parse(productData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("product");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                ProDriver Shop
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">✓ เปิดใช้งานแล้ว</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="text-5xl mr-4">✅</div>
            <div>
              <h2 className="text-2xl font-bold text-green-600">เปิดใช้งานสำเร็จ!</h2>
              <p className="text-gray-600">ดาวน์โหลดและติดตั้งแอปของคุณได้แล้ว</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">ข้อมูลสินค้า</h3>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">สินค้า:</span>{" "}
                <span className="text-indigo-600">{product?.name}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <span className="text-3xl mr-3">📥</span>
            ดาวน์โหลดแอป
          </h3>
          <p className="text-gray-600 mb-6">
            คลิกปุ่มด้านล่างเพื่อดาวน์โหลด APK ไฟล์
          </p>

          <a
            href={product?.downloadUrl || "#"}
            download
            className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-medium text-lg"
          >
            ดาวน์โหลด APK
          </a>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ คำแนะนำ:</h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>ถอนการติดตั้งเวอร์ชันเก่าก่อน (ถ้ามี)</li>
              <li>เปิดการติดตั้งจากแหล่งที่ไม่รู้จัก (Unknown Sources)</li>
              <li>ติดตั้ง APK ที่ดาวน์โหลดมา</li>
              <li>เปิดแอปและใช้งานได้ทันที</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
