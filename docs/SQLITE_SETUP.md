# ใช้ SQLite แทน PostgreSQL (ง่ายที่สุด!)

## ✅ ทำไมต้อง SQLite?

- ✅ **ไม่ต้องตั้งค่าอะไรเลย** - แค่ไฟล์เดียว
- ✅ **ไม่ต้องสมัครบริการ** - ไม่ต้อง Supabase, Vercel Postgres
- ✅ **ใช้งานได้ทันที** - npm install แล้วรันได้เลย
- ✅ **เหมาะกับเว็บเล็กๆ** - เก็บข้อมูลได้หลักพัน-หมื่นรายการ
- ✅ **Deploy ง่าย** - ไฟล์ database อยู่ในโปรเจกต์เลย

---

## 🚀 เปลี่ยนเป็น SQLite (1 นาที)

### 1. แก้ไข `prisma/schema.prisma`
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 2. แก้ไข `.env.local`
```env
DATABASE_URL="file:./prisma/dev.db"
```

### 3. สร้าง Database และตาราง
```bash
npx prisma migrate dev --name init
```

### 4. รัน Development Server
```bash
npm run dev
```

---

## ✅ เสร็จแล้ว!

- Database: `prisma/dev.db` (ไฟล์เดียว)
- ไม่ต้อง username/password
- ไม่ต้องเชื่อมต่อ server
- ไม่ต้องตั้งค่าอะไร

---

## 🌐 Deploy บน Vercel

SQLite ไม่เหมาะกับ Vercel (Serverless ไม่มี persistent storage)

**ทางเลือก:**
1. **Development**: ใช้ SQLite (local)
2. **Production**: ใช้ Supabase หรือ Vercel Postgres (ตาม docs/SUPABASE_SETUP.md)

หรือใช้ **Turso** (SQLite for production):
- https://turso.tech
- Free 9 GB
- SQLite-compatible

---

## 🔄 สลับระหว่าง SQLite และ PostgreSQL

### Development (Local):
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Production (Vercel):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 💡 ข้อดี-ข้อเสีย

### ✅ ข้อดี:
- Setup ง่ายที่สุด
- ไม่ต้องจ่ายเงิน
- Performance ดี (local file)
- Backup ง่าย (คัดลอกไฟล์)

### ⚠️ ข้อเสีย:
- ไม่เหมาะกับ Serverless (Vercel)
- ไม่มี concurrent writes มาก
- ต้องมี persistent storage

---

## 🎯 สรุป

**Development**: ใช้ SQLite (ง่ายสุด)  
**Production**: ใช้ Supabase (ฟรี 500 MB)

เท่านี้ไม่ต้องปวดหัวเรื่อง database อีก! 🎉
