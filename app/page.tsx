import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">ProDriver Shop</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/activate"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                เปิดใช้งานคีย์
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ยินดีต้อนรับสู่ ProDriver Mod APK Shop
          </h2>
          <p className="text-xl text-gray-600">
            แอปพลิเคชัน Mod คุณภาพสูง พร้อมระบบ License Key
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">ระบบ License ปลอดภัย</h3>
            <p className="text-gray-600">
              ผูกกับเครื่องของคุณ ป้องกันการแชร์คีย์
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">เปิดใช้งานทันที</h3>
            <p className="text-gray-600">
              รับคีย์ทันทีหลังชำระเงิน เปิดใช้งานง่าย
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">รองรับทุกอุปกรณ์</h3>
            <p className="text-gray-600">
              ใช้งานได้กับ Android ทุกรุ่น
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold mb-6">สินค้ายอดนิยม</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-40 rounded-md mb-4 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">ProDriver Premium</h4>
              <p className="text-gray-600 text-sm mb-4">
                ฟีเจอร์พรีเมียมครบ ปลดล็อกทุกอย่าง
              </p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-bold">฿299</span>
                <a
                  href="https://line.me/ti/p/YOUR_LINE_ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  สั่งซื้อทาง LINE
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-3">📋 ขั้นตอนการสั่งซื้อ</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>ติดต่อผ่าน LINE เพื่อสั่งซื้อสินค้า</li>
            <li>โอนเงินและส่งหลักฐานการโอนเงิน</li>
            <li>รับ License Key ผ่าน LINE</li>
            <li>ดาวน์โหลด APK และเปิดใช้งานด้วย Key ที่ได้รับ</li>
            <li>แอปจะส่ง Device ID ไปยังระบบอัตโนมัติ</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
