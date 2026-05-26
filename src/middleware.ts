import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight gate: anything under /app requires a session cookie.
 * We do NOT call `auth()` here — it pulls Prisma into the edge runtime.
 * The actual session validation happens in the protected layout (server component).
 */
export function middleware(req: NextRequest) {
  const isAppRoute = req.nextUrl.pathname.startsWith("/app");
  if (!isAppRoute) return NextResponse.next();

  const sessionCookie =
    req.cookies.get("authjs.session-token") ??
    req.cookies.get("__Secure-authjs.session-token");

  if (!sessionCookie) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
