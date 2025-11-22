// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest) {
  // 1. Use getToken instead of auth(). This works in Edge runtime.
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuthenticated = !!token;
  const { pathname } = request.nextUrl;

  // Paths you want to protect
  const protectedPaths = ["/my-reviews", "/watchlist", "/host"];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL("/login", request.url);
    // Redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // The matcher prevents the middleware from running on static files
  matcher: ["/my-reviews/:path*", "/watchlist/:path*", "/host/:path*"],
};