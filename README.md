# ProDriver - Mod APK Shop System

## 🎉 ระบบสมบูรณ์และพร้อมใช้งาน!

ระบบขายและจัดการ License Key สำหรับ Mod APK พร้อมระบบ Token Authentication

---

## ✨ Features

### 🌐 Web Application
- ✅ หน้าแรก - แสดงสินค้าและข้อมูล
- ✅ หน้าเปิดใช้งานคีย์ - ใช้ License Key + Device ID
- ✅ Dashboard - หลังเปิดใช้งานแล้ว
- ✅ Token-based Authentication (JWT)

### 👨‍💼 Admin Panel
- ✅ Dashboard พร้อมสถิติ
- ✅ จัดการสินค้า (CRUD)
- ✅ จัดการ License Keys (สร้าง/ดู/ตรวจสอบ)
- ✅ จัดการผู้ใช้
- ✅ Login: `/admin/login` (admin/admin123)

### 📱 Android Client
- ✅ Java + Kotlin พร้อมใช้
- ✅ Encrypted SharedPreferences
- ✅ ProGuard Obfuscation
- ✅ Device ID Detection
- ✅ API Integration

### 💳 Payment System
- ✅ Webhook Endpoint
- ✅ Auto License Key Generation
- ✅ Signature Verification
- ✅ รองรับหลาย Payment Gateway

### 🔔 Notifications
- ✅ Telegram Bot Integration
- ✅ แจ้งเตือนเมื่อมีการเปิดใช้งานคีย์
- ✅ แสดง Device ID และข้อมูลสินค้า

---

## 🗄️ Database

**Current**: SQLite (Development)
- ✅ ไม่ต้องตั้งค่าอะไร
- ✅ ไฟล์เดียว: `prisma/dev.db`
- ✅ พร้อมใช้งานทันที

**Production**: Supabase (Recommended)
- ฟรี 500 MB
- ดูวิธีตั้งค่า: `docs/SUPABASE_SETUP.md`

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/auttynakub1234/ProDriver.git
cd ProDriver
npm install
```

### 2. Setup Environment
แก้ไข `.env.local`:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your-32-character-secret-key-here
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_CHAT_ID=123456789
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-password
```

### 3. Create Database
```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development
```bash
npm run dev
```

เปิด http://localhost:3000

---

## 📁 Project Structure

```
ProDriver/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── activate/         # License activation
│   │   ├── admin/            # Admin APIs
│   │   ├── products/         # Products API
│   │   ├── payment/          # Payment creation
│   │   └── webhook/          # Payment webhook
│   ├── admin/                # Admin Panel
│   ├── activate/             # Activation page
│   ├── dashboard/            # User dashboard
│   └── page.tsx              # Home page
├── lib/                      # Libraries
│   ├── prisma.ts             # Prisma client
│   ├── jwt.ts                # JWT utilities
│   ├── telegram.ts           # Telegram bot
│   └── adminAuth.ts          # Admin auth
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── dev.db                # SQLite database
├── android-client/           # Android code
├── docs/                     # Documentation
│   ├── SQLITE_SETUP.md       # SQLite guide
│   ├── SUPABASE_SETUP.md     # Supabase guide
│   ├── TELEGRAM_SETUP.md     # Telegram bot
│   └── PAYMENT_INTEGRATION.md
├── scripts/                  # Testing scripts
│   ├── find-chat-id.js       # Find Telegram Chat ID
│   └── test-telegram.js      # Test Telegram bot
└── types/
    └── index.ts              # TypeScript types
```

---

## 🔐 Security Features

- ✅ JWT Token Authentication
- ✅ bcrypt Password Hashing
- ✅ Device ID Binding (1 Key = 1 Device)
- ✅ Webhook Signature Verification
- ✅ Environment Variables
- ✅ HTTPS Only (Production)
- ✅ ProGuard Code Obfuscation (Android)
- ✅ Encrypted SharedPreferences (Android)

---

## 📱 API Endpoints

### Public APIs
```
GET  /api/products          # รายการสินค้า
POST /api/activate          # เปิดใช้งานคีย์
```

### Admin APIs (ต้องมี Token)
```
POST /api/admin/login       # Admin login
GET  /api/admin/stats       # สถิติ
GET  /api/admin/licenses    # รายการคีย์
POST /api/admin/licenses    # สร้างคีย์ใหม่
```

### Payment APIs
```
POST /api/payment/create    # สร้าง payment link
POST /api/webhook/payment   # รับ webhook
```

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Prisma ORM
- SQLite (Dev) / PostgreSQL (Prod)
- JWT Authentication

### Android
- Java / Kotlin
- OkHttp
- Gson
- Encrypted SharedPreferences
- ProGuard

### External Services
- Telegram Bot API
- Payment Gateway (GB Prime Pay, Omise, etc.)
- Supabase (optional)

---

## 📖 Documentation

- [SQLite Setup](docs/SQLITE_SETUP.md) - Development database
- [Supabase Setup](docs/SUPABASE_SETUP.md) - Production database
- [Telegram Setup](docs/TELEGRAM_SETUP.md) - Bot configuration
- [Payment Integration](docs/PAYMENT_INTEGRATION.md) - Payment gateway
- [Android Client](android-client/README.md) - Mobile app
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Vercel deployment

---

## 🎯 Usage Flow

### For Customers
1. ซื้อสินค้าผ่านเว็บไซต์/LINE
2. ชำระเงิน (QR Code / บัตร)
3. ได้รับ License Key ทาง Email/LINE
4. ดาวน์โหลดและติดตั้ง APK
5. เปิดแอป → กรอก License Key
6. แอปส่ง Key + Device ID → API
7. รับ Token และเริ่มใช้งาน ✅

### For Admin
1. Login ที่ `/admin/login`
2. ดู Dashboard (สถิติต่างๆ)
3. จัดการสินค้า
4. สร้าง/ดู License Keys
5. รับแจ้งเตือนผ่าน Telegram

---

## 🧪 Testing

### Test Telegram Bot
```bash
# หา Chat ID
node scripts/find-chat-id.js

# ทดสอบส่งข้อความ
node scripts/test-telegram.js
```

### Test API
```bash
# Get products
curl http://localhost:3000/api/products

# Activate key
curl -X POST http://localhost:3000/api/activate \
  -H "Content-Type: application/json" \
  -d '{"key":"XXXX-XXXX-XXXX-XXXX","deviceId":"test123"}'
```

### Database Management
```bash
# Prisma Studio (GUI)
npx prisma studio

# Migrate
npx prisma migrate dev

# Generate Client
npx prisma generate
```

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add Environment Variables
4. Setup Supabase Database
5. Deploy!

ดูคู่มือเต็ม: `docs/DEPLOYMENT_GUIDE.md`

---

## 📝 Environment Variables

```env
# Database
DATABASE_URL="file:./prisma/dev.db"              # SQLite (dev)
# DATABASE_URL="postgresql://..."                 # PostgreSQL (prod)

# JWT
JWT_SECRET=your-super-secret-32-characters-minimum

# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhI...
TELEGRAM_CHAT_ID=123456789

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-password-here

# Payment (optional)
PAYMENT_WEBHOOK_SECRET=your-webhook-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
npx prisma db push
npx prisma generate
```

### Build Error on Vercel
- ตรวจสอบ Environment Variables
- ตรวจสอบ `package.json` dependencies
- ตรวจสอบ Prisma schema

### Telegram Not Working
- ตรวจสอบ Bot Token
- ตรวจสอบ Chat ID
- รัน `node scripts/test-telegram.js`

---

## 📊 Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      String   @default("user")
  licenses  License[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  features    String   // JSON string
  price       Float
  downloadUrl String
  category    String
  licenses    License[]
}

model License {
  id          String    @id @default(cuid())
  key         String    @unique
  productId   String
  userId      String
  deviceId    String?
  isActivated Boolean   @default(false)
  activatedAt DateTime?
  product     Product   @relation(...)
  user        User      @relation(...)
}
```

---

## 🤝 Contributing

Pull requests are welcome! เปิด issue หรือแจ้งปัญหาได้ที่ GitHub

---

## 📄 License

MIT License - ใช้งานได้ฟรี

---

## 📞 Support

- GitHub: https://github.com/auttynakub1234/ProDriver
- Email: support@prodriver.com (example)

---

## 🎉 Credits

Made with ❤️ by ProDriver Team  
Powered by Claude Code & Next.js

---

**เวอร์ชันล่าสุด**: v1.0.0  
**อัปเดตล่าสุด**: 2026-09-11  
**สถานะ**: ✅ พร้อมใช้งาน
