type AlertInput = {
  kind: "contact" | "candidature";
  name: string;
  email: string;
  phone: string;
  detail: string;
};

export async function notifyAdmin(input: AlertInput) {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = (process.env.WHATSAPP_ADMIN_NUMBER || "").replace(/\D/g, "");
  if (!token || !phoneId || !to) {
    console.info("WhatsApp: notification ignorée (variables absentes).");
    return false;
  }

  const template = process.env.WHATSAPP_TEMPLATE_NAME;
  const body = template
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "fr" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: input.kind },
                { type: "text", text: input.name.slice(0, 60) },
                { type: "text", text: input.phone.slice(0, 40) || "—" },
                { type: "text", text: input.detail.slice(0, 200) },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: `EL BARAKA CONSEIL — ${input.kind === "contact" ? "Nouveau message" : "Nouvelle candidature"}\n${input.name}\n${input.email}\n${input.phone || "—"}\n${input.detail.slice(0, 400)}`,
        },
      };

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    console.error("whatsapp", await response.text());
    return false;
  }
  return true;
}
