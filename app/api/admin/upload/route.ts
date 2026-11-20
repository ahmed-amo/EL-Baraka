import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { sameOrigin } from "@/lib/origin";
import { revalidateSite } from "@/lib/revalidate-site";
import { assertSvgSafe, sniffMime, storeFile } from "@/lib/storage";

export const runtime = "nodejs";

const imageMimes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/avif"]);
const videoMimes = new Set(["video/mp4", "video/webm"]);

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "origin" }, { status: 403 });
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = getPrisma();
  if (!db) return NextResponse.json({ error: "db" }, { status: 503 });

  const form = await req.formData();
  const file = form.get("file");
  const intent = String(form.get("intent") || "");
  if (!(file instanceof File)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniffMime(buffer);
  if (!mime) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (mime === "image/svg+xml") assertSvgSafe(buffer);
  const isVideo = videoMimes.has(mime);
  const isImage = imageMimes.has(mime);
  if (isVideo && buffer.length > 50 * 1024 * 1024) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (isImage && buffer.length > 8 * 1024 * 1024) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const stored = await storeFile({
    buffer,
    filename: file.name || "upload",
    mime,
    visibility: "public",
  });

  if (intent === "asset") {
    const key = String(form.get("key") || "");
    if (!["hero_video", "hero_poster", "escort_photo", "about_image"].includes(key)) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    if (key === "hero_video" && !isVideo) return NextResponse.json({ error: "invalid" }, { status: 400 });
    if (key !== "hero_video" && !isImage) return NextResponse.json({ error: "invalid" }, { status: 400 });
    await db.mediaAsset.upsert({
      where: { key },
      update: { url: stored.url },
      create: { key, url: stored.url, type: isVideo ? "VIDEO" : "IMAGE", label: key },
    });
    const patch =
      key === "hero_video"
        ? { heroVideoUrl: stored.url }
        : key === "hero_poster"
          ? { heroPosterUrl: stored.url }
          : key === "about_image"
            ? { aboutImageUrl: stored.url }
            : {};
    if (Object.keys(patch).length) await db.siteSettings.update({ where: { id: "singleton" }, data: patch });
    if (key === "escort_photo") await db.service.updateMany({ where: { slug: "escorte" }, data: { imageUrl: stored.url } });
  } else if (intent === "service-image") {
    if (!isImage) return NextResponse.json({ error: "invalid" }, { status: 400 });
    await db.service.update({ where: { id: String(form.get("id")) }, data: { imageUrl: stored.url } });
  } else if (intent === "gallery") {
    if (!isImage) return NextResponse.json({ error: "invalid" }, { status: 400 });
    const category = form.get("category") === "INSIDE" ? "INSIDE" : "FIELD";
    const count = await db.galleryImage.count();
    await db.galleryImage.create({
      data: {
        url: stored.url,
        alt: String(form.get("alt") || "Photo EL BARAKA CONSEIL").slice(0, 180),
        category,
        order: count + 1,
        isActive: true,
      },
    });
  } else {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  await db.auditLog.create({ data: { adminId: session.sub, action: "upload", entity: intent } });
  revalidateSite();
  return NextResponse.json({ ok: true, url: stored.url });
}
