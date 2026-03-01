import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/capture", "/query", "/knowledge"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/capture/:path*",
    "/query/:path*",
    "/knowledge/:path*",
  ],
};
