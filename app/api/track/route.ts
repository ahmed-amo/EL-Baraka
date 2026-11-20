import { after } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import UAParser from "ua-parser-js";
import { getPrisma } from "@/lib/db";
import { anonymousHash, cityFrom, countryFrom, dayKey, ipHash, shouldIgnoreTrack, clientIp } from "@/lib/privacy";
import { rateLimit } from "@/lib/rate-limit";
import { trackSchema } from "@/lib/validators";

export const runtime = "nodejs";

const events = new Set(["whatsapp_click", "phone_click", "contact_submit", "cv_submit", "service_view"]);

/** Sample anonymous (no-cookie) pageviews to cut DB writes on a viewer-heavy site. */
const ANON_SAMPLE = 0.2;

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const raw = await req.json().catch(() => null);
  const parsed = trackSchema.safeParse(raw);
  if (!parsed.success) return new NextResponse(null, { status: 204 });
  if (shouldIgnoreTrack({ ua, dnt: req.headers.get("dnt"), gpc: req.headers.get("sec-gpc"), path: parsed.data.path })) {
    return new NextResponse(null, { status: 204 });
  }

  const db = getPrisma();
  if (!db) return new NextResponse(null, { status: 204 });
  const ip = clientIp(req.headers);
  const hash = ipHash(ip);
  if (!(await rateLimit(`track:${hash}`, 60, 60 * 1000))) return new NextResponse(null, { status: 204 });

  const agent = new UAParser(ua).getResult();
  const device = agent.device.type === "mobile" ? "mobile" : agent.device.type === "tablet" ? "tablette" : "ordinateur";
  const browser = agent.browser.name || "";
  const os = agent.os.name || "";
  const country = countryFrom(req.headers);
  const city = cityFrom(req.headers);
  const response = new NextResponse(null, { status: 204 });
  const data = parsed.data;

  if (data.type === "event" && data.name && events.has(data.name)) {
    const visitorId = data.consent ? req.cookies.get("eb_vid")?.value || "" : "";
    after(async () => {
      try {
        await db.event.create({
          data: { name: data.name!, path: data.path, visitorId, meta: data.meta || undefined },
        });
      } catch (error) {
        console.error("track event", error);
      }
    });
    return response;
  }

  if (!data.consent) {
    if (data.type === "duration") return response;
    if (Math.random() > ANON_SAMPLE) return response;
    after(async () => {
      try {
        await db.pageView.create({
          data: {
            path: data.path,
            country,
            anonymous: true,
            anonHash: anonymousHash(ip, ua, dayKey()),
            dayKey: dayKey(),
          },
        });
      } catch (error) {
        console.error("track anon", error);
      }
    });
    return response;
  }

  let visitorId = req.cookies.get("eb_vid")?.value;
  if (!visitorId) visitorId = crypto.randomUUID();
  let sessionId = req.cookies.get("eb_sid")?.value;
  if (!sessionId) sessionId = crypto.randomUUID();
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set("eb_vid", visitorId, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 60 * 60 * 24 * 395 });
  response.cookies.set("eb_sid", sessionId, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 60 * 30 });

  after(async () => {
    try {
      await db.visitor.upsert({
        where: { visitorId },
        create: { visitorId, country, city, device, browser, os, consent: true },
        update: { lastSeen: new Date(), country, city, device, browser, os, consent: true },
      });

      if (data.type === "duration" && typeof data.duration === "number") {
        if (data.duration < 5) return;
        const latest = await db.pageView.findFirst({
          where: { visitorId, path: data.path },
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });
        if (latest) await db.pageView.update({ where: { id: latest.id }, data: { duration: data.duration } });
        return;
      }

      await db.pageView.create({
        data: {
          visitorId,
          path: data.path,
          referrer: data.referrer,
          utmSource: data.utmSource,
          utmMedium: data.utmMedium,
          utmCampaign: data.utmCampaign,
          country,
          city,
          device,
          browser,
          os,
          sessionId,
          dayKey: dayKey(),
        },
      });
    } catch (error) {
      console.error("track consent", error);
    }
  });

  return response;
}
