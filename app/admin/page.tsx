"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalLicenses: number;
  activatedLicenses: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalLicenses: 0,
    activatedLicenses: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">กำลังโหลด...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-4xl mr-4">📦</div>
            <div>
              <p className="text-gray-600 text-sm">สินค้าทั้งหมด</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-4xl mr-4">🔑</div>
            <div>
              <p className="text-gray-600 text-sm">คีย์ทั้งหมด</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalLicenses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-4xl mr-4">✅</div>
            <div>
              <p className="text-gray-600 text-sm">เปิดใช้งานแล้ว</p>
              <p className="text-3xl font-bold text-green-600">{stats.activatedLicenses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-4xl mr-4">👥</div>
            <div>
              <p className="text-gray-600 text-sm">ผู้ใช้ทั้งหมด</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-xl font-semibold mb-2">จัดการสินค้า</h3>
          <p className="text-gray-600">เพิ่ม แก้ไข ลบสินค้า</p>
        </Link>

        <Link
          href="/admin/licenses"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">🔑</div>
          <h3 className="text-xl font-semibold mb-2">จัดการคีย์</h3>
          <p className="text-gray-600">สร้าง ดู และจัดการคีย์</p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-xl font-semibold mb-2">จัดการผู้ใช้</h3>
          <p className="text-gray-600">ดูรายการผู้ใช้งาน</p>
        </Link>
      </div>
    </div>
  );
}
