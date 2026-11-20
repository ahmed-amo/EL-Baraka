import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export const runtime = "nodejs";

function cell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET(req: Request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = getPrisma();
  if (!db) return NextResponse.json({ error: "db" }, { status: 503 });
  const range = Number(new URL(req.url).searchParams.get("range") || 30);
  const days = range === 7 || range === 90 ? range : 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await db.pageView.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: "desc" }, take: 5000 });
  const header = ["time", "path", "country", "device", "browser", "os", "referrer"].join(",");
  const body = rows
    .map((row) =>
      [row.createdAt.toISOString(), row.path, row.country, row.device, row.browser, row.os, row.referrer].map(cell).join(","),
    )
    .join("\n");
  return new NextResponse(`${header}\n${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="visites-${days}j.csv"`,
    },
  });
}
