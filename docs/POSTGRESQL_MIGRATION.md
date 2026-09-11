# PostgreSQL Migration Guide

## 🐘 ใช้ PostgreSQL แทน MongoDB

PostgreSQL ง่ายกว่าและมี Free Tier ดีกว่า MongoDB Atlas

---

## 🆓 ตัวเลือก Free PostgreSQL

### 1. **Vercel Postgres** (แนะนำที่สุด!)
- ✅ ฟรี 256 MB
- ✅ เชื่อมต่อง่าย (1 คลิก)
- ✅ ไม่ต้องสมัครอะไรเพิ่ม
- ✅ Deploy ด้วยกันกับ Vercel

**วิธีตั้งค่า:**
1. ไปที่ Vercel Dashboard → โปรเจกต์ ProDriver
2. คลิกแท็บ **Storage**
3. กด **Create Database**
4. เลือก **Postgres**
5. กด **Create** → เสร็จ!
6. Environment Variables จะถูกเพิ่มอัตโนมัติ

### 2. **Supabase** (ทางเลือกที่ 2)
- ✅ ฟรี 500 MB
- ✅ มี Dashboard สวย
- ✅ รองรับ Realtime
- เว็บไซต์: https://supabase.com

### 3. **Neon** 
- ✅ ฟรี 512 MB
- ✅ Serverless Postgres
- เว็บไซต์: https://neon.tech

---

## 🔧 ติดตั้ง Prisma (ORM สำหรับ PostgreSQL)

```bash
npm install @prisma/client
npm install -D prisma
```

---

## 📝 สร้าง Schema

สร้างไฟล์ `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  licenses  License[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  features    String[]
  price       Float
  downloadUrl String
  imageUrl    String?
  category    String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
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
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  product     Product   @relation(fields: [productId], references: [id])
  user        User      @relation(fields: [userId], references: [id])
  
  @@index([key])
  @@index([userId])
  @@index([deviceId])
}
```

---

## 🚀 Migration Commands

```bash
# สร้างตาราง
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# ดู Database ผ่าน GUI
npx prisma studio
```

---

## 📄 ตัวอย่างการใช้งาน

### 1. สร้าง Prisma Client

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 2. ใช้ใน API Route

```typescript
// app/api/activate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, deviceId } = body;

    // ค้นหาคีย์
    const license = await prisma.license.findUnique({
      where: { key: key.toUpperCase() },
      include: {
        product: true,
        user: true,
      },
    });

    if (!license) {
      return NextResponse.json(
        { success: false, message: "คีย์ไม่ถูกต้อง" },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าเปิดใช้งานแล้วหรือไม่
    if (license.isActivated) {
      if (license.deviceId === deviceId) {
        // เครื่องเดียวกัน
        const token = signToken({
          userId: license.userId,
          email: license.user.email,
          role: license.user.role,
        });

        return NextResponse.json({
          success: true,
          message: "เข้าสู่ระบบสำเร็จ",
          token,
          product: {
            name: license.product.name,
            downloadUrl: license.product.downloadUrl,
          },
        });
      } else {
        return NextResponse.json(
          { success: false, message: "คีย์ถูกใช้กับเครื่องอื่นแล้ว" },
          { status: 403 }
        );
      }
    }

    // เปิดใช้งานคีย์
    const updatedLicense = await prisma.license.update({
      where: { id: license.id },
      data: {
        isActivated: true,
        deviceId: deviceId,
        activatedAt: new Date(),
      },
    });

    // ส่งแจ้งเตือน Telegram
    await sendTelegramNotification({
      key: key.toUpperCase(),
      deviceId,
      productName: license.product.name,
      userEmail: license.user.email,
    });

    const token = signToken({
      userId: license.userId,
      email: license.user.email,
      role: license.user.role,
    });

    return NextResponse.json({
      success: true,
      message: "เปิดใช้งานคีย์สำเร็จ",
      token,
      product: {
        name: license.product.name,
        downloadUrl: license.product.downloadUrl,
      },
    });
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
```

---

## 📦 อัปเดต package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
```

---

## 🔐 Environment Variables

### Local (`.env.local`):
```env
# Vercel Postgres (จะได้จาก Vercel Storage)
POSTGRES_URL="postgresql://user:password@host:5432/dbname"
POSTGRES_PRISMA_URL="postgresql://user:password@host:5432/dbname?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:5432/dbname"

# หรือ Supabase
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"

# ของเดิม
JWT_SECRET=your-secret
TELEGRAM_BOT_TOKEN=123:ABC
TELEGRAM_CHAT_ID=123456
```

---

## 📊 เปรียบเทียบ

| Feature | MongoDB Atlas | Vercel Postgres |
|---------|--------------|-----------------|
| Free Storage | 512 MB | 256 MB |
| Setup Time | 5-10 นาที | 1 คลิก |
| Connection | ต้องตั้งค่า IP | ไม่ต้อง |
| Learning Curve | ปานกลาง | ง่าย |
| Integration | แยกต่างหาก | รวมกับ Vercel |

---

## ✅ ข้อดีของ PostgreSQL

1. **ง่ายกว่า** - ไม่ต้องตั้งค่า Network Access
2. **เร็วกว่า** - เชื่อมต่อกับ Vercel ได้เร็ว
3. **Prisma** - ORM ที่ดีที่สุดสำหรับ TypeScript
4. **Type Safety** - มี TypeScript types อัตโนมัติ

---

## 🚀 Quick Start (Vercel Postgres)

1. Deploy โปรเจกต์บน Vercel
2. Storage → Create Database → Postgres
3. Environment Variables จะถูกเพิ่มอัตโนมัติ
4. รันคำสั่ง:
   ```bash
   npm install @prisma/client prisma -D
   npx prisma init
   # แก้ไข prisma/schema.prisma (ตามด้านบน)
   npx prisma migrate dev
   ```
5. Redeploy บน Vercel
6. เสร็จ! ✅

---

ต้องการให้ผมแปลงโค้ดทั้งหมดจาก MongoDB เป็น PostgreSQL/Prisma ให้ไหมครับ?
