# ProDriver - Complete System Documentation

## 📚 สารบัญเอกสาร

### การติดตั้งและตั้งค่า
- [MongoDB Setup](./MONGODB_SETUP.md) - ตั้งค่า MongoDB Atlas
- [Telegram Setup](./TELEGRAM_SETUP.md) - ตั้งค่า Telegram Bot
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Deploy บน Vercel

### การพัฒนา
- [Payment Integration](./PAYMENT_INTEGRATION.md) - เชื่อมต่อระบบชำระเงิน
- [Android Client](../android-client/README.md) - พัฒนาแอป Android

### การใช้งาน Admin
- [Admin Panel Guide](./ADMIN_PANEL.md) - คู่มือใช้งาน Admin Panel

---

## 🏗️ สถาปัตยกรรมระบบ

```
┌─────────────────┐
│  Android App    │ ←→ API (/api/activate)
└─────────────────┘
         ↓
┌─────────────────────────────────────┐
│         Next.js Backend             │
│  ┌──────────┐  ┌──────────────┐   │
│  │   API    │  │ Admin Panel  │   │
│  │ Routes   │  │              │   │
│  └──────────┘  └──────────────┘   │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│         MongoDB Atlas               │
│  • Users                            │
│  • Products                         │
│  • Licenses                         │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│    External Services                │
│  • Telegram Bot (แจ้งเตือน)        │
│  • Payment Gateway (ชำระเงิน)      │
│  • SendGrid (ส่งอีเมล)             │
└─────────────────────────────────────┘
```

---

## 🔑 คุณสมบัติหลัก

### ✅ ระบบ License Key
- สร้างคีย์อัตโนมัติหลังชำระเงิน
- ผูก Device ID กับคีย์ (1 Key = 1 Device)
- ป้องกันการแชร์คีย์
- ตรวจสอบวันหมดอายุ

### ✅ ระบบ Authentication
- Token-based (JWT)
- ไม่ต้อง Login/Register แบบปกติ
- เปิดใช้งานผ่านคีย์เท่านั้น

### ✅ Admin Panel
- จัดการสินค้า
- จัดการคีย์
- ดูสถิติการขาย
- ดูรายชื่อผู้ใช้

### ✅ Telegram Notification
- แจ้งเตือนเมื่อมีการเปิดใช้งานคีย์
- แสดง Device ID และข้อมูลสินค้า
- ส่งแจ้งเตือนแบบ Real-time

### ✅ Payment Integration
- รองรับ Webhook
- สร้างคีย์อัตโนมัติ
- ส่งอีเมลแจ้งลูกค้า

---

## 📱 Flow การใช้งาน

### สำหรับลูกค้า

```
1. เลือกซื้อสินค้าผ่านเว็บไซต์
   ↓
2. ชำระเงินผ่าน QR Code / บัตร
   ↓
3. ได้รับ License Key ทาง Email/LINE
   ↓
4. ดาวน์โหลดและติดตั้งแอป Android
   ↓
5. เปิดแอป → กรอก License Key
   ↓
6. แอปส่ง Key + Device ID ไปยัง API
   ↓
7. รับ Token และเริ่มใช้งาน ✅
```

### สำหรับ Admin

```
1. Login เข้า Admin Panel (/admin/login)
   ↓
2. ดู Dashboard (สถิติต่างๆ)
   ↓
3. จัดการสินค้า (เพิ่ม/แก้ไข/ลบ)
   ↓
4. จัดการคีย์ (สร้าง/ดู/ตรวจสอบ)
   ↓
5. ดูรายการผู้ใช้งาน
   ↓
6. รับแจ้งเตือนผ่าน Telegram เมื่อมีการเปิดใช้งานคีย์
```

---

## 🔐 ความปลอดภัย

### Backend
- ✅ JWT Token Authentication
- ✅ Webhook Signature Verification
- ✅ bcrypt Password Hashing
- ✅ Environment Variables
- ✅ HTTPS Only

### Android
- ✅ ProGuard Code Obfuscation
- ✅ Encrypted SharedPreferences
- ✅ SSL Certificate Pinning (แนะนำ)
- ✅ Root Detection (แนะนำ)

### Database
- ✅ MongoDB Atlas (Encryption at Rest)
- ✅ IP Whitelist / Network Access
- ✅ Database User Authentication

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/auttynakub1234/ProDriver.git
cd ProDriver
npm install
```

### 2. Environment Setup
สร้างไฟล์ `.env.local`:
```env
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb+srv://...
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_CHAT_ID=123456789
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

### 3. Run Development
```bash
npm run dev
```

เปิด http://localhost:3000

### 4. Deploy
```bash
git push origin main
# Deploy บน Vercel จาก GitHub
```

---

## 📊 API Endpoints

### Public APIs
- `GET /api/products` - ดึงรายการสินค้า
- `POST /api/activate` - เปิดใช้งานคีย์

### Admin APIs (ต้องมี Token)
- `GET /api/admin/stats` - สถิติทั้งหมด
- `GET /api/admin/licenses` - รายการคีย์
- `POST /api/admin/licenses` - สร้างคีย์ใหม่
- `POST /api/admin/login` - Admin Login

### Payment APIs
- `POST /api/payment/create` - สร้าง Payment Link
- `POST /api/webhook/payment` - รับ Webhook จาก Payment Gateway

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- MongoDB + Mongoose
- JWT Authentication
- Telegram Bot API

### Android
- Java / Kotlin
- OkHttp (HTTP Client)
- Gson (JSON Parsing)
- Encrypted SharedPreferences

### Deployment
- Vercel (Frontend + API)
- MongoDB Atlas (Database)
- Telegram (Notifications)

---

## 📞 Support

- GitHub Issues: https://github.com/auttynakub1234/ProDriver/issues
- Email: support@prodriver.com
- Telegram: @prodriver_support

---

## 📝 License

MIT License - ดูรายละเอียดใน LICENSE file

---

## 🎉 Credits

Made with ❤️ by ProDriver Team  
Powered by Claude Code
