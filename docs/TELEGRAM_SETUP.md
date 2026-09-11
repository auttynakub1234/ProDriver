# Telegram Bot Setup Guide

## คุณมี Bot Token แล้ว ขั้นตอนต่อไป:

### 1. หา Chat ID (3 วิธี)

#### วิธีที่ 1: ใช้ @userinfobot (ง่ายที่สุด)
1. เปิด Telegram ค้นหา `@userinfobot`
2. กด Start
3. บอทจะส่ง **Your ID** มาให้ เช่น `123456789`
4. นี่คือ Chat ID ของคุณ (สำหรับส่งข้อความส่วนตัว)

#### วิธีที่ 2: ใช้ API โดยตรง (แนะนำสำหรับกลุ่ม)
1. เพิ่มบอทของคุณเข้า**กลุ่ม Telegram**
2. ส่งข้อความอะไรก็ได้ในกลุ่ม (เช่น "สวัสดี")
3. เปิดเบราว์เซอร์และไปที่:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   แทน `<YOUR_BOT_TOKEN>` ด้วย Token ที่คุณมี
   
4. จะเห็น JSON แบบนี้:
   ```json
   {
     "ok": true,
     "result": [
       {
         "update_id": 123456789,
         "message": {
           "chat": {
             "id": -1001234567890,  👈 นี่คือ Chat ID ของกลุ่ม
             "title": "ProDriver Admin",
             "type": "group"
           }
         }
       }
     ]
   }
   ```
5. คัดลอก `chat.id` (ตัวเลขที่ขึ้นต้นด้วย `-` สำหรับกลุ่ม)

#### วิธีที่ 3: ใช้ Node.js Script (รันครั้งเดียว)

สร้างไฟล์ `test-telegram.js`:
```javascript
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`)
  .then(res => res.json())
  .then(data => {
    console.log('📩 Telegram Updates:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.result && data.result.length > 0) {
      const chatId = data.result[0].message.chat.id;
      console.log('\n✅ Chat ID found:', chatId);
    } else {
      console.log('\n⚠️ No messages found. Send a message to your bot first!');
    }
  })
  .catch(err => console.error('❌ Error:', err));
```

รัน:
```bash
node test-telegram.js
```

---

## 3. ทดสอบส่งข้อความ

หลังจากได้ Chat ID แล้ว ทดสอบส่งข้อความ:

### วิธีที่ 1: ใช้เบราว์เซอร์
ไปที่ URL นี้ (แทนค่าที่ต้องการ):
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage?chat_id=<YOUR_CHAT_ID>&text=Hello from ProDriver!
```

### วิธีที่ 2: ใช้ Node.js Script

สร้างไฟล์ `send-test-message.js`:
```javascript
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CHAT_ID = 'YOUR_CHAT_ID_HERE';

const message = `🔔 *ทดสอบระบบแจ้งเตือน*

✅ Telegram Bot ทำงานปกติ
📱 พร้อมรับการแจ้งเตือนเมื่อมีการเปิดใช้งานคีย์`;

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log('✅ ส่งข้อความสำเร็จ!');
      console.log('Message ID:', data.result.message_id);
    } else {
      console.log('❌ ส่งข้อความไม่สำเร็จ:', data.description);
    }
  })
  .catch(err => console.error('❌ Error:', err));
```

รัน:
```bash
node send-test-message.js
```

---

## 4. บอทไม่ต้อง "รัน" ตลอดเวลา!

**ข้อสำคัญ:** Telegram Bot ของคุณ**ไม่ต้องรันตลอดเวลา** เพราะเราใช้แบบ **Webhook/HTTP Request**

- ✅ เมื่อมีคนเปิดใช้งานคีย์ → Backend (Vercel) จะส่งข้อความผ่าน API
- ✅ ไม่ต้องมี Server รันบอทอยู่
- ✅ ไม่ต้องใช้ `polling` หรือ `long polling`

บอทจะทำงานผ่าน API calls จาก Next.js เท่านั้น!

---

## 5. ใส่ค่าใน Environment Variables

หลังจากได้ทั้ง Bot Token และ Chat ID แล้ว:

### Local (`.env.local`):
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

### Vercel (Project Settings → Environment Variables):
```
TELEGRAM_BOT_TOKEN = 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID = 123456789
```

---

## 💡 Tips
- **แชท Personal vs Group:**
  - Personal Chat ID: เลขบวก เช่น `123456789`
  - Group Chat ID: เลขลบ เช่น `-1001234567890`
- **ความปลอดภัย:** อย่าแชร์ Bot Token ไปไหน (เหมือนรหัสผ่าน)
- **ทดสอบก่อน Deploy:** ใช้ script ด้านบนทดสอบก่อนจะ deploy บน Vercel

---

## 🎯 เมื่อทุกอย่างพร้อม

ระบบจะทำงานแบบนี้:
1. ผู้ใช้เปิดใช้งานคีย์บนแอป Android
2. แอปส่ง Key + Device ID ไปที่ API `/api/activate`
3. Backend ตรวจสอบและอัปเดต Database
4. **Backend ส่งการแจ้งเตือนไปยัง Telegram อัตโนมัติ** 🔔
5. คุณได้รับข้อความแจ้งเตือนทันที!
