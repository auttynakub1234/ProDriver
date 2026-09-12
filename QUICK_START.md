# 🚀 Quick Start - Deploy to Vercel

## ⚡ ขั้นตอนย่อ (5 นาที)

### 1. เตรียม Supabase Database

```bash
# ไปที่ https://supabase.com
# สร้างโปรเจคใหม่
# คัดลอก Connection String (Pooler)
```

### 2. Push to GitHub

```bash
git add .
git commit -m "Ready for production

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

### 3. Deploy to Vercel

1. ไปที่ https://vercel.com/new
2. Import repository
3. เพิ่ม Environment Variables:

```env
DATABASE_URL="postgresql://postgres.[project]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
JWT_SECRET="your-random-32-character-secret-key-here-change-this"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

4. กด **Deploy**

### 4. Setup Database

```bash
# หลัง Deploy สำเร็จ
# ไปที่ Supabase SQL Editor และรัน:

-- คัดลอกจากไฟล์ supabase/setup.sql
-- หรือใช้ Prisma:

npx prisma db push
```

### 5. เริ่มใช้งาน

1. เข้า `https://your-app.vercel.app/admin/login`
2. Login ด้วย username/password ที่ตั้งไว้
3. สร้างสินค้าแรก
4. สร้าง Token แรก
5. ทดสอบที่ `/login`

---

## ✅ Checklist

- [ ] Supabase Project สร้างแล้ว
- [ ] DATABASE_URL คัดลอกแล้ว
- [ ] Push GitHub แล้ว
- [ ] Deploy Vercel แล้ว
- [ ] Environment Variables ตั้งค่าแล้ว
- [ ] Database Tables สร้างแล้ว
- [ ] Admin Login ได้แล้ว
- [ ] สร้างสินค้าแรกแล้ว
- [ ] สร้าง Token แรกแล้ว
- [ ] ทดสอบ Login ด้วย Token แล้ว

---

## 🆘 Help

หาก Deploy ไม่สำเร็จ ดูที่: `DEPLOY_CHECKLIST.md`
