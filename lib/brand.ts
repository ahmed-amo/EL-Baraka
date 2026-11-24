/** Photo of the cobalt gate at Jijel. Hero poster when no video is set. */
export const GATE_PHOTO = "/images/services/IMG_2665.jpg";

/** Deployable hero clip (committed). Full master `hero.mp4` is gitignored (~236MB). */
export const HERO_VIDEO_WEB = "/videos/hero.web.mp4";

/** Prefer CDN/env, then DB URL, then the committed web file. Remap missing master path. */
export function resolveHeroVideoUrl(stored?: string | null) {
  const fromEnv = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
  if (fromEnv) return fromEnv;
  const url = (stored || "").trim();
  if (!url || url === "/videos/hero.mp4" || url.endsWith("/hero.mp4")) return HERO_VIDEO_WEB;
  return url;
}

/** Close view through the same bars. About column. */
export const GATE_CLOSE = "/images/about/about.jpg";
