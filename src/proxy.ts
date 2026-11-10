import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { isLocalizedRoutePath } from "@/lib/locale-from-pathname";

const handleI18n = createMiddleware(routing);

/**
 * Writes x-pathname on every request and hands the localized ones to next-intl.
 *
 * The matcher covers all paths on purpose: src/app/global-not-found.tsx reads
 * x-pathname to pick the 404 language, and the value it reads must always be
 * server written, never a header the client sent.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (!isLocalizedRoutePath(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const patched = new NextRequest(request.url, {
    headers: requestHeaders,
    method: request.method,
  });
  return handleI18n(patched);
}

export const config = {
  matcher: ["/:path*"],
};
