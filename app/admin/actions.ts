"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { deliverContact } from "@/lib/deliver";
import { getPrisma } from "@/lib/db";
import { revalidateSite } from "@/lib/revalidate-site";
import { newAdminSchema, passwordSchema, settingsSchema } from "@/lib/validators";

async function audit(adminId: string, action: string, entity: string) {
  const db = getPrisma();
  if (!db) return;
  await db.auditLog.create({ data: { adminId, action, entity } });
}

export async function saveSettings(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false as const, error: "invalid" };
  const db = getPrisma();
  if (!db) return { ok: false as const, error: "db" };
  const data = {
    ...parsed.data,
    whatsappNumber: parsed.data.whatsappNumber.replace(/\D/g, ""),
    showLiveDot: formData.get("showLiveDot") === "on",
  };
  await db.siteSettings.update({ where: { id: "singleton" }, data });
  await audit(admin.sub, "settings", "site");
  revalidateSite();
  return { ok: true as const };
}

export async function setMessageStatus(id: string, status: "NEW" | "READ" | "ARCHIVED") {
  const admin = await requireAdmin();
  const db = getPrisma();
  if (!db) return;
  await db.contactMessage.update({ where: { id }, data: { status } });
  await audit(admin.sub, "message", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const admin = await requireAdmin();
  const db = getPrisma();
  if (!db) return;
  await db.contactMessage.delete({ where: { id } });
  await audit(admin.sub, "message-delete", id);
  revalidatePath("/admin/messages");
}

export async function retryMessage(id: string) {
  await requireAdmin();
  await deliverContact(id);
  revalidatePath("/admin/messages");
}

export async function setApplicationStatus(id: string, status: "NEW" | "READ" | "ARCHIVED") {
  const admin = await requireAdmin();
  const db = getPrisma();
  if (!db) return;
  await db.jobApplication.update({ where: { id }, data: { status } });
  await audit(admin.sub, "application", id);
  revalidatePath("/admin/candidatures");
}

export async function createOpening(formData: FormData) {
  const admin = await requireAdmin();
  const db = getPrisma();
  if (!db) return;
  const title = String(formData.get("title") || "").trim();
  if (title.length < 2) return;
  const count = await db.jobOpening.count();
  await db.jobOpening.create({
    data: {
      title,
      location: String(formData.get("location") || "Jijel"),
      description: String(formData.get("description") || ""),
      order: count + 1,
      isActive: true,
    },
  });
  await audit(admin.sub, "opening", title);
  revalidateSite();
}

export async function deleteOpening(id: string) {
  const admin = await requireAdmin();
  const db = getPrisma();
  if (!db) return;
  await db.jobOpening.delete({ where: { id } });
  await audit(admin.sub, "opening-delete", id);
  revalidateSite();
}

export async function changePassword(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) return { ok: false as const, error: "invalid" };
  const db = getPrisma();
  if (!db) return { ok: false as const, error: "db" };
  const user = await db.adminUser.findUnique({ where: { id: admin.sub } });
  if (!user || !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
    return { ok: false as const, error: "invalid" };
  }
  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) },
  });
  return { ok: true as const };
}

export async function addAdmin(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = newAdminSchema.safeParse({
    name: formData.get("name"),
    email: String(formData.get("email") || "").toLowerCase(),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false as const, error: "invalid" };
  const db = getPrisma();
  if (!db) return { ok: false as const, error: "db" };
  await db.adminUser.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
    },
  });
  await audit(admin.sub, "admin-create", parsed.data.email);
  return { ok: true as const };
}
