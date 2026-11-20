import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { sameOrigin } from "@/lib/origin";
import { clientIp, ipHash } from "@/lib/privacy";
import { rateLimit } from "@/lib/rate-limit";
import { sessionCookieOptions, signSession } from "@/lib/session";
import { loginSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "origin" }, { status: 403 });
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const hash = ipHash(clientIp(req.headers));
  if (!(await rateLimit(`login:${hash}`, 8, 15 * 60 * 1000))) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }
  const db = getPrisma();
  if (!db) return NextResponse.json({ error: "db" }, { status: 503 });
  const user = await db.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  const ok = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) return NextResponse.json({ error: "invalid" }, { status: 401 });
  const token = await signSession({ sub: user.id, email: user.email, name: user.name });
  const response = NextResponse.json({ ok: true });
  response.cookies.set("eb_session", token, sessionCookieOptions());
  return response;
}
