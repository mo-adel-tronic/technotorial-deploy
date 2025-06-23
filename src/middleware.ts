import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { RoutesName } from "./constants/RoutesName";

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const { pathname } = request.nextUrl;
  const url = new URL(request.url);
  const origin = url.origin;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);

  if (token && pathname == RoutesName.LOGIN) {
    return NextResponse.redirect(new URL(RoutesName.DASHBOARD, request.url));
  }
  if (!token && pathname.startsWith(RoutesName.DASHBOARD)) {
    return NextResponse.redirect(new URL(RoutesName.LOGIN, request.url));
  }
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    const key = request.headers.get("api_key");
    if (!key) {
      return NextResponse.json("invalid request");
    }
    if (key !== process.env.NEXT_PUBLIC_API_KEY) {
      return NextResponse.json("invalid key");
    }
  }
  return NextResponse.next({
    request: {
        headers: requestHeaders,
    }
});
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/api/:path*"],
};
