"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/token/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.toUpperCase() }),
      });

      const data = await response.json();

      if (data.success) {
        // เก็บข้อมูลสินค้า
        localStorage.setItem("product", JSON.stringify(data.product));
        router.push("/download");
      } else {
        setError(data.message || "รหัส Token ไม่ถูกต้อง");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ใช้รหัส Token</h1>
          <p className="text-gray-600">กรอกรหัส Token เพื่อดาวน์โหลด APK</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
              รหัส Token (8 หลัก)
            </label>
            <input
              id="token"
              type="text"
              required
              maxLength={8}
              placeholder="12345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-wider font-mono uppercase"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
            />
            <p className="text-sm text-gray-500 mt-2">
              * รหัส Token ที่ได้รับจาก Admin หลังชำระเงิน
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || token.length !== 8}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition"
          >
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700">
            ← กลับหน้าหลัก
          </Link>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">📌 วิธีรับรหัส Token:</h3>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>เลือกสินค้าที่ต้องการซื้อ</li>
            <li>โอนเงินผ่าน PromptPay</li>
            <li>ส่งสลิปมาทาง LINE: @prodriver</li>
            <li>รอรับรหัส Token จาก Admin (5-10 นาที)</li>
            <li>กรอกรหัส Token ที่นี่เพื่อดาวน์โหลด</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
