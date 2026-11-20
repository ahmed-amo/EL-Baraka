export const SESSION_COOKIE = "eb_session";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function encode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function decode(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function hmacKey(usages: KeyUsage[]) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, usages);
}

export async function signSession(payload: SessionPayload) {
  const key = await hmacKey(["sign"]);
  if (!key) throw new Error("AUTH_SECRET manquant");
  const header = encode(encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = encode(
    encoder.encode(
      JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      }),
    ),
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${body}`));
  return `${header}.${body}.${encode(new Uint8Array(signature))}`;
}

export async function readSession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;
  const key = await hmacKey(["verify"]);
  if (!key) return null;
  const valid = await crypto.subtle.verify("HMAC", key, decode(signature), encoder.encode(`${header}.${body}`));
  if (!valid) return null;
  try {
    const payload = JSON.parse(decoder.decode(decode(body))) as Partial<SessionPayload> & { exp?: number };
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email, name: typeof payload.name === "string" ? payload.name : "Admin" };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
