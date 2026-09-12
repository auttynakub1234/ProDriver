"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalTokens: 0,
    pendingPayments: 0,
    totalDownloads: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">สินค้าทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Token ทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTokens}</p>
              </div>
              <div className="text-4xl">🔑</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">รอตรวจสอบ</p>
                <p className="text-3xl font-bold text-orange-500">{stats.pendingPayments}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">ดาวน์โหลดวันนี้</p>
                <p className="text-3xl font-bold text-green-500">{stats.totalDownloads}</p>
              </div>
              <div className="text-4xl">📥</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/payments"
            className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-bold mb-2">จัดการการชำระเงิน</h3>
            <p className="text-sm opacity-90">ตรวจสอบสลิปและสร้าง Token</p>
            {stats.pendingPayments > 0 && (
              <div className="mt-3 bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                {stats.pendingPayments} รายการรอตรวจสอบ
              </div>
            )}
          </Link>

          <Link
            href="/admin/tokens"
            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🔑</div>
            <h3 className="text-xl font-bold mb-2">จัดการ Token</h3>
            <p className="text-sm opacity-90">ดู สร้าง และจัดการ Token</p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-xl font-bold mb-2">จัดการสินค้า</h3>
            <p className="text-sm opacity-90">เพิ่ม แก้ไข ลบสินค้า</p>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="text-xl font-bold mb-2">ตั้งค่าระบบ</h3>
            <p className="text-sm opacity-90">PromptPay, LINE, ข้อความ</p>
          </Link>

          <Link
            href="/admin/downloads"
            className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2">ประวัติดาวน์โหลด</h3>
            <p className="text-sm opacity-90">ดูสถิติและประวัติการใช้งาน</p>
          </Link>

          <a
            href="/"
            target="_blank"
            className="bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">🌐</div>
            <h3 className="text-xl font-bold mb-2">ดูหน้าเว็บ</h3>
            <p className="text-sm opacity-90">เปิดหน้าเว็บสำหรับลูกค้า</p>
          </a>
        </div>
      </main>
    </div>
  );
}
