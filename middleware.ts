import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { readSession, SESSION_COOKIE } from "./lib/session";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-next-intl-locale", "fr");
    if (!isLogin) {
      const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
      if (!session) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
