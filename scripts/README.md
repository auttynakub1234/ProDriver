# Scripts สำหรับทดสอบระบบ

## 🔍 หา Chat ID

```bash
node scripts/find-chat-id.js
```

**ก่อนรัน:** แก้ไข `BOT_TOKEN` ในไฟล์ `scripts/find-chat-id.js`

**ขั้นตอน:**
1. เปิด Telegram ค้นหาบอทของคุณ
2. กด Start และส่งข้อความ "สวัสดี"
3. รันคำสั่งด้านบน
4. คัดลอก Chat ID ที่แสดง

---

## 📤 ทดสอบส่งข้อความ

```bash
node scripts/test-telegram.js
```

**ก่อนรัน:** แก้ไข `BOT_TOKEN` และ `CHAT_ID` ในไฟล์ `scripts/test-telegram.js`

ถ้าสำเร็จจะเห็นข้อความใน Telegram! ✅

---

## 📝 ตัวอย่าง Output

### find-chat-id.js
```
🔍 กำลังค้นหา Chat ID...

✅ พบข้อความ! Chat IDs ที่พบ:

  📱 Chat ID: 123456789
     ประเภท: private
     ชื่อ: John Doe

  📱 Chat ID: -1001234567890
     ประเภท: group
     ชื่อ: ProDriver Admin
```

### test-telegram.js
```
📤 กำลังส่งข้อความทดสอบ...

✅ ส่งข้อความสำเร็จ!
   Message ID: 12345
   ไปเช็คใน Telegram ของคุณเลย! 🎉
```
