// ไฟล์สำหรับทดสอบส่งข้อความไปยัง Telegram
const BOT_TOKEN = 'ใส่ Bot Token ของคุณที่นี่';
const CHAT_ID = 'ใส่ Chat ID ที่ได้จาก find-chat-id.js';

const testMessage = `🔔 *ทดสอบระบบแจ้งเตือน ProDriver*

✅ Telegram Bot เชื่อมต่อสำเร็จ
📱 พร้อมรับการแจ้งเตือนเมื่อมีการเปิดใช้งานคีย์

⏰ เวลา: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}`;

console.log('📤 กำลังส่งข้อความทดสอบ...\n');

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: CHAT_ID,
    text: testMessage,
    parse_mode: 'Markdown'
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log('✅ ส่งข้อความสำเร็จ!');
      console.log('   Message ID:', data.result.message_id);
      console.log('   ไปเช็คใน Telegram ของคุณเลย! 🎉');
      console.log('\n💡 ถ้าได้รับข้อความแล้ว แสดงว่าตั้งค่าถูกต้อง');
      console.log('   สามารถนำค่าเหล่านี้ไปใส่ใน .env.local หรือ Vercel ได้เลย');
    } else {
      console.log('❌ ส่งข้อความไม่สำเร็จ');
      console.log('   สาเหตุ:', data.description);
      console.log('\n💡 สาเหตุที่พบบ่อย:');
      console.log('   - Bot Token ไม่ถูกต้อง');
      console.log('   - Chat ID ไม่ถูกต้อง');
      console.log('   - ยังไม่ได้กด Start กับบอท (ถ้าส่งส่วนตัว)');
      console.log('   - ยังไม่ได้เพิ่มบอทเข้ากลุ่ม (ถ้าส่งในกลุ่ม)');
    }
  })
  .catch(err => {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
  });
