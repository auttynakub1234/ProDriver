# 🔧 วิธีตั้งค่า Environment Variables ใน Vercel

## 📍 ขั้นตอนการตั้งค่า

### 1. เข้าไปที่ Vercel
```
https://vercel.com
```

### 2. เลือก Project
- คลิกที่โปรเจค "ProDriver"

### 3. ไปที่ Settings
- คลิกแท็บ **Settings** (ด้านบน)
- เลื่อนลงหา **Environment Variables**

### 4. เพิ่มตัวแปรทีละตัว

กด **Add New** แล้วกรอก:

---

## 📋 ตัวแปรที่ต้องเพิ่ม (5 ตัว)

### 1️⃣ DATABASE_URL
**จาก:** Supabase (ต้องสร้างก่อน)

```
Key:   DATABASE_URL
Value: postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**วิธีเอา:**
1. ไปที่ https://supabase.com
2. สร้าง Project ใหม่
3. Settings > Database > Connection String
4. เลือก "Pooler" (Session mode)
5. แทน [PASSWORD] ด้วยรหัสผ่านที่ตั้งตอนสร้าง Project

---

### 2️⃣ JWT_SECRET
**สร้างเอง:** รหัสลับ 32+ ตัวอักษร

```
Key:   JWT_SECRET
Value: MyProDriver2024SecretKeyForJWT1234567890abcdef
```

**วิธีสร้าง:**
- **แบบง่าย:** ตั้งเอง ยาว 32+ ตัวอักษร
- **แบบสุ่ม (PowerShell):**
  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **ออนไลน์:** https://generate-secret.vercel.app/32

---

### 3️⃣ ADMIN_USERNAME
**ตั้งเอง:** ชื่อผู้ใช้สำหรับ Login Admin

```
Key:   ADMIN_USERNAME
Value: admin
```

**ตัวอย่าง:**
- `admin`
- `prodriver_admin`
- `myshop`

---

### 4️⃣ ADMIN_PASSWORD
**ตั้งเอง:** รหัสผ่านสำหรับ Login Admin

```
Key:   ADMIN_PASSWORD
Value: ProDriver2024Secure!@#
```

**แนะนำ:**
- ยาว 8+ ตัวอักษร
- มีตัวพิมพ์ใหญ่-เล็ก
- มีตัวเลข
- มีสัญลักษณ์พิเศษ

---

### 5️⃣ NEXT_PUBLIC_APP_URL
**จาก:** Vercel URL (หลัง Deploy)

```
Key:   NEXT_PUBLIC_APP_URL
Value: https://pro-driver.vercel.app
```

**วิธีเอา:**
- ใช้ URL ที่ Vercel ให้หลัง Deploy
- ถ้ายังไม่รู้ ให้ใส่ `https://your-app.vercel.app` ไปก่อน
- แล้วกลับมาแก้ทีหลัง

---

## 🎯 ตัวอย่างสมบูรณ์

```env
DATABASE_URL="postgresql://postgres.abcdefghijk:MyDatabasePass123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

JWT_SECRET="a7f8d9e2c4b6h1j3k5m7n9p0q2r4s6t8u0v2w4x6y8z1a3b5c7"

ADMIN_USERNAME="admin"

ADMIN_PASSWORD="ProDriver2024Secure!@#"

NEXT_PUBLIC_APP_URL="https://pro-driver.vercel.app"
```

---

## ⚙️ การตั้งค่าใน Vercel

### สำหรับแต่ละตัวแปร:

1. กด **Add New**
2. **Key:** กรอกชื่อตัวแปร (เช่น `DATABASE_URL`)
3. **Value:** กรอกค่า (เช่น `postgresql://...`)
4. **Environment:** เลือก **All** (Production, Preview, Development)
5. กด **Save**

### หลังเพิ่มครบ 5 ตัว:

1. กลับไปที่แท็บ **Deployments**
2. คลิก **...** (จุดสามจุด) ที่ Deployment ล่าสุด
3. เลือก **Redeploy**
4. เลือก **Use existing Build Cache**
5. กด **Redeploy**

---

## ✅ Checklist

- [ ] สร้าง Supabase Project แล้ว
- [ ] คัดลอก DATABASE_URL แล้ว (แทน [PASSWORD])
- [ ] สร้าง JWT_SECRET แล้ว (32+ ตัวอักษร)
- [ ] ตั้ง ADMIN_USERNAME แล้ว
- [ ] ตั้ง ADMIN_PASSWORD แล้ว (จดไว้)
- [ ] ใส่ NEXT_PUBLIC_APP_URL แล้ว
- [ ] เพิ่มทั้ง 5 ตัวใน Vercel แล้ว
- [ ] Redeploy แล้ว

---

## 🆘 ถ้ามีปัญหา

### ❌ Build Failed
- ตรวจสอบ DATABASE_URL ถูกต้องหรือไม่
- ต้องแทน [PASSWORD] ด้วยรหัสจริง
- ใช้ Pooler (Port 6543) ไม่ใช่ Direct (5432)

### ❌ Admin Login ไม่ได้
- ตรวจสอบ ADMIN_USERNAME และ ADMIN_PASSWORD
- ต้อง Redeploy หลังเปลี่ยน Environment Variables

### ❌ Database Connection Error
- ตรวจสอบ Supabase Project ยังทำงานอยู่
- ตรวจสอบรหัสผ่านใน DATABASE_URL ถูกต้อง

---

## 📞 ตัวอย่างการใช้งาน

### หลัง Deploy สำเร็จ:

1. **เข้า Admin:**
   ```
   https://your-app.vercel.app/admin/login
   Username: (ที่ตั้งใน ADMIN_USERNAME)
   Password: (ที่ตั้งใน ADMIN_PASSWORD)
   ```

2. **สร้างสินค้าและ Token**

3. **ทดสอบ Login:**
   ```
   https://your-app.vercel.app/login
   กรอก Token 8 หลัก
   ```

---

**เอกสารนี้สร้างโดย:** Claude Opus 5  
**วันที่:** 2026-09-12
