import nodemailer from "nodemailer";
import { escapeHtml } from "./utils";

type MailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

function brandShell(title: string, body: string) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#F6F7FB;font-family:Arial,sans-serif;color:#0A0F24">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F7FB;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E6E8F0">
        <tr><td style="background:#060B2B;padding:28px 32px">
          <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#C9A24B">EL BARAKA CONSEIL</div>
          <div style="font-size:22px;color:#ffffff;margin-top:8px">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px;font-size:15px;line-height:1.6">${body}</td></tr>
        <tr><td style="padding:0 32px 28px;font-size:12px;color:#5C6578">
          S.A.R.L. EL BARAKA CONSEIL · Siège social : Jijel<br>
          Tél. 021 59 59 59 · Fax 021 58 58 58<br>
          Plus de 30 ans d'expertise · Gardiennage, sécurisation, transport de fonds et produits sensibles
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

export function contactAdminHtml(input: {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  message: string;
  date: string;
}) {
  const rows = [
    ["Nom", input.name],
    ["Entreprise", input.company || "—"],
    ["Téléphone", input.phone || "—"],
    ["E-mail", input.email],
    ["Ville", input.city || "—"],
    ["Besoin", input.service || "—"],
    ["Date", input.date],
  ]
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 10px"><strong style="color:#0B1448">${escapeHtml(label)}</strong><br>${escapeHtml(value)}</p>`,
    )
    .join("");
  return brandShell(
    "Nouveau message",
    `${rows}<p style="margin:16px 0 0;padding:16px;background:#F6F7FB;border-radius:12px">${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>`,
  );
}

export function contactReplyHtml(name: string) {
  return brandShell(
    "Message bien reçu",
    `<p>Bonjour ${escapeHtml(name)},</p>
     <p>Nous avons bien reçu votre message. Un membre de l'équipe EL BARAKA CONSEIL vous répondra dans les meilleurs délais.</p>
     <p>Cordialement,<br>EL BARAKA CONSEIL</p>`,
  );
}

export function applicationAdminHtml(input: { name: string; email: string; phone: string; position: string; message: string }) {
  return brandShell(
    "Nouvelle candidature",
    `<p><strong>Nom</strong><br>${escapeHtml(input.name)}</p>
     <p><strong>E-mail</strong><br>${escapeHtml(input.email)}</p>
     <p><strong>Téléphone</strong><br>${escapeHtml(input.phone)}</p>
     <p><strong>Poste</strong><br>${escapeHtml(input.position)}</p>
     <p style="padding:16px;background:#F6F7FB;border-radius:12px">${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>`,
  );
}

export function applicationReplyHtml(name: string) {
  return brandShell(
    "Candidature bien reçue",
    `<p>Bonjour ${escapeHtml(name)},</p>
     <p>Nous avons bien reçu votre candidature. Notre équipe l'étudiera avec attention.</p>
     <p>Cordialement,<br>EL BARAKA CONSEIL</p>`,
  );
}

async function sendSmtp(input: MailInput) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return false;
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM || user,
    to: input.to,
    subject: input.subject,
    html: input.html,
    replyTo: input.replyTo,
  });
  return true;
}

async function sendResend(input: MailInput) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "EL BARAKA CONSEIL <onboarding@resend.dev>",
      to: [input.to],
      subject: input.subject,
      html: input.html,
      reply_to: input.replyTo,
    }),
  });
  if (!response.ok) {
    console.error("resend", await response.text());
    return false;
  }
  return true;
}

export async function sendMail(input: MailInput) {
  try {
    if (await sendSmtp(input)) return true;
  } catch (error) {
    console.error("smtp", error);
  }
  try {
    return await sendResend(input);
  } catch (error) {
    console.error("resend", error);
    return false;
  }
}
