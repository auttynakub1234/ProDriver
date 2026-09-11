# ProDriver - PostgreSQL Setup Guide

## ✅ เปลี่ยนจาก MongoDB เป็น PostgreSQL สำเร็จ!

ระบบใช้ **Prisma ORM** + **PostgreSQL** แทน MongoDB แล้ว

---

## 🚀 Quick Setup (Vercel Postgres - แนะนำ!)

### 1. Deploy โปรเจกต์บน Vercel ก่อน
```bash
git add .
git commit -m "Migrate to PostgreSQL with Prisma"
git push origin main
```

### 2. สร้าง Database บน Vercel
1. ไปที่ Vercel Dashboard → เลือกโปรเจกต์ ProDriver
2. คลิกแท็บ **Storage**
3. กด **Create Database**
4. เลือก **Postgres**
5. กรอกชื่อ Database: `prodriver`
6. กด **Create**
7. Environment Variables จะถูกเพิ่มอัตโนมัติ:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

### 3. เพิ่ม Environment Variables อื่นๆ
ไปที่ Settings → Environment Variables เพิ่ม:
```
JWT_SECRET=your-super-secret-jwt-key-32-chars-minimum
TELEGRAM_BOT_TOKEN=1234567890:ABC...
TELEGRAM_CHAT_ID=123456789
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-password
```

### 4. Redeploy
- Deployments → คลิก 3 จุด → **Redeploy**

---

## 💻 Local Development

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า .env.local
คัดลอก Environment Variables จาก Vercel:
```env
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
JWT_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

### 3. สร้างตาราง Database
```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. รัน Development Server
```bash
npm run dev
```

เปิด http://localhost:3000

---

## 📊 Prisma Studio (Database GUI)

ดู/แก้ไขข้อมูลใน Database:
```bash
npx prisma studio
```

เปิด http://localhost:5555

---

## 🗄️ Database Schema

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
  features    String[]
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

## 📝 Prisma Commands

### Migration (เปลี่ยนแปลง Schema)
```bash
# สร้าง migration ใหม่
npx prisma migrate dev --name add_new_field

# Deploy migration บน production
npx prisma migrate deploy

# Reset database (ลบข้อมูลทั้งหมด)
npx prisma migrate reset
```

### Generate Client
```bash
npx prisma generate
```

### Database Management
```bash
# เปิด Prisma Studio
npx prisma studio

# Pull schema จาก database
npx prisma db pull

# Push schema ไป database (ไม่สร้าง migration)
npx prisma db push
```

---

## 🔄 เปรียบเทียบ Code

### เดิม (MongoDB):
```typescript
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

await connectDB();
const user = await User.findOne({ email });
```

### ใหม่ (Prisma):
```typescript
import { prisma } from "@/lib/prisma";

const user = await prisma.user.findUnique({
  where: { email }
});
```

---

## ✅ ข้อดี

1. **ง่ายกว่า** - ไม่ต้องตั้งค่า Network Access
2. **เร็วกว่า** - Prisma มี Connection Pooling
3. **Type-Safe** - TypeScript types อัตโนมัติ
4. **Free Tier ดี** - Vercel Postgres ฟรี 256 MB
5. **Integrated** - รวมกับ Vercel ไม่ต้องตั้งค่าแยก

---

## 🆘 Troubleshooting

### Migration Failed
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Client Out of Sync
```bash
npx prisma generate
```

### Cannot Connect to Database
- ตรวจสอบ Environment Variables ถูกต้อง
- ตรวจสอบ `POSTGRES_PRISMA_URL` มี `?pgbouncer=true`

---

## 📚 Resources

- Prisma Docs: https://www.prisma.io/docs
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Prisma Schema: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

---

เสร็จแล้ว! ระบบพร้อมใช้งานด้วย PostgreSQL 🎉
