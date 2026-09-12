"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  features: string;
  price: number;
  imageUrl?: string;
  category: string;
  version?: string;
  size?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseFeatures = (featuresStr: string): string[] => {
    try {
      return JSON.parse(featuresStr);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">ProDriver Shop</h1>
              <p className="text-gray-600 text-sm">ร้านขาย Mod APK คุณภาพสูง</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                🔑 ใช้รหัส Token
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            สินค้าแนะนำ
          </h2>
          <p className="text-gray-600 text-lg">
            เลือกซื้อ Mod APK คุณภาพสูง พร้อมการรับประกัน
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white text-2xl font-bold">
                    {product.name}
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-indigo-600">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>

                {product.shortDescription && (
                  <p className="text-gray-600 mb-4">{product.shortDescription}</p>
                )}

                {/* Version & Size */}
                <div className="flex gap-4 mb-4 text-sm text-gray-500">
                  {product.version && (
                    <span className="flex items-center gap-1">
                      📱 v{product.version}
                    </span>
                  )}
                  {product.size && (
                    <span className="flex items-center gap-1">
                      💾 {product.size}
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">ฟีเจอร์:</h4>
                  <ul className="space-y-1">
                    {parseFeatures(product.features).slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Buy Button */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-3xl font-bold text-indigo-600">
                      ฿{product.price}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                  >
                    ซื้อเลย
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 text-lg">ยังไม่มีสินค้า</p>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Image */}
              {selectedProduct.imageUrl && (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              {/* Description */}
              <p className="text-gray-700 mb-6">{selectedProduct.description}</p>

              {/* Full Features List */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">ฟีเจอร์ทั้งหมด:</h3>
                <ul className="space-y-2">
                  {parseFeatures(selectedProduct.features).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Contact */}
              <div className="border-t pt-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    ฿{selectedProduct.price}
                  </div>
                  <p className="text-gray-600">โอนเงินผ่าน PromptPay</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">📱 วิธีการสั่งซื้อ:</h4>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>โอนเงินผ่าน PromptPay: <strong>0812345678</strong></li>
                    <li>ส่งสลิปพร้อมชื่อ-เบอร์โทรมาทาง LINE: <strong>@prodriver</strong></li>
                    <li>รอรับรหัส Token จาก Admin (ภายใน 5-10 นาที)</li>
                    <li>ใช้รหัส Token เข้าสู่ระบบและดาวน์โหลด APK</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <a
                    href="https://line.me/ti/p/@prodriver"
                    target="_blank"
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-center font-semibold"
                  >
                    💬 ติดต่อ LINE
                  </a>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">📞 ติดต่อ: 081-234-5678</p>
            <p className="mb-2">💬 LINE: @prodriver</p>
            <p className="text-sm text-gray-500">
              © 2024 ProDriver Shop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
