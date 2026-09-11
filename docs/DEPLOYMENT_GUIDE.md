# Vercel Deployment Guide

## 🚨 ปัญหาที่พบบ่อยและวิธีแก้

### ปัญหา 1: Build Failed - TypeScript Errors
**สาเหตุ:** Type errors หรือ import ไม่ถูกต้อง

**วิธีแก้:**
```bash
# ตรวจสอบ TypeScript errors ก่อน
npm run build
```

---

### ปัญหา 2: Environment Variables ไม่ได้ตั้งค่า
**สาเหตุ:** ไม่มี Environment Variables ใน Vercel

**วิธีแก้:**
1. ไปที่ Vercel Project Settings → Environment Variables
2. เพิ่มตัวแปรทั้งหมด (ห้ามมีช่องว่างหรือ comment):

```
JWT_SECRET
your-super-secret-jwt-key-minimum-32-characters-long

MONGODB_URI
mongodb+srv://username:password@cluster.mongodb.net/prodriver?retryWrites=true&w=majority

TELEGRAM_BOT_TOKEN
1234567890:ABCdefGhIjklMNOpqrsTUVwxyz

TELEGRAM_CHAT_ID
123456789
```

3. Environment: เลือก **Production, Preview, และ Development** ทั้ง 3 ตัว
4. กด **Save**
5. **Redeploy** โปรเจกต์ใหม่

---

### ปัญหา 3: MongoDB Connection Failed
**สาเหตุ:** Connection String ไม่ถูกต้องหรือ IP ถูกบล็อก

**วิธีแก้:**
1. ไปที่ MongoDB Atlas → Network Access
2. ตรวจสอบว่ามี IP Address `0.0.0.0/0` (Allow from anywhere)
3. ถ้าไม่มี กด **Add IP Address** → **Allow Access from Anywhere**
4. ตรวจสอบ Connection String:
   - ต้องมี database name: `.net/prodriver?retryWrites...`
   - แทน `<password>` ด้วยรหัสผ่านจริง
   - ห้ามมีช่องว่างในรหัสผ่าน (ถ้ามีให้ encode เป็น %20)

---

### ปัญหา 4: Module Not Found
**สาเหตุ:** dependencies ไม่ครบ

**วิธีแก้:**
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

---

### ปัญหา 5: Serverless Function Size Limit
**สาเหตุ:** Dependencies ใหญ่เกินไป

**วิธีแก้:**
ไม่น่าเป็นปัญหาในโปรเจกต์นี้ แต่ถ้าเจอ ให้ตรวจสอบ `package.json`

---

## ✅ ขั้นตอนการ Deploy อย่างถูกต้อง

### 1. ตรวจสอบก่อน Deploy
```bash
# Test build locally
npm run build

# ถ้า build สำเร็จ แสดงว่าโค้ดไม่มีปัญหา
```

### 2. Push ขึ้น GitHub
```bash
git add .
git commit -m "Fix deployment issues"
git push origin main
```

### 3. Deploy บน Vercel

#### วิธีที่ 1: Import จาก GitHub (แนะนำ)
1. ไปที่ https://vercel.com/new
2. เลือก **Import Git Repository**
3. เลือก `auttynakub1234/ProDriver`
4. **Configure Project:**
   - Framework Preset: **Next.js** (ควรเลือกอัตโนมัติ)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. กด **Environment Variables** และเพิ่มตัวแปรทั้งหมด:
   ```
   JWT_SECRET = your-actual-secret-key-here
   MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/prodriver?retryWrites=true&w=majority
   TELEGRAM_BOT_TOKEN = 1234567890:ABCdefGhI...
   TELEGRAM_CHAT_ID = 123456789
   ```
6. กด **Deploy**

#### วิธีที่ 2: Vercel CLI
```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# สำหรับ production
vercel --prod
```

---

## 🔍 ตรวจสอบ Deployment Logs

ถ้า deploy ล้มเหลว:

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจกต์ ProDriver
3. คลิกที่ deployment ที่ล้มเหลว
4. ดู **Build Logs** หรือ **Function Logs**
5. ดู error message แล้วแก้ไขตาม

---

## 📝 Checklist ก่อน Deploy

- [ ] MongoDB URI ถูกต้อง (ทดสอบเชื่อมต่อได้)
- [ ] Telegram Bot Token ถูกต้อง (ทดสอบส่งข้อความได้)
- [ ] Telegram Chat ID ถูกต้อง
- [ ] JWT_SECRET มีความยาวอย่างน้อย 32 ตัวอักษร
- [ ] Environment Variables ตั้งค่าครบทั้ง 4 ตัว
- [ ] `npm run build` รันสำเร็จ (local)
- [ ] Push code ขึ้น GitHub แล้ว

---

## 💡 Tips

1. **ใช้ Environment Variables ที่แตกต่างกัน:**
   - Local: ใช้ค่าทดสอบใน `.env.local`
   - Production: ใช้ค่าจริงใน Vercel

2. **MongoDB Free Tier Limits:**
   - 512 MB storage
   - 500 connections
   - เพียงพอสำหรับเริ่มต้น

3. **Vercel Free Tier Limits:**
   - 100 GB Bandwidth/เดือน
   - Serverless Function: 10s timeout
   - เพียงพอสำหรับใช้งานทั่วไป

4. **Redeploy หลังเปลี่ยน Environment Variables:**
   - เปลี่ยน env vars → ต้อง redeploy ใหม่
   - Deployments → คลิก 3 จุด → Redeploy

---

## 🆘 ยังไม่ได้?

ส่ง **error message จาก Vercel Build Logs** มาให้ดูครับ จะช่วยแก้ให้ทันที!
