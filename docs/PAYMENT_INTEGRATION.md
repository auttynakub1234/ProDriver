# Payment Integration Guide

## 🏦 ระบบชำระเงินอัตโนมัติ

ระบบรองรับการชำระเงินผ่าน Payment Gateway และสร้าง License Key อัตโนมัติ

---

## 📋 Payment Gateway ที่แนะนำ

### 1. **GB Prime Pay** (แนะนำสำหรับไทย)
- รองรับ QR PromptPay
- บัตรเครดิต/เดบิต
- ค่าธรรมเนียมต่ำ
- Webhook สำหรับยืนยันการชำระเงิน
- เว็บไซต์: https://www.gbprimepay.com

### 2. **Omise**
- API ที่ใช้งานง่าย
- รองรับหลายช่องทาง
- Documentation ดี
- เว็บไซต์: https://www.omise.co

### 3. **2C2P**
- บริการครบวงจร
- รองรับหลายประเทศ
- เว็บไซต์: https://www.2c2p.com

### 4. **Stripe** (สำหรับต่างประเทศ)
- มาตรฐานสากล
- API ที่ดีที่สุด
- เว็บไซต์: https://stripe.com

---

## 🔄 Flow การทำงาน

```
1. ลูกค้าเลือกสินค้า
   ↓
2. กดปุ่ม "ซื้อเลย"
   ↓
3. Backend สร้าง Payment Link
   ↓
4. ลูกค้าชำระเงินผ่าน QR Code / บัตร
   ↓
5. Payment Gateway ส่ง Webhook มาที่ /api/webhook/payment
   ↓
6. Backend ตรวจสอบ Signature
   ↓
7. สร้าง License Key อัตโนมัติ
   ↓
8. บันทึกลง Database
   ↓
9. ส่งแจ้งเตือนไปยัง Telegram
   ↓
10. ส่งอีเมล/LINE แจ้งคีย์ให้ลูกค้า ✅
```

---

## ⚙️ การตั้งค่า

### 1. Environment Variables

เพิ่มใน `.env.local` และ Vercel:

```env
# Payment Gateway
PAYMENT_API_KEY=your_payment_api_key
PAYMENT_SECRET_KEY=your_payment_secret_key
PAYMENT_WEBHOOK_SECRET=your_webhook_secret

# Public URL (สำหรับ Webhook Callback)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 2. Webhook URL

ให้ตั้งค่า Webhook URL ใน Payment Gateway Dashboard:

```
https://your-domain.vercel.app/api/webhook/payment
```

**Method:** `POST`  
**Content-Type:** `application/json`

### 3. Webhook Signature Verification

ทุก Payment Gateway จะส่ง Signature มาเพื่อยืนยันความถูกต้อง:

```typescript
// ตัวอย่างการตรวจสอบ
function verifyWebhookSignature(body: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
    
  return signature === expectedSignature;
}
```

---

## 💻 ตัวอย่าง Code Integration

### GB Prime Pay Example

```typescript
// lib/gbprimepay.ts
export async function createPayment(data: {
  amount: number;
  productName: string;
  customerEmail: string;
  orderId: string;
}) {
  const response = await fetch("https://api.gbprimepay.com/v1/tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GBPRIMEPAY_SECRET_KEY}`,
    },
    body: JSON.stringify({
      amount: data.amount * 100, // แปลงเป็นสตางค์
      currency: "THB",
      description: data.productName,
      referenceNo: data.orderId,
      backgroundUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/payment`,
      detail: data.productName,
      customerName: data.customerEmail,
      customerEmail: data.customerEmail,
    }),
  });

  const result = await response.json();
  return result.resultCode === "00" ? result.gbpReferenceNo : null;
}
```

### Omise Example

```typescript
// lib/omise.ts
import Omise from "omise";

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY!,
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export async function createCharge(data: {
  amount: number;
  token: string;
  description: string;
}) {
  const charge = await omise.charges.create({
    amount: data.amount * 100,
    currency: "THB",
    card: data.token,
    description: data.description,
    metadata: {
      order_id: `ORDER-${Date.now()}`,
    },
  });

  return charge;
}
```

---

## 🎯 Webhook Payload Examples

### GB Prime Pay Webhook

```json
{
  "gbpReferenceNo": "gbp123456789",
  "referenceNo": "ORDER-1234567890",
  "amount": "29900",
  "currency": "THB",
  "resultCode": "00",
  "resultMessage": "Success",
  "detail": "ProDriver Premium",
  "customerEmail": "customer@example.com",
  "paymentType": "Q"
}
```

### Omise Webhook

```json
{
  "id": "chrg_test_5xzy...",
  "object": "charge",
  "amount": 29900,
  "currency": "thb",
  "status": "successful",
  "paid": true,
  "metadata": {
    "order_id": "ORDER-1234567890"
  }
}
```

---

## 🔒 ความปลอดภัย

### ✅ ต้องทำ:
1. **ตรวจสอบ Signature ทุกครั้ง**
2. **ใช้ HTTPS เท่านั้น**
3. **เก็บ Secret Key ใน Environment Variables**
4. **Log ทุก Transaction**
5. **ตรวจสอบ Amount ก่อนสร้างคีย์**

### ❌ ห้ามทำ:
1. ไว้วางใจ Webhook โดยไม่ตรวจสอบ Signature
2. เก็บ Secret Key ใน Code
3. สร้างคีย์โดยไม่ยืนยันการชำระเงิน

---

## 🧪 ทดสอบ Webhook

### วิธีที่ 1: ใช้ Webhook Testing Tools

**Webhook.site:**
1. ไปที่ https://webhook.site
2. คัดลอก URL ที่ได้
3. ตั้งค่าเป็น Webhook URL ใน Payment Gateway
4. ดู Request ที่เข้ามา

**ngrok (สำหรับ Local Testing):**
```bash
# ติดตั้ง ngrok
npm install -g ngrok

# รัน Next.js
npm run dev

# เปิด tunnel
ngrok http 3000

# ได้ URL เช่น https://abc123.ngrok.io
# ตั้งค่า Webhook: https://abc123.ngrok.io/api/webhook/payment
```

### วิธีที่ 2: ทดสอบด้วย curl

```bash
# สร้าง Signature
echo -n '{"orderId":"TEST123","status":"success"}' | \
  openssl dgst -sha256 -hmac "your-webhook-secret"

# ส่ง Request
curl -X POST https://your-domain.vercel.app/api/webhook/payment \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: <signature>" \
  -d '{"orderId":"TEST123","status":"success","amount":299,"productId":"xxx","userEmail":"test@test.com","userName":"Test User"}'
```

---

## 📧 การส่งอีเมลแจ้ง License Key

### ใช้ SendGrid (แนะนำ)

```bash
npm install @sendgrid/mail
```

```typescript
// lib/sendEmail.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendLicenseKeyEmail(
  email: string,
  licenseKey: string,
  productName: string
) {
  const msg = {
    to: email,
    from: "noreply@prodriver.com",
    subject: `🎉 License Key สำหรับ ${productName}`,
    html: `
      <h2>ขอบคุณที่สั่งซื้อ ${productName}!</h2>
      <p>License Key ของคุณคือ:</p>
      <h1 style="font-family: monospace; background: #f0f0f0; padding: 10px;">
        ${licenseKey}
      </h1>
      <p>วิธีเปิดใช้งาน:</p>
      <ol>
        <li>ดาวน์โหลดแอป ProDriver</li>
        <li>เปิดแอปและกรอก License Key</li>
        <li>เริ่มใช้งานได้ทันที!</li>
      </ol>
    `,
  };

  await sgMail.send(msg);
}
```

---

## 🎨 หน้าชำระเงิน

สร้างหน้า Payment สำหรับลูกค้า:

```typescript
// app/payment/[productId]/page.tsx
"use client";

export default function PaymentPage() {
  const handlePayment = async () => {
    const response = await fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "xxx",
        customerName: "John Doe",
        customerEmail: "john@example.com",
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      // เปิดหน้าชำระเงิน
      window.location.href = data.paymentUrl;
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>
        ชำระเงิน ฿299
      </button>
    </div>
  );
}
```

---

## 📊 Monitor Webhooks

ควรเก็บ Log ทุก Webhook:

```typescript
// models/WebhookLog.ts
import mongoose, { Schema } from "mongoose";

const WebhookLogSchema = new Schema({
  provider: String, // gbprimepay, omise, etc.
  event: String,
  payload: Object,
  signature: String,
  verified: Boolean,
  processed: Boolean,
  error: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.WebhookLog || 
  mongoose.model("WebhookLog", WebhookLogSchema);
```

---

## 🆘 Troubleshooting

### Webhook ไม่เข้า
- ตรวจสอบ URL ถูกต้อง (ต้องเป็น HTTPS)
- ตรวจสอบ Firewall/Network
- ดู Logs ใน Payment Gateway Dashboard

### Signature Verification ล้มเหลว
- ตรวจสอบ WEBHOOK_SECRET ถูกต้อง
- ตรวจสอบ Algorithm (SHA256, SHA512, etc.)
- ตรวจสอบ Body ที่ใช้ hash (raw body)

### License Key ไม่ถูกสร้าง
- เช็ค Database connection
- เช็ค Webhook logs
- ทดสอบด้วย Mock data

---

## 📝 Checklist ก่อน Production

- [ ] ตั้งค่า Payment Gateway (Production Mode)
- [ ] ตั้งค่า Webhook URL
- [ ] ตั้งค่า Environment Variables
- [ ] ทดสอบ Webhook ด้วยเงินจริง (จำนวนน้อย)
- [ ] ตั้งค่าส่งอีเมล (SendGrid/Mailgun)
- [ ] ตั้งค่า Telegram notification
- [ ] เปิด SSL/HTTPS
- [ ] เก็บ Logs ทุก Transaction

---

## 💡 Tips

1. **Idempotency**: ตรวจสอบ `orderId` ว่าถูกประมวลผลแล้วหรือไม่ (ป้องกัน duplicate)
2. **Timeout**: Payment Gateway อาจส่ง Webhook ซ้ำถ้า response ช้า
3. **Testing**: ทดสอบทุก Case (success, failed, pending)
4. **Monitoring**: ตั้งแจ้งเตือนถ้ามี Webhook ล้มเหลว

---

## 🚀 ตัวอย่างการใช้งานจริง

```typescript
// หลัง Webhook สำเร็จ
1. สร้าง License Key
2. บันทึก Database
3. ส่ง Telegram แจ้ง Admin
4. ส่งอีเมลแจ้ง License Key ให้ลูกค้า
5. Log transaction
✅ เสร็จสิ้น
```
