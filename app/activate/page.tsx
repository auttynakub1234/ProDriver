"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ActivatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    key: "",
    deviceId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: formData.key.toUpperCase(),
          deviceId: formData.deviceId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // บันทึก Token ลง localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("product", JSON.stringify(data.product));

        // ไปหน้า Dashboard
        router.push("/dashboard");
      } else {
        setError(data.message || "เปิดใช้งานคีย์ไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">เปิดใช้งาน License Key</h1>
          <p className="text-gray-600">กรอก Key และ Device ID เพื่อเข้าใช้งาน</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-2">
              License Key
            </label>
            <input
              id="key"
              type="text"
              required
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
            />
            <p className="text-xs text-gray-500 mt-1">Key ที่ได้รับจากการสั่งซื้อ</p>
          </div>

          <div>
            <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-2">
              Device ID
            </label>
            <input
              id="deviceId"
              type="text"
              required
              placeholder="Your Android Device ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              value={formData.deviceId}
              onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              ใช้ Settings.Secure.ANDROID_ID จากแอป Android
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
          >
            {loading ? "กำลังเปิดใช้งาน..." : "เปิดใช้งาน"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-semibold mb-2">💡 วิธีหา Device ID:</p>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>เปิดแอป ProDriver บนมือถือ Android</li>
            <li>Device ID จะแสดงบนหน้าจอ Activation</li>
            <li>คัดลอกและนำมากรอกที่นี่</li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
