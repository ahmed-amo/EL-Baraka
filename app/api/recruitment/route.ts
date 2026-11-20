import { NextResponse } from "next/server";
import { deliverApplication } from "@/lib/deliver";
import { getPrisma } from "@/lib/db";
import { sameOrigin } from "@/lib/origin";
import { clientIp, ipHash, shouldIgnoreTrack } from "@/lib/privacy";
import { rateLimit } from "@/lib/rate-limit";
import { sniffMime, storeFile } from "@/lib/storage";
import { verifyTurnstile } from "@/lib/turnstile";
import { applicationSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "origin" }, { status: 403 });
  const form = await req.formData();
  const parsed = applicationSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    phone: form.get("phone"),
    position: form.get("position"),
    message: form.get("message"),
    companyWebsite: form.get("companyWebsite") || "",
    turnstileToken: form.get("turnstileToken") || "",
  });
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (parsed.data.companyWebsite) return NextResponse.json({ ok: true });
  if (form.get("consent") !== "on") return NextResponse.json({ error: "invalid" }, { status: 400 });

  const ip = clientIp(req.headers);
  if (!(await rateLimit(`job:${ipHash(ip)}`, 5, 60 * 60 * 1000))) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }
  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const file = form.get("cv");
  if (!(file instanceof File)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniffMime(buffer);
  if (mime !== "application/pdf") return NextResponse.json({ error: "invalid" }, { status: 400 });

  const db = getPrisma();
  if (!db) return NextResponse.json({ error: "db" }, { status: 503 });
  const stored = await storeFile({ buffer, filename: file.name || "cv.pdf", mime, visibility: "private" });
  const application = await db.jobApplication.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      position: parsed.data.position,
      message: parsed.data.message,
      cvUrl: stored.url,
      cvKey: stored.key,
    },
  });
  const ua = req.headers.get("user-agent") || "";
  if (!shouldIgnoreTrack({ ua, dnt: req.headers.get("dnt"), gpc: req.headers.get("sec-gpc"), path: "/recrutement" })) {
    await db.event.create({ data: { name: "cv_submit", path: "/recrutement" } });
  }
  await deliverApplication(application.id);
  return NextResponse.json({ ok: true });
}
