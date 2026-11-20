import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createHash, randomBytes } from "crypto";

export type StoredFile = { url: string; key: string };

function safeExt(filename: string, mime: string) {
  const fromName = path.extname(filename).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".pdf", ".mp4", ".webm", ".avif"];
  if (allowed.includes(fromName)) return fromName === ".jpeg" ? ".jpg" : fromName;
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/svg+xml") return ".svg";
  if (mime === "image/avif") return ".avif";
  if (mime === "application/pdf") return ".pdf";
  if (mime === "video/mp4") return ".mp4";
  if (mime === "video/webm") return ".webm";
  return "";
}

export function sniffMime(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf.length >= 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  if (buf.length >= 12 && buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") {
    return "image/webp";
  }
  if (buf.length >= 5 && buf.subarray(0, 5).toString() === "%PDF-") return "application/pdf";
  if (buf.length >= 12 && buf.subarray(4, 8).toString() === "ftyp") return "video/mp4";
  if (buf.length >= 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return "video/webm";
  const head = buf.subarray(0, Math.min(buf.length, 400)).toString("utf8").trimStart().toLowerCase();
  if (head.startsWith("<svg") || head.startsWith("<?xml")) return "image/svg+xml";
  return null;
}

export function assertSvgSafe(buf: Buffer) {
  const text = buf.toString("utf8").toLowerCase();
  if (text.includes("<script") || text.includes("javascript:") || /on[a-z]+\s*=/.test(text)) {
    throw new Error("SVG refusé");
  }
}

async function uploadCloudinary(buf: Buffer, filename: string, mime: string): Promise<StoredFile | null> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !apiKey || !apiSecret) return null;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "elbaraka";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  const body = new FormData();
  body.append("file", new Blob([new Uint8Array(buf)], { type: mime }), filename);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/auto/upload`, { method: "POST", body });
  if (!response.ok) {
    console.error("cloudinary", await response.text());
    return null;
  }
  const json = (await response.json()) as { secure_url?: string; public_id?: string };
  if (!json.secure_url) return null;
  return { url: json.secure_url, key: json.public_id || filename };
}

async function uploadBlob(buf: Buffer, filename: string, mime: string): Promise<StoredFile | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  const { put } = await import("@vercel/blob");
  const blob = await put(`elbaraka/${filename}`, buf, { access: "public", token, contentType: mime });
  return { url: blob.url, key: blob.pathname };
}

async function uploadLocal(buf: Buffer, filename: string, visibility: "public" | "private"): Promise<StoredFile> {
  if (visibility === "private") {
    const dir = path.join(process.cwd(), "storage", "private");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buf);
    return { url: `/api/admin/files/${filename}`, key: filename };
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buf);
  return { url: `/uploads/${filename}`, key: filename };
}

export async function storeFile(input: {
  buffer: Buffer;
  filename: string;
  mime: string;
  visibility: "public" | "private";
}) {
  const ext = safeExt(input.filename, input.mime);
  if (!ext) throw new Error("Extension refusée");
  const filename = `${randomBytes(16).toString("hex")}${ext}`;
  if (input.visibility === "public") {
    const cloud = await uploadCloudinary(input.buffer, filename, input.mime);
    if (cloud) return cloud;
    try {
      const blob = await uploadBlob(input.buffer, filename, input.mime);
      if (blob) return blob;
    } catch (error) {
      console.error("blob", error);
    }
  }
  return uploadLocal(input.buffer, filename, input.visibility);
}
