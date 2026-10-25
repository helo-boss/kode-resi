export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return response.status(500).json({ error: "Telegram is not configured" });
  }

  const trackingCode = typeof request.body?.trackingCode === "string"
    ? request.body.trackingCode.trim()
    : "";

  if (!trackingCode || trackingCode.length > 120) {
    return response.status(400).json({ error: "Invalid tracking code" });
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `Kode resi baru diterima:\n${trackingCode}`,
      disable_web_page_preview: true,
    }),
  });

  if (!telegramResponse.ok) {
    return response.status(502).json({ error: "Telegram request failed" });
  }

  return response.status(200).json({ ok: true });
}
