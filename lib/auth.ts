import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma } from "./db";
import { readSession, SESSION_COOKIE, type SessionPayload } from "./session";

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return readSession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const db = getPrisma();
  if (!db) redirect("/admin/login");
  const user = await db.adminUser.findUnique({ where: { id: session.sub } });
  if (!user) redirect("/admin/login");
  return session;
}

export async function requireAdminApi() {
  const session = await getSession();
  if (!session) return null;
  const db = getPrisma();
  if (!db) return null;
  const user = await db.adminUser.findUnique({ where: { id: session.sub } });
  if (!user) return null;
  return session;
}
