import { createHash } from "crypto";
import { isbot } from "isbot";

export function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "0.0.0.0";
  return headers.get("x-real-ip") || "0.0.0.0";
}

export function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function ipHash(ip: string) {
  const salt = process.env.IP_HASH_SALT || "el-baraka";
  return hashValue(`${ip}|${salt}`);
}

export function anonymousHash(ip: string, userAgent: string, day: string) {
  const salt = process.env.IP_HASH_SALT || "el-baraka";
  return hashValue(`${ip}|${userAgent}|${day}|${salt}`);
}

export function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function shouldIgnoreTrack(input: { ua: string; dnt: string | null; gpc: string | null; path: string }) {
  if (!input.path || input.path.startsWith("/admin") || input.path.startsWith("/api")) return true;
  if (input.dnt === "1" || input.gpc === "1") return true;
  if (!input.ua || isbot(input.ua)) return true;
  return false;
}

export function countryFrom(headers: Headers) {
  return (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country") ||
    ""
  );
}

export function cityFrom(headers: Headers) {
  const raw = headers.get("x-vercel-ip-city") || headers.get("x-city") || "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
