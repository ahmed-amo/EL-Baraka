import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/origin";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "origin" }, { status: 403 });
  const response = NextResponse.redirect(new URL("/admin/login", req.url), 303);
  response.cookies.set("eb_session", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
