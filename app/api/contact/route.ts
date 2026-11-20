import { NextResponse } from "next/server";
import { deliverContact } from "@/lib/deliver";
import { getPrisma } from "@/lib/db";
import { sameOrigin } from "@/lib/origin";
import { clientIp, ipHash, shouldIgnoreTrack } from "@/lib/privacy";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "origin" }, { status: 403 });
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (parsed.data.companyWebsite) return NextResponse.json({ ok: true });

  const ip = clientIp(req.headers);
  const hash = ipHash(ip);
  if (!(await rateLimit(`contact:${hash}`, 5, 60 * 60 * 1000))) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }
  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const db = getPrisma();
  if (!db) return NextResponse.json({ error: "db" }, { status: 503 });
  const message = await db.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      city: parsed.data.city,
      service: parsed.data.service,
      message: parsed.data.message,
      ipHash: hash,
    },
  });
  const ua = req.headers.get("user-agent") || "";
  if (!shouldIgnoreTrack({ ua, dnt: req.headers.get("dnt"), gpc: req.headers.get("sec-gpc"), path: "/contact" })) {
    await db.event.create({ data: { name: "contact_submit", path: "/contact" } });
  }
  await deliverContact(message.id);
  return NextResponse.json({ ok: true, emailSent: (await db.contactMessage.findUnique({ where: { id: message.id } }))?.emailSent ?? false });
}
