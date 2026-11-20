import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Liveness probe for Railway (and other hosts). Keep it free of DB I/O. */
export async function GET() {
  return NextResponse.json({ ok: true, service: "el-baraka-conseil" }, { status: 200 });
}
