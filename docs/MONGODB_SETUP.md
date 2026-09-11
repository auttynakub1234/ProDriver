# MongoDB Atlas Setup Guide

## ขั้นตอนการสร้าง MongoDB Database ฟรี

### 1. สร้างบัญชี MongoDB Atlas
1. ไปที่ https://www.mongodb.com/cloud/atlas/register
2. สมัครด้วย Google หรือ Email
3. เลือก **Free Shared Cluster** (M0 - ฟรีตลอดชีพ)

### 2. สร้าง Cluster
1. เลือก Provider: **AWS** (แนะนำ)
2. เลือก Region ใกล้ที่สุด: **Singapore (ap-southeast-1)** หรือ **Tokyo (ap-northeast-1)**
3. Cluster Name: `ProDriver` หรือชื่อที่ต้องการ
4. กด **Create Cluster** (ใช้เวลา 3-5 นาที)

### 3. สร้าง Database User
1. ไปที่ **Database Access** (เมนูซ้าย)
2. กด **Add New Database User**
3. Authentication Method: **Password**
4. Username: `prodriver_admin` (ตัวอย่าง)
5. Password: สร้างรหัสผ่านที่ปลอดภัย (กด **Autogenerate** แล้วคัดลอกเก็บไว้)
6. Database User Privileges: **Read and write to any database**
7. กด **Add User**

### 4. ตั้งค่า Network Access (อนุญาตการเชื่อมต่อ)
1. ไปที่ **Network Access** (เมนูซ้าย)
2. กด **Add IP Address**
3. เลือก **Allow Access from Anywhere** (สำหรับ Vercel)
   - IP Address: `0.0.0.0/0`
4. กด **Confirm**

### 5. รับ Connection String
1. กลับไปที่ **Database** (เมนูซ้าย)
2. กด **Connect** บน Cluster ของคุณ
3. เลือก **Connect your application**
4. Driver: **Node.js** / Version: **5.5 or later**
5. คัดลอก Connection String:
   ```
   mongodb+srv://prodriver_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **แทนที่ `<password>`** ด้วยรหัสผ่านที่สร้างไว้ตอนที่ 3
7. เพิ่มชื่อ Database ระหว่าง `.net/` และ `?`:
   ```
   mongodb+srv://prodriver_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prodriver?retryWrites=true&w=majority
   ```

### 6. ทดสอบการเชื่อมต่อ (Optional)
ใส่ Connection String ในไฟล์ `.env.local`:
```env
MONGODB_URI=mongodb+srv://prodriver_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prodriver?retryWrites=true&w=majority
```

จากนั้นรัน:
```bash
npm run dev
```

ถ้าไม่มี error แสดงว่าเชื่อมต่อสำเร็จ! ✅

---

## 💡 Tips
- **อย่าแชร์ Connection String** ไปไหน (มี password อยู่ข้างใน)
- ใส่ใน `.env.local` สำหรับ local development
- ใส่ใน Vercel Environment Variables สำหรับ production
- ฟรี 512 MB storage (พอใช้งานหลายพันรายการ)
