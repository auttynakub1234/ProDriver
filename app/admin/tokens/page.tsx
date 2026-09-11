"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Token {
  id: string;
  token: string;
  product: { name: string };
  customerName: string;
  customerPhone: string;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
}

export default function TokensPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
    customerPhone: "",
    expiresInDays: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [tokensRes, productsRes] = await Promise.all([
        fetch("/api/admin/tokens"),
        fetch("/api/products"),
      ]);

      const tokensData = await tokensRes.json();
      const productsData = await productsRes.json();

      if (tokensData.success) setTokens(tokensData.data);
      if (productsData.success) setProducts(productsData.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch("/api/admin/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ สร้าง Token สำเร็จ!\n\nToken: ${data.data.token}\n\nส่งรหัสนี้ให้ลูกค้า`);
        setShowCreateModal(false);
        setFormData({
          productId: "",
          customerName: "",
          customerPhone: "",
          expiresInDays: "",
        });
        fetchData();
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setCreating(false);
    }
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    alert(`✅ คัดลอก Token แล้ว: ${token}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการ Token</h1>
              <p className="text-gray-600 text-sm">สร้างและจัดการรหัส Token สำหรับลูกค้า</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                + สร้าง Token ใหม่
              </button>
              <button
                onClick={() => router.push("/admin")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                ← กลับ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Token ทั้งหมด</p>
            <p className="text-3xl font-bold text-gray-900">{tokens.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">ใช้งานแล้ว</p>
            <p className="text-3xl font-bold text-green-600">
              {tokens.filter((t) => t.isUsed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">ยังไม่ใช้งาน</p>
            <p className="text-3xl font-bold text-orange-600">
              {tokens.filter((t) => !t.isUsed).length}
            </p>
          </div>
        </div>

        {/* Tokens Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สินค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลูกค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่สร้าง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tokens.map((token) => (
                  <tr key={token.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <code className="text-lg font-mono font-bold text-indigo-600">
                          {token.token}
                        </code>
                        <button
                          onClick={() => copyToken(token.token)}
                          className="text-gray-400 hover:text-gray-600"
                          title="คัดลอก"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {token.product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{token.customerName}</div>
                      <div className="text-sm text-gray-500">{token.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {token.isUsed ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          ✓ ใช้งานแล้ว
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          ⏳ ยังไม่ใช้
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(token.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => copyToken(token.token)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        คัดลอก Token
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tokens.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔑</div>
              <p className="text-gray-500">ยังไม่มี Token</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                สร้าง Token แรก
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create Token Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">สร้าง Token ใหม่</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกสินค้า *
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                >
                  <option value="">-- เลือกสินค้า --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (฿{product.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อลูกค้า *
                </label>
                <input
                  type="text"
                  required
                  placeholder="นาย A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทร *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมดอายุ (วัน)
                </label>
                <input
                  type="number"
                  placeholder="เว้นว่าง = ไม่มีวันหมดอายุ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={formData.expiresInDays}
                  onChange={(e) => setFormData({ ...formData, expiresInDays: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-1">
                  ไม่ระบุ = Token ไม่หมดอายุ
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-semibold"
                >
                  {creating ? "กำลังสร้าง..." : "สร้าง Token"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  ยกเลิก
                </button>
              </div>
            </form>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 คำแนะนำ:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Token จะถูกสร้างอัตโนมัติ (8 หลัก)</li>
                <li>• ส่ง Token ให้ลูกค้าทาง LINE หรือ SMS</li>
                <li>• ลูกค้าใช้ Token เข้าสู่ระบบและดาวน์โหลด</li>
                <li>• Token ใช้ได้ 1 ครั้ง (หลังใช้แล้วจะบันทึกประวัติ)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
