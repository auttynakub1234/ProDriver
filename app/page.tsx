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
              <Link href="/login" className="text-gray-700 hover:text-indigo-600">
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                สมัครสมาชิก
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
            {/* Product cards will be populated from database */}
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-40 rounded-md mb-4 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Sample Mod APK</h4>
              <p className="text-gray-600 text-sm mb-4">
                รายละเอียดสินค้าจะแสดงที่นี่
              </p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-bold">฿299</span>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  ซื้อเลย
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
