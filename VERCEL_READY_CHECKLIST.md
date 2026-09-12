# ✅ Vercel Ready Checklist

## 📋 ก่อน Deploy

### 1. GitHub Repository
- [x] Code พร้อมแล้ว
- [ ] Push ขึ้น GitHub
- [ ] Branch: `main` or `master`
- [ ] ไฟล์ `.env.local` ถูก ignore แล้ว

### 2. Database (Supabase)
- [ ] สร้าง Supabase Project แล้ว
- [ ] คัดลอก Connection String (Transaction Mode, Port 6543)
- [ ] ทดสอบเชื่อมต่อได้

### 3. Environment Variables (เตรียมไว้)

```env
DATABASE_URL=postgresql://postgres.[project]:xxxxx@aws-0-region.pooler.supabase.com:6543/postgres
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (อย่างน้อย 32 ตัว)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=xxxxxxxxxx (ปลอดภัย!)
TELEGRAM_BOT_TOKEN=123456789:ABC... (Optional)
TELEGRAM_CHAT_ID=-1001234567890 (Optional)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app (ใส่หลัง Deploy)
```

### 4. ไฟล์สำคัญ
- [x] `package.json` - มี build script
- [x] `next.config.js` - ตั้งค่าถูกต้อง
- [x] `vercel.json` - Build command ถูกต้อง
- [x] `prisma/schema.prisma` - Schema สมบูรณ์
- [x] `.gitignore` - Ignore ไฟล์ที่ไม่ควร commit

---

## 🚀 ขั้นตอนการ Deploy

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Import to Vercel
1. ไปที่ https://vercel.com/new
2. เลือก Repository: **ProDriver**
3. กด Import

### Step 3: Configure Build Settings
- Framework: **Next.js** (Auto-detect)
- Build Command: `prisma generate && next build`
- Output Directory: `.next`
- Install Command: `npm install`

### Step 4: Add Environment Variables
คัดลอกจาก `.env.example` แล้วแก้ไขค่าจริง:
- DATABASE_URL
- JWT_SECRET
- ADMIN_USERNAME
- ADMIN_PASSWORD
- TELEGRAM_BOT_TOKEN (Optional)
- TELEGRAM_CHAT_ID (Optional)

⚠️ **อย่าใส่** `NEXT_PUBLIC_APP_URL` ก่อน - ใส่หลังได้ URL จาก Vercel

### Step 5: Deploy
กด **Deploy** และรอ 2-3 นาที

---

## 🔧 หลัง Deploy สำเร็จ

### 1. Get Deployment URL
- คัดลอก URL: `https://your-project.vercel.app`

### 2. Update Environment Variable
- เพิ่ม: `NEXT_PUBLIC_APP_URL=https://your-project.vercel.app`
- **Redeploy** (ไปที่ Deployments → คลิก ... → Redeploy)

### 3. Setup Database Schema
```bash
# Option 1: Local Prisma Push
npx prisma db push

# Option 2: Supabase SQL Editor
# รัน setup-database.sql ใน Supabase SQL Editor
```

### 4. Test การทำงาน
- [ ] หน้าแรก: `/`
- [ ] Admin Login: `/admin/login`
- [ ] สร้าง Product
- [ ] สร้าง Token
- [ ] Token Login: `/login`
- [ ] Download Page: `/download`

---

## ✅ การทดสอบ

### Test Frontend
```bash
✓ หน้าแรก (/) - แสดงสินค้า
✓ Token Login (/login) - กรอก Token ได้
✓ Download Page (/download) - ดาวน์โหลดได้
```

### Test Admin Panel
```bash
✓ Admin Login (/admin/login)
✓ Dashboard (/admin) - แสดงสถิติ
✓ Token Management (/admin/tokens)
✓ สร้าง Token ใหม่ได้
```

### Test API
```bash
✓ GET /api/products - ได้รายการสินค้า
✓ POST /api/token/login - Login ด้วย Token ได้
✓ POST /api/admin/login - Admin login ได้
```

---

## 🐛 Troubleshooting

### Build Error: Prisma
```
Error: Cannot find module '@prisma/client'
```
**แก้:** ตรวจสอบ Build Command: `prisma generate && next build`

### Runtime Error: Database
```
Can't reach database server
```
**แก้:** 
- เช็ค DATABASE_URL
- ใช้ Transaction pooler (port 6543)
- เช็คว่า Supabase Project ยัง active

### Environment Variables ไม่ทำงาน
**แก้:**
- Redeploy หลังเพิ่ม/แก้ Environment Variables
- ตรวจสอบสะกดถูกต้อง (ตัวพิมพ์ใหญ่-เล็ก)

### Admin Login ไม่ได้
**แก้:**
- เช็ค ADMIN_USERNAME และ ADMIN_PASSWORD
- Redeploy หลังแก้ไข

---

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: ดูประวัติการ Deploy
- **Analytics**: ดูจำนวน Visitors
- **Function Logs**: ดู Error logs

### Supabase Dashboard
- **Database**: ดูขนาด Database
- **API**: ดูจำนวน Requests
- **Logs**: ดู Query logs

---

## 🎯 Performance Tips

### 1. Image Optimization
- ใช้ Next.js Image component
- หรือใช้ CDN (Cloudinary, Imgur)

### 2. Database Optimization
- ใช้ Connection Pooling (Supabase มีให้)
- เพิ่ม Index ใน Prisma Schema

### 3. Caching
- Static Generation สำหรับหน้าที่ไม่เปลี่ยน
- API Caching ด้วย Vercel Edge

---

## 💰 Cost Estimate

### Free Tier (เพียงพอสำหรับเริ่มต้น)
- **Vercel**: 100 GB bandwidth/เดือน
- **Supabase**: 500 MB database + 2 GB storage

### ถ้าเกิน Free Tier
- **Vercel Pro**: $20/เดือน
- **Supabase Pro**: $25/เดือน

---

## 🎉 Success!

ระบบพร้อมใช้งานแล้วที่:
```
🌐 https://your-project.vercel.app
👨‍💼 https://your-project.vercel.app/admin
🔑 https://your-project.vercel.app/login
```

---

**Next Steps:**
1. เพิ่มสินค้าในระบบ
2. ทดสอบสร้าง Token
3. แจกจ่ายให้ลูกค้า
4. Monitor usage

**Good luck! 🚀**
