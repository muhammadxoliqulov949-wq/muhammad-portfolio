import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { LOCALE_COOKIE, parseLocale } from "@/lib/i18n-core";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-this-in-production-please"
);
const COOKIE_NAME = "portfolio_admin_session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const langParam = req.nextUrl.searchParams.get("lang");
  const locale = parseLocale(langParam || req.cookies.get(LOCALE_COOKIE)?.value);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", locale);

  let res: NextResponse;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      res = NextResponse.redirect(new URL("/admin/login", req.url));
    } else {
      try {
        await jwtVerify(token, SECRET);
        res = NextResponse.next({ request: { headers: requestHeaders } });
      } catch {
        res = NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
  } else {
    res = NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (langParam) {
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
