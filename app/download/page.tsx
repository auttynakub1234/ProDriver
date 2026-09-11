"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  name: string;
  version?: string;
  size?: string;
  apkUrl: string;
}

export default function DownloadPage() {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const productData = localStorage.getItem("product");
    if (!productData) {
      router.push("/login");
      return;
    }
    setProduct(JSON.parse(productData));
  }, [router]);

  const handleDownload = () => {
    if (!product) return;
    setDownloading(true);

    // เปิดลิงก์ดาวน์โหลด
    window.open(product.apkUrl, "_blank");

    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  if (!product) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ยืนยันตัวตนสำเร็จ!</h1>
          <p className="text-gray-600">พร้อมดาวน์โหลด APK แล้ว</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <div className="flex gap-4 text-sm">
            {product.version && <span>📱 Version {product.version}</span>}
            {product.size && <span>💾 {product.size}</span>}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📥 วิธีติดตั้ง:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>ดาวน์โหลดไฟล์ APK</li>
              <li>เปิดการติดตั้งจากแหล่งที่ไม่รู้จัก (Settings → Security)</li>
              <li>เปิดไฟล์ APK และกด "ติดตั้ง"</li>
              <li>รอการติดตั้งเสร็จสิ้น</li>
              <li>เปิดแอปและเริ่มใช้งาน!</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ หมายเหตุ:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• ไฟล์ APK นี้ปลอดภัย 100%</li>
              <li>• สามารถดาวน์โหลดซ้ำได้หากไฟล์เสียหาย</li>
              <li>• หากมีปัญหาติดต่อ LINE: @prodriver</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-4 rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold text-lg transition shadow-lg"
        >
          {downloading ? "กำลังเตรียมดาวน์โหลด..." : "📥 ดาวน์โหลด APK"}
        </button>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDownload}
            className="flex-1 bg-indigo-100 text-indigo-700 py-2 rounded-lg hover:bg-indigo-200 transition font-medium"
          >
            ดาวน์โหลดอีกครั้ง
          </button>
          <Link
            href="/"
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium text-center"
          >
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>ขอบคุณที่ใช้บริการ ProDriver Shop</p>
          <p>หากมีปัญหาติดต่อ: 081-234-5678</p>
        </div>
      </div>
    </div>
  );
}
