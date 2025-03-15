import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { i18n } from "./i18n-config";

function getLocale({ headers }: NextRequest): string | undefined {
  const { defaultLocale, locales } = i18n;

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({
    headers: Object.fromEntries([...headers]),
  }).languages([...locales]);

  return matchLocale(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname == "/api/og")
    return NextResponse.rewrite(request.nextUrl, {
      headers: new Headers([
        [
          "cache-control",
          "max-age=3600, s-maxage=3600, stale-while-revalidate=600",
        ],
        ["cdn-cache-control", "max-age=3600, stale-while-revalidate=600"],
      ]),
    });

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|apple-icon|icon).*)",
    "/api/og",
  ],
};
