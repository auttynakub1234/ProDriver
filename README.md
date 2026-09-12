# ProDriver - Mod APK Shop System

## 🎉 ระบบสมบูรณ์และพร้อมใช้งาน!

ระบบขายและจัดการ Mod APK พร้อมระบบ Token Authentication (ไม่ล็อก Device ID)

---

## ✨ Features

### 🌐 Web Application
- ✅ หน้าแรก - แสดงสินค้าและข้อมูล
- ✅ Login ด้วย Token (8 หลัก) - ไม่ล็อก Device ID
- ✅ ดาวน์โหลด APK ได้หลายเครื่อง
- ✅ ติดตามจำนวนดาวน์โหลด

### 👨‍💼 Admin Panel
- ✅ Dashboard พร้อมสถิติ
- ✅ จัดการสินค้า (CRUD)
- ✅ จัดการ Token (สร้าง/ดู/ติดตาม) - ไม่ล็อก Device ID
- ✅ ติดตามการดาวน์โหลด
- ✅ Login: `/admin/login` (ตั้งค่าใน ENV)

### 📱 Android Client
- ⚠️ ไม่จำเป็นอีกต่อไป - ระบบใหม่ใช้ Token แทน
- ดาวน์โหลด APK ได้จากเว็บโดยตรง
- ไม่ต้องส่ง Device ID

### 💳 Payment System
- ✅ Webhook Endpoint
- ✅ Auto License Key Generation
- ✅ Signature Verification
- ✅ รองรับหลาย Payment Gateway

### 🔔 Notifications
- ✅ Telegram Bot Integration
- ✅ แจ้งเตือนเมื่อมีการดาวน์โหลด
- ✅ แสดง Token และข้อมูลสินค้า

---

## 🗄️ Database

**Current**: PostgreSQL (Supabase)
- ✅ Production ready
- ✅ ฟรี 500 MB
- ✅ Connection Pooling
- ดูวิธีตั้งค่า: `docs/SUPABASE_SETUP.md`

**Development**: SQLite (Optional)
- ใช้สำหรับ local development
- ไฟล์เดียว: `prisma/dev.db`

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
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET=your-32-character-secret-key-here
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_CHAT_ID=123456789
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
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

- ✅ Token Authentication (8-digit codes)
- ✅ bcrypt Password Hashing
- ✅ **ไม่ล็อก Device ID** - ใช้ได้หลายเครื่อง
- ✅ ติดตามการดาวน์โหลด (IP, User Agent)
- ✅ กำหนดวันหมดอายุ Token ได้
- ✅ Environment Variables
- ✅ HTTPS Only (Production)

---

## 📱 API Endpoints

### Public APIs
```
GET  /api/products          # รายการสินค้า
POST /api/token/login       # Login ด้วย Token (8 หลัก)
```

### Admin APIs (ต้อง Login)
```
POST /api/admin/login       # Admin login
GET  /api/admin/stats       # สถิติ
GET  /api/admin/tokens      # รายการ Token
POST /api/admin/tokens      # สร้าง Token ใหม่
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
2. ชำระเงิน (PromptPay)
3. ได้รับ Token (8 หลัก) ทาง LINE
4. เข้าเว็บไซต์ `/login`
5. กรอก Token 8 หลัก
6. ดาวน์โหลด APK ได้เลย ✅
7. **ใช้ได้หลายเครื่อง** - ไม่ล็อก Device ID

### For Admin
1. Login ที่ `/admin/login`
2. ดู Dashboard (สถิติต่างๆ)
3. จัดการสินค้า
4. สร้าง Token ให้ลูกค้า (8 หลัก)
5. ส่ง Token ให้ลูกค้าทาง LINE
6. รับแจ้งเตือนผ่าน Telegram (optional)

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
model Product {
  id               String    @id @default(cuid())
  name             String
  description      String
  features         String    // JSON array
  price            Float
  apkUrl           String
  category         String
  version          String?
  size             String?
  tokens           Token[]
  downloads        Download[]
}

model Token {
  id            String    @id @default(cuid())
  token         String    @unique  // 8 หลัก
  productId     String
  customerName  String
  customerPhone String
  downloadCount Int       @default(0)
  lastUsedAt    DateTime?
  expiresAt     DateTime?
  product       Product   @relation(...)
  downloads     Download[]
}

model Download {
  id           String   @id @default(cuid())
  tokenId      String
  productId    String
  ipAddress    String?
  userAgent    String?
  downloadedAt DateTime @default(now())
  token        Token    @relation(...)
  product      Product  @relation(...)
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
