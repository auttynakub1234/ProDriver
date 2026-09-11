# ProDriver Mod APK Shop

ระบบขายสินค้า Mod APK พร้อมระบบ Token Authentication และ Telegram Notification

## 🚀 คุณสมบัติหลัก

- ✅ ระบบ Authentication ด้วย JWT Token
- ✅ ระบบ License Key ผูกกับ Device ID
- ✅ แจ้งเตือนผ่าน Telegram Bot เมื่อมีการเปิดใช้งานคีย์
- ✅ ป้องกันการแชร์คีย์ (1 Key = 1 Device)
- ✅ รองรับ MongoDB สำหรับฐานข้อมูล
- ✅ พร้อม Deploy บน Vercel

## 📦 เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Styling**: Tailwind CSS
- **Notification**: Telegram Bot API

## 🛠️ การติดตั้ง

1. Clone โปรเจกต์และติดตั้ง dependencies:
```bash
npm install
```

2. สร้างไฟล์ `.env.local` และกำหนดค่าต่อไปนี้:
```env
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/modapk-shop
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhI-YourBotToken
TELEGRAM_CHAT_ID=-1001234567890
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. รันโปรเจกต์:
```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## 📱 Android Client (Java/Kotlin)

### ดึง Device ID:
```kotlin
import android.provider.Settings
import android.content.Context

fun getDeviceId(context: Context): String {
    return Settings.Secure.getString(
        context.contentResolver,
        Settings.Secure.ANDROID_ID
    ) ?: "UNKNOWN_DEVICE"
}
```

### เปิดใช้งานคีย์:
```kotlin
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

fun activateKey(key: String, deviceId: String) {
    val url = "https://your-domain.vercel.app/api/activate"
    val client = OkHttpClient()
    
    val json = JSONObject().apply {
        put("key", key)
        put("deviceId", deviceId)
    }
    
    val mediaType = "application/json".toMediaType()
    val body = json.toString().toRequestBody(mediaType)
    
    val request = Request.Builder()
        .url(url)
        .post(body)
        .build()
    
    client.newCall(request).enqueue(object : Callback {
        override fun onResponse(call: Call, response: Response) {
            val responseData = response.body?.string()
            val jsonResponse = JSONObject(responseData ?: "")
            
            if (jsonResponse.getBoolean("success")) {
                val token = jsonResponse.getString("token")
                val product = jsonResponse.getJSONObject("product")
                // บันทึก token และข้อมูลสินค้า
            }
        }
        
        override fun onFailure(call: Call, e: IOException) {
            e.printStackTrace()
        }
    })
}
```

อย่าลืมเพิ่มใน `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## 🚀 Deploy บน Vercel

1. Push โค้ดขึ้น GitHub
2. ไปที่ [Vercel Dashboard](https://vercel.com)
3. Import โปรเจกต์จาก GitHub
4. เพิ่ม Environment Variables ใน Project Settings
5. Deploy!

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ

### License
- `POST /api/activate` - เปิดใช้งานคีย์

### Products
- `GET /api/products` - ดึงรายการสินค้า

## 🔐 ความปลอดภัย

- ใช้ JWT Token สำหรับ Authentication
- รหัสผ่านเข้ารหัสด้วย bcrypt
- ผูก Device ID กับคีย์เพื่อป้องกันการแชร์
- ใช้ ProGuard/R8 สำหรับ Android APK
- แจ้งเตือนผ่าน Telegram เมื่อมีการเปิดใช้งานคีย์

## 📝 License

MIT License

---

Made with ❤️ by ProDriver Team
