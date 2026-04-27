import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "novure_uid";

const AUTH_REQUIRED_PREFIXES = [
  "/api/cart",
  "/api/account",
  "/api/orders",
  "/api/checkout/midtrans",
];

const AUTH_BYPASS_EXACT = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/shipping",
  "/api/checkout/midtrans/notification",
]);

function isAuthRequired(pathname: string): boolean {
  if (AUTH_BYPASS_EXACT.has(pathname)) {
    return false;
  }

  return AUTH_REQUIRED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/") || !isAuthRequired(pathname)) {
    return NextResponse.next();
  }

  const userId = request.cookies.get(SESSION_COOKIE_NAME)?.value?.trim();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", userId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
