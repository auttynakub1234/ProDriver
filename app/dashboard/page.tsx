"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบว่ามี Token หรือไม่
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
              <span className="text-gray-700">สวัสดี, {user?.name}</span>
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
          <h2 className="text-2xl font-bold mb-4">ข้อมูลส่วนตัว</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">ชื่อ:</span> {user?.name}
            </p>
            <p>
              <span className="font-semibold">อีเมล:</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold">สถานะ:</span>{" "}
              <span className="text-indigo-600">{user?.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก"}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">คีย์ของฉัน</h2>
          <p className="text-gray-600">ยังไม่มีคีย์ที่ซื้อ</p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              เลือกซื้อสินค้า
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
