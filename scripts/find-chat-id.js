// ไฟล์สำหรับทดสอบหา Chat ID
const BOT_TOKEN = 'ใส่ Bot Token ของคุณที่นี่';

console.log('🔍 กำลังค้นหา Chat ID...\n');

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`)
  .then(res => res.json())
  .then(data => {
    console.log('📩 Telegram Updates (รายการข้อความล่าสุด):');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');

    if (data.ok && data.result && data.result.length > 0) {
      console.log('✅ พบข้อความ! Chat IDs ที่พบ:\n');

      const chatIds = new Set();
      data.result.forEach(update => {
        if (update.message && update.message.chat) {
          const chat = update.message.chat;
          chatIds.add({
            id: chat.id,
            type: chat.type,
            title: chat.title || chat.first_name || 'Unknown',
          });
        }
      });

      chatIds.forEach(chat => {
        console.log(`  📱 Chat ID: ${chat.id}`);
        console.log(`     ประเภท: ${chat.type}`);
        console.log(`     ชื่อ: ${chat.title}`);
        console.log('');
      });

      console.log('💡 คัดลอก Chat ID ที่ต้องการไปใส่ใน .env.local:');
      console.log('   TELEGRAM_CHAT_ID=<Chat ID ที่คุณเลือก>');
    } else {
      console.log('⚠️  ไม่พบข้อความใดๆ!');
      console.log('\n📝 วิธีแก้:');
      console.log('   1. เปิด Telegram และค้นหาบอทของคุณ');
      console.log('   2. กด Start และส่งข้อความอะไรก็ได้ (เช่น "สวัสดี")');
      console.log('   3. หรือเพิ่มบอทเข้ากลุ่มและส่งข้อความในกลุ่ม');
      console.log('   4. รันคำสั่งนี้อีกครั้ง: node scripts/find-chat-id.js');
    }
  })
  .catch(err => {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
    console.log('\n💡 ตรวจสอบว่า Bot Token ถูกต้องหรือไม่');
  });
