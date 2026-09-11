const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface ActivationNotification {
  key: string;
  deviceId: string;
  productName?: string;
  userEmail?: string;
}

export async function sendTelegramNotification(data: ActivationNotification): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram credentials not configured");
    return false;
  }

  try {
    const message = `🔔 *มีการเปิดใช้งานคีย์ใหม่\\!*

🔑 Key: \`${escapeMarkdown(data.key)}\`
📱 Device ID: \`${escapeMarkdown(data.deviceId)}\`
${data.productName ? `📦 สินค้า: ${escapeMarkdown(data.productName)}` : ""}
${data.userEmail ? `👤 ผู้ใช้: ${escapeMarkdown(data.userEmail)}` : ""}
⏰ เวลา: ${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "MarkdownV2",
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return false;
  }
}

// Escape special characters for Telegram MarkdownV2
function escapeMarkdown(text: string): string {
  return text.replace(/[_*\[\]()~`>#+=|{}.!-]/g, "\\$&");
}
