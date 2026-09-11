# การใช้ Supabase แทน Vercel Postgres (ง่ายที่สุด!)

## 🎯 ทำไมต้อง Supabase?

- ✅ **ฟรี 500 MB** (มากกว่า Vercel 2 เท่า)
- ✅ **Database พร้อมใช้ทันที** ไม่ต้องรอ deploy
- ✅ **ไม่ต้องแก้โค้ด** ใช้ Prisma เหมือนเดิม
- ✅ **Setup ง่าย 2 นาทีเสร็จ**

---

## 🚀 Setup Supabase (2 นาที)

### 1. สมัคร Supabase
1. ไปที่ https://supabase.com
2. คลิก **Start your project**
3. Sign in with GitHub (ใช้บัญชีเดียวกัน)

### 2. สร้าง Project
1. คลิก **New project**
2. กรอกข้อมูล:
   - **Name**: `ProDriver`
   - **Database Password**: สร้างรหัสผ่าน (คัดลอกเก็บไว้)
   - **Region**: `Southeast Asia (Singapore)` หรือใกล้ที่สุด
3. คลิก **Create new project**
4. รอ 2-3 นาที

### 3. คัดลอก Connection String
เมื่อ project พร้อม:
1. ไปที่ **Settings** (เมนูซ้าย)
2. คลิก **Database**
3. เลื่อนลงหา **Connection string**
4. เลือก **URI** (not Session pooling)
5. คัดลอก Connection String:
   ```
   postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```
6. แทนที่ `PASSWORD` ด้วยรหัสผ่านที่สร้างไว้

---

## ⚙️ ตั้งค่า Vercel

### 1. ไปที่ Vercel Project Settings
https://vercel.com/dashboard → เลือก ProDriver → Settings → Environment Variables

### 2. เพิ่ม Environment Variables
```
# Database (Supabase)
POSTGRES_PRISMA_URL = postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
DATABASE_URL = postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

# JWT
JWT_SECRET = your-super-secret-32-characters-minimum-length

# Telegram
TELEGRAM_BOT_TOKEN = 123456789:ABCdefGhIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID = 123456789

# Admin
ADMIN_USERNAME = admin
ADMIN_PASSWORD = your-secure-admin-password

# App URL
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
```

**เลือก Environment**: ✅ Production, ✅ Preview, ✅ Development (ทั้ง 3)

### 3. Redeploy
- Deployments → คลิก ... → **Redeploy**

---

## 🗄️ สร้างตาราง Database

Vercel จะรัน `prisma generate` อัตโนมัติ แต่ต้องสร้างตารางเอง:

### วิธีที่ 1: ใช้ Prisma Studio (แนะนำ)
1. ไปที่ Supabase Dashboard
2. SQL Editor (เมนูซ้าย)
3. คัดลอก SQL นี้:

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "License_key_key" ON "License"("key");

-- CreateIndex
CREATE INDEX "License_key_idx" ON "License"("key");

-- CreateIndex
CREATE INDEX "License_userId_idx" ON "License"("userId");

-- CreateIndex
CREATE INDEX "License_deviceId_idx" ON "License"("deviceId");

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

4. คลิก **Run** (Ctrl+Enter)
5. เสร็จ! ✅

### วิธีที่ 2: ใช้ Local Migration (ถ้าอยากทำแบบมืออาชีพ)
```bash
# ใส่ Connection String ใน .env
echo "DATABASE_URL=postgresql://..." > .env

# รัน Migration
npx prisma migrate dev --name init
```

---

## 🎯 เสร็จสมบูรณ์!

หลังจากทำตามขั้นตอนนี้:
1. ✅ Database พร้อมใช้งาน
2. ✅ Environment Variables ตั้งค่าครบ
3. ✅ Redeploy แล้ว
4. ✅ เว็บทำงานปกติ

---

## 📱 ทดสอบระบบ

### 1. เปิดเว็บ
```
https://your-domain.vercel.app
```

### 2. ทดสอบ Admin
```
https://your-domain.vercel.app/admin/login
Username: admin
Password: (ที่ตั้งไว้)
```

### 3. ทดสอบ API
```
GET https://your-domain.vercel.app/api/products
```

---

## 💡 ข้อดีของ Supabase

1. **Dashboard สวย** - ดู/แก้ไขข้อมูลได้ง่าย
2. **SQL Editor** - รัน SQL โดยตรง
3. **Table Editor** - แก้ไขข้อมูลแบบ GUI
4. **Real-time** - รองรับ subscriptions (ถ้าต้องการ)
5. **Auth** - มี Authentication ให้ใช้ (optional)
6. **Storage** - มี File Storage ฟรี 1 GB

---

## 🆘 หาก Build ยังไม่ผ่าน

เช็คที่ Vercel Build Logs:
- ถ้าเจอ "Prisma" error → ตรวจสอบ `POSTGRES_PRISMA_URL`
- ถ้าเจอ "Module not found" → Clear cache แล้ว redeploy

---

**เท่านี้ก็เสร็จหมดแล้วครับ! ไม่ต้องแก้โค้ดอีก ไม่ต้องรอ deploy ซ้ำซาก** 🎉
