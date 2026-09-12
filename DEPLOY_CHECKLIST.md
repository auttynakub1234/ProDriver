# 🚀 Checklist สำหรับ Deploy ไป Vercel

## ✅ สถานะปัจจุบัน

### ระบบที่มีอยู่ 2 ระบบ:

#### 1️⃣ ระบบ Token (ใหม่) - **แนะนำให้ใช้**
- ✅ **ไม่ล็อก Device ID** - ใช้ได้หลายเครื่อง
- ✅ Admin สร้าง Token จากหน้า `/admin/tokens`
- ✅ ลูกค้าใช้ Token Login ที่ `/login`
- ✅ ดาวน์โหลดได้ไม่จำกัดครั้ง
- ✅ ติดตามจำนวนดาวน์โหลด
- ✅ กำหนดวันหมดอายุได้

**API Endpoints:**
- `POST /api/admin/tokens` - สร้าง Token (Admin)
- `GET /api/admin/tokens` - ดู Token ทั้งหมด (Admin)
- `POST /api/token/login` - Login ด้วย Token (ลูกค้า)

#### 2️⃣ ระบบ License (เก่า) - ยังมีอยู่
- ⚠️ **ล็อก Device ID** - ใช้ได้เครื่องเดียว
- หน้า `/activate` - เปิดใช้งาน License Key
- หน้า `/admin/licenses` - จัดการ License Keys
- API `/api/activate` - เปิดใช้งานคีย์

---

## 📝 ขั้นตอนการ Deploy

### 1. เตรียม Supabase (PostgreSQL)

1. ไปที่ https://supabase.com
2. สร้างโปรเจคใหม่
3. ไปที่ **Settings > Database**
4. คัดลอก **Connection String (Pooler)** หรือ **Direct Connection**
5. เก็บไว้สำหรับใส่ใน Vercel

### 2. Push โค้ดขึ้น GitHub

```bash
# ตรวจสอบสถานะ
git status

# Add และ Commit
git add .
git commit -m "Prepare for Vercel deployment with Token system

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"

# Push ขึ้น GitHub
git push origin main
```

### 3. Deploy ไป Vercel

1. ไปที่ https://vercel.com
2. **Import Project** จาก GitHub
3. เลือก Repository: `ProDriver`
4. กด **Deploy** (ยังไม่ต้องตั้งค่า Environment Variables ก่อน)
5. รอจนกว่า Build จะ **Fail** (เพราะยังไม่มี DATABASE_URL)

### 4. ตั้งค่า Environment Variables ใน Vercel

ไปที่ **Settings > Environment Variables** และเพิ่ม:

```env
DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
JWT_SECRET="your-super-secret-32-character-minimum-key"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password-here"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

**Optional (Telegram Notifications):**
```env
TELEGRAM_BOT_TOKEN="123456789:ABC..."
TELEGRAM_CHAT_ID="-1001234567890"
```

### 5. สร้างตาราง Database

หลังจากตั้งค่า Environment Variables แล้ว:

1. ไปที่ Vercel Dashboard
2. กด **Redeploy** (Deployments > ... > Redeploy)
3. เมื่อ Deploy สำเร็จแล้ว ไปที่ Supabase
4. เปิด **SQL Editor** และรันคำสั่ง:

```sql
-- คัดลอกจาก prisma/schema.prisma และสร้างตารางทั้งหมด
-- หรือใช้ Prisma Migrate (แนะนำ)
```

**หรือใช้ Prisma CLI:**

```bash
# ใน Local
npx prisma migrate deploy

# หรือเชื่อมต่อ Vercel CLI
vercel env pull .env
npx prisma db push
```

### 6. สร้างสินค้าและ Token แรก

1. เข้าไปที่ `https://your-app.vercel.app/admin/login`
2. Login ด้วย username/password ที่ตั้งไว้
3. ไปที่ **จัดการสินค้า** และสร้างสินค้า
4. ไปที่ **จัดการ Token** และสร้าง Token แรก
5. ทดสอบใช้ Token ที่หน้า `/login`

---

## ⚙️ การตั้งค่าเพิ่มเติม

### ปิดการใช้งานระบบเก่า (License + Device ID)

ถ้าต้องการใช้เฉพาะระบบ Token อย่างเดียว:

#### ซ่อนลิงก์หน้า Activate:
ไม่มีลิงก์ในหน้าแรกอยู่แล้ว ✅

#### ลบหน้า Admin Licenses (Optional):
```bash
# ลบโฟลเดอร์
rm -rf app/admin/licenses
rm -rf app/api/admin/licenses
```

#### ลบหน้า Activate (Optional):
```bash
rm -rf app/activate
rm -rf app/api/activate
```

### ลบ Model ที่ไม่ใช้ออกจาก schema.prisma

แก้ไขไฟล์ `prisma/schema.prisma` ลบ models:
- `User` (ถ้าไม่ใช้)
- `License` (ระบบเก่า)

แล้วรัน:
```bash
npx prisma migrate dev --name remove_unused_models
npx prisma generate
```

---

## 🧪 ทดสอบหลัง Deploy

### ✅ Checklist การทดสอบ:

1. **หน้าแรก** (`/`)
   - [ ] โหลดสินค้าได้
   - [ ] แสดงข้อมูลสินค้าถูกต้อง
   - [ ] ปุ่ม "ใช้รหัส Token" ทำงาน

2. **Admin Login** (`/admin/login`)
   - [ ] Login ได้ด้วย username/password
   - [ ] Redirect ไป Dashboard

3. **Admin Dashboard** (`/admin`)
   - [ ] แสดงสถิติถูกต้อง
   - [ ] ปุ่มทุกปุ่มทำงาน

4. **จัดการสินค้า** (`/admin/products`)
   - [ ] สร้างสินค้าใหม่ได้
   - [ ] แก้ไขสินค้าได้
   - [ ] ลบสินค้าได้

5. **จัดการ Token** (`/admin/tokens`)
   - [ ] สร้าง Token ใหม่ได้
   - [ ] แสดง Token ทั้งหมด
   - [ ] คัดลอก Token ได้

6. **Login ด้วย Token** (`/login`)
   - [ ] ใส่ Token 8 หลักได้
   - [ ] ตรวจสอบ Token ถูกต้อง
   - [ ] Redirect ไปหน้า Download

7. **Download Page** (`/download`)
   - [ ] แสดงข้อมูลสินค้า
   - [ ] มีปุ่ม Download APK
   - [ ] บันทึกประวัติดาวน์โหลด

---

## 🔐 Security Checklist

- [ ] เปลี่ยน `JWT_SECRET` เป็นค่าที่ปลอดภัย (32+ ตัวอักษร)
- [ ] เปลี่ยน `ADMIN_PASSWORD` เป็นรหัสผ่านที่แข็งแรง
- [ ] ใช้ HTTPS (Vercel จัดการให้อัตโนมัติ)
- [ ] ตั้งค่า RLS ใน Supabase (Row Level Security)
- [ ] ซ่อน `.env.local` ไม่ให้ขึ้น GitHub (มีใน .gitignore แล้ว ✅)

---

## 📊 ความแตกต่างระหว่างระบบ

| คุณสมบัติ | ระบบ Token (ใหม่) | ระบบ License (เก่า) |
|-----------|------------------|-------------------|
| **Device ID** | ❌ ไม่ล็อก | ✅ ล็อกเครื่องเดียว |
| **ใช้หลายเครื่อง** | ✅ ได้ | ❌ ไม่ได้ |
| **ดาวน์โหลดซ้ำ** | ✅ ไม่จำกัด | ✅ เครื่องเดิมได้ |
| **หน้า Login** | `/login` | `/activate` |
| **Admin สร้าง** | `/admin/tokens` | `/admin/licenses` |
| **API** | `/api/token/login` | `/api/activate` |
| **ติดตามการใช้งาน** | ✅ นับดาวน์โหลด | ✅ บันทึก Device ID |

---

## 🆘 Troubleshooting

### Build Error on Vercel

```
Error: Cannot find module '@prisma/client'
```

**แก้ไข:** ตรวจสอบ `package.json` script:
```json
"build": "prisma generate && next build"
```

### Database Connection Error

```
P1001: Can't reach database server
```

**แก้ไข:**
1. ตรวจสอบ `DATABASE_URL` ถูกต้อง
2. ใช้ Connection Pooler (Port 6543) แทน Direct Connection
3. เปิด Connection ใน Supabase Settings

### Admin Login ไม่ได้

**แก้ไข:**
1. ตรวจสอบ `ADMIN_USERNAME` และ `ADMIN_PASSWORD` ใน Vercel
2. Redeploy หลังเปลี่ยน Environment Variables

---

## 📱 Flow การใช้งานจริง

### สำหรับลูกค้า:

1. ลูกค้าเลือกสินค้าจากหน้าแรก
2. โอนเงินผ่าน PromptPay
3. ส่งสลิปมาทาง LINE: `@prodriver`
4. **Admin สร้าง Token** จากหน้า `/admin/tokens`
5. Admin ส่งรหัส Token (8 หลัก) ให้ลูกค้า
6. ลูกค้าเข้า `/login` และกรอก Token
7. ดาวน์โหลด APK ได้เลย (ไม่ต้องใส่ Device ID)
8. **ใช้ได้หลายเครื่อง** - แชร์กับเพื่อนได้

### สำหรับ Admin:

1. Login ที่ `/admin/login`
2. ตรวจสอบสลิปโอนเงิน (ทาง LINE)
3. สร้าง Token จาก `/admin/tokens`
4. ส่ง Token ให้ลูกค้า
5. ดูสถิติการดาวน์โหลดที่ Dashboard

---

## ✨ สรุป

### ระบบพร้อม Deploy แล้ว! 🎉

**ที่ต้องทำ:**
1. ✅ ตรวจสอบโค้ดเสร็จแล้ว
2. ⏳ ตั้งค่า Supabase
3. ⏳ Push GitHub
4. ⏳ Deploy Vercel
5. ⏳ ตั้งค่า Environment Variables
6. ⏳ สร้างตาราง Database
7. ⏳ ทดสอบระบบ

**แนะนำ:**
- ใช้ระบบ Token (ไม่ล็อก Device ID) เป็นหลัก ✅
- เก็บระบบ License ไว้เผื่อต้องการล็อกเครื่องในอนาคต
- หรือลบระบบ License ทิ้งถ้าไม่ใช้

---

**เอกสารนี้สร้างโดย:** Claude Opus 5  
**วันที่:** 2026-09-12  
**สถานะ:** ✅ พร้อม Deploy
