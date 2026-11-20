import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_req: Request, context: { params: Promise<{ key: string }> }) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { key } = await context.params;
  if (!/^[a-f0-9]{32}\.pdf$/i.test(key)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const file = path.join(process.cwd(), "storage", "private", key);
  try {
    const data = await readFile(file);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${key}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "missing" }, { status: 404 });
  }
}
