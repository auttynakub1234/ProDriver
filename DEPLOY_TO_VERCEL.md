# 🚀 คู่มือ Deploy ProDriver ไป Vercel

## ✅ Checklist ก่อน Deploy

- [ ] มี GitHub Account
- [ ] มี Vercel Account (สมัครฟรีที่ [vercel.com](https://vercel.com))
- [ ] มี Supabase Account (สมัครฟรีที่ [supabase.com](https://supabase.com))
- [ ] มี Telegram Bot Token (Optional)

---

## 📝 ขั้นตอนการ Deploy

### 1️⃣ เตรียม Database (Supabase)

1. ไปที่ [supabase.com](https://supabase.com) และสร้าง Project ใหม่
2. รอ Project สร้างเสร็จ (ประมาณ 2-3 นาที)
3. ไปที่ **Settings** → **Database**
4. คัดลอก **Connection String** (โหมด: **Transaction**)
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. เปิด **SQL Editor** และรันคำสั่ง:

```sql
-- สร้างตารางทั้งหมด (Copy จาก prisma/schema.prisma)
-- หรือใช้ Prisma Push หลัง Deploy
```

### 2️⃣ Push โค้ดไป GitHub

```bash
# ตรวจสอบว่าอยู่ใน main branch
git branch

# ถ้ายังไม่มี remote repository
git remote add origin https://github.com/YOUR_USERNAME/ProDriver.git

# Commit ทุกอย่าง
git add .
git commit -m "Ready to deploy to Vercel"

# Push ขึ้น GitHub
git push -u origin main
```

### 3️⃣ Deploy ไป Vercel

1. ไปที่ [vercel.com](https://vercel.com/new)
2. กด **Import Project**
3. เลือก Repository: **ProDriver**
4. กด **Import**

#### ⚙️ ตั้งค่า Build Settings:
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### 🔐 ตั้งค่า Environment Variables:

คลิก **Environment Variables** และเพิ่ม:

```env
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

JWT_SECRET=your-32-character-secret-key-minimum-length-here

ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password

TELEGRAM_BOT_TOKEN=123456789:ABCdefGhI...
TELEGRAM_CHAT_ID=-1001234567890

NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
```

**⚠️ สำคัญมาก:**
- `DATABASE_URL`: ใช้ connection string จาก Supabase
- `JWT_SECRET`: ต้องมีอย่างน้อย 32 ตัวอักษร (สุ่มเอา)
- `ADMIN_PASSWORD`: รหัสผ่าน Admin ของคุณ (อย่าใช้ 1234)
- `TELEGRAM_BOT_TOKEN`: (Optional) สร้างจาก @BotFather
- `NEXT_PUBLIC_APP_URL`: จะได้หลัง Deploy ครั้งแรก

5. กด **Deploy** และรอ 2-3 นาที

### 4️⃣ Setup Database Schema

หลัง Deploy สำเร็จ:

1. ไปที่ **Settings** → **Environment Variables**
2. ตรวจสอบว่า `DATABASE_URL` ถูกต้อง
3. ไปที่ **Deployments** → เลือก Deployment ล่าสุด → **View Function Logs**
4. รัน Prisma Push ผ่าน Terminal:

```bash
# ในเครื่อง local
npx prisma db push --schema=./prisma/schema.prisma
```

หรือ:

1. ไปที่ Supabase SQL Editor
2. รันคำสั่ง SQL จากไฟล์ `setup-database.sql`

### 5️⃣ ทดสอบระบบ

1. เปิดเว็บไซต์: `https://your-project-name.vercel.app`
2. ทดสอบหน้าแรก: ดูว่าโหลดได้หรือไม่
3. Login Admin: `/admin/login`
   - Username: ตาม `ADMIN_USERNAME`
   - Password: ตาม `ADMIN_PASSWORD`
4. สร้าง Product ใหม่
5. สร้าง Token
6. ทดสอบ Login ด้วย Token: `/login`
7. ทดสอบดาวน์โหลด

---

## 🔧 หลัง Deploy แล้ว

### อัปเดต URL ใน Environment Variables

1. คัดลอก URL จาก Vercel: `https://your-project-name.vercel.app`
2. ไปที่ **Settings** → **Environment Variables**
3. แก้ไข `NEXT_PUBLIC_APP_URL` เป็น URL ที่ได้
4. กด **Save**
5. ไปที่ **Deployments** → **Redeploy**

### เชื่อม Custom Domain (Optional)

1. ไปที่ **Settings** → **Domains**
2. เพิ่ม Domain ของคุณ
3. ตั้งค่า DNS ตามที่ Vercel บอก
4. รอ SSL Certificate สร้างเสร็จ (5-10 นาที)

---

## 🐛 การแก้ปัญหา

### Build Failed - Prisma Error

```bash
Error: @prisma/client did not initialize yet
```

**วิธีแก้:**
1. ตรวจสอบ `DATABASE_URL` ใน Environment Variables
2. ตรวจสอบว่า Build Command เป็น: `prisma generate && next build`
3. Redeploy

### Database Connection Error

```bash
Error: Can't reach database server
```

**วิธีแก้:**
1. ตรวจสอบ Connection String จาก Supabase
2. ใช้ **Transaction** pooler (port 6543) ไม่ใช่ Session pooler
3. ตรวจสอบว่า Supabase Project ยัง Active อยู่

### Admin Login Failed

```bash
Invalid credentials
```

**วิธีแก้:**
1. ตรวจสอบ `ADMIN_USERNAME` และ `ADMIN_PASSWORD`
2. ต้องตรงกับที่ตั้งใน Environment Variables
3. Redeploy หลังแก้ไข Environment Variables

### Token Login Failed

```bash
รหัส Token ไม่ถูกต้อง
```

**วิธีแก้:**
1. ตรวจสอบว่ามี Token ในฐานข้อมูลหรือไม่
2. ไปที่ Admin Panel → สร้าง Token ใหม่
3. ทดสอบอีกครั้ง

---

## 📊 ตรวจสอบ Logs

### ดู Logs แบบ Real-time:

1. ไปที่ Vercel Dashboard
2. เลือก Project: **ProDriver**
3. ไปที่ **Deployments** → เลือก Deployment ล่าสุด
4. กด **View Function Logs**

### ดู Database Logs:

1. ไปที่ Supabase Dashboard
2. เลือก Project
3. ไปที่ **Logs** → **Postgres Logs**

---

## 🎯 Best Practices

### Security
- ✅ เปลี่ยน `ADMIN_PASSWORD` เป็นรหัสที่ปลอดภัย
- ✅ เปลี่ยน `JWT_SECRET` ทุกครั้งที่ Deploy ใหม่
- ✅ ใช้ HTTPS เท่านั้น (Vercel ใช้ HTTPS อัตโนมัติ)
- ✅ อย่าเปิดเผย `.env.local` หรือ Environment Variables

### Performance
- ✅ ใช้ Supabase Connection Pooling (port 6543)
- ✅ Enable Vercel Analytics (Free)
- ✅ ใช้ CDN สำหรับรูปภาพ (Cloudinary, Imgur)

### Monitoring
- ✅ เช็ค Vercel Analytics ทุกวัน
- ✅ เช็ค Supabase Usage (Database size, API calls)
- ✅ ตั้ง Telegram Alert สำหรับ Errors

---

## 💰 ค่าใช้จ่าย

### Vercel (Free Plan)
- ✅ 100 GB Bandwidth/เดือน
- ✅ Unlimited Deployments
- ✅ Automatic HTTPS
- ✅ Edge Functions
- **เพียงพอสำหรับเว็บขนาดเล็ก-กลาง**

### Supabase (Free Plan)
- ✅ 500 MB Database
- ✅ 2 GB Storage
- ✅ 50 MB File Uploads
- ✅ 500 GB Bandwidth/เดือน
- **เพียงพอสำหรับเริ่มต้น**

**หากเกิน:**
- Vercel Pro: $20/เดือน
- Supabase Pro: $25/เดือน

---

## 🎉 เสร็จแล้ว!

ระบบของคุณพร้อมใช้งานแล้วที่:
```
https://your-project-name.vercel.app
```

### Admin Panel:
```
https://your-project-name.vercel.app/admin/login
```

### Token Login:
```
https://your-project-name.vercel.app/login
```

---

## 📞 ติดปัญหา?

1. เช็ค Vercel Function Logs
2. เช็ค Supabase Logs
3. เช็ค Browser Console (F12)
4. อ่าน Error Message ให้ดี

---

**สร้างโดย:** ProDriver Team  
**Updated:** 2026-09-13  
**Version:** 1.0.0
