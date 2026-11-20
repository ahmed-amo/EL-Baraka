import { getPrisma } from "./db";
import { applicationAdminHtml, applicationReplyHtml, contactAdminHtml, contactReplyHtml, sendMail } from "./mail";
import { notifyAdmin } from "./whatsapp";

export async function deliverContact(id: string) {
  const db = getPrisma();
  if (!db) return false;
  const message = await db.contactMessage.findUnique({ where: { id } });
  if (!message) return false;
  const to = process.env.MAIL_TO || message.email;
  const date = message.createdAt.toLocaleString("fr-DZ");
  const emailSent = await sendMail({
    to,
    subject: `[EL BARAKA CONSEIL] Nouveau message — ${message.name}`,
    html: contactAdminHtml({
      name: message.name,
      company: message.company,
      email: message.email,
      phone: message.phone,
      city: message.city,
      service: message.service,
      message: message.message,
      date,
    }),
    replyTo: message.email,
  });
  const autoReplySent = await sendMail({
    to: message.email,
    subject: "EL BARAKA CONSEIL — nous avons bien reçu votre message",
    html: contactReplyHtml(message.name),
  });
  const whatsappSent = await notifyAdmin({
    kind: "contact",
    name: message.name,
    email: message.email,
    phone: message.phone,
    detail: [message.company, message.city, message.service, message.message].filter(Boolean).join(" — "),
  });
  await db.contactMessage.update({ where: { id }, data: { emailSent, autoReplySent, whatsappSent } });
  return emailSent;
}

export async function deliverApplication(id: string) {
  const db = getPrisma();
  if (!db) return false;
  const application = await db.jobApplication.findUnique({ where: { id } });
  if (!application) return false;
  const to = process.env.MAIL_TO || application.email;
  const emailSent = await sendMail({
    to,
    subject: `[EL BARAKA CONSEIL] Candidature — ${application.name}`,
    html: applicationAdminHtml(application),
    replyTo: application.email,
  });
  await sendMail({
    to: application.email,
    subject: "EL BARAKA CONSEIL — candidature bien reçue",
    html: applicationReplyHtml(application.name),
  });
  await notifyAdmin({
    kind: "candidature",
    name: application.name,
    email: application.email,
    phone: application.phone,
    detail: `${application.position} — ${application.message}`,
  });
  await db.jobApplication.update({ where: { id }, data: { emailSent } });
  return emailSent;
}
