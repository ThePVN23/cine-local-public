// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default async function middleware(request: NextRequest) {
  const session = await auth(); 
  const isAuthenticated = !!session?.user;

  const { pathname } = request.nextUrl;

  // Paths you want to protect
  const protectedPaths = ["/my-reviews", "/watchlist", "/host"];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL("/login", request.url);

    // Optional: let you redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-reviews/:path*", "/watchlist/:path*", "/host/:path*"],
};
