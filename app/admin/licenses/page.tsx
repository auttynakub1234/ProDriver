"use client";

import { useEffect, useState } from "react";

interface License {
  _id: string;
  key: string;
  productId: { name: string };
  userId: { email: string; name: string };
  deviceId?: string;
  isActivated: boolean;
  activatedAt?: string;
  createdAt: string;
}

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/licenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setLicenses(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments = 4;
    const segmentLength = 4;
    let key = "";

    for (let i = 0; i < segments; i++) {
      if (i > 0) key += "-";
      for (let j = 0; j < segmentLength; j++) {
        key += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return key;
  };

  if (loading) {
    return <div className="text-center py-12">กำลังโหลด...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">จัดการคีย์</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          + สร้างคีย์ใหม่
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                License Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                สินค้า
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ผู้ใช้
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                สถานะ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Device ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                วันที่สร้าง
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {licenses.map((license) => (
              <tr key={license._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {license.key}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {license.productId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div>{license.userId?.name || "N/A"}</div>
                  <div className="text-gray-500 text-xs">{license.userId?.email || ""}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {license.isActivated ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      เปิดใช้งานแล้ว
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      ยังไม่เปิดใช้งาน
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                  {license.deviceId ? (
                    <span className="text-xs bg-blue-50 px-2 py-1 rounded">
                      {license.deviceId.substring(0, 8)}...
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(license.createdAt).toLocaleDateString("th-TH")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {licenses.length === 0 && (
          <div className="text-center py-12 text-gray-500">ยังไม่มีคีย์</div>
        )}
      </div>
    </div>
  );
}
