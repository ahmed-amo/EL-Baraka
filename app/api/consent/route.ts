import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { sameOrigin } from "@/lib/origin";
import { POLICY_VERSION, consentSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "origin" }, { status: 403 });
  const parsed = consentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const db = getPrisma();
  const visitorId = req.cookies.get("eb_vid")?.value || "";
  if (db) {
    await db.consentLog.create({
      data: {
        visitorId,
        necessary: true,
        analytics: parsed.data.analytics,
        marketing: parsed.data.marketing,
        policyVersion: POLICY_VERSION,
      },
    });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    "eb_consent",
    JSON.stringify({ necessary: true, analytics: parsed.data.analytics, marketing: parsed.data.marketing, v: POLICY_VERSION }),
    {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    },
  );
  return response;
}
