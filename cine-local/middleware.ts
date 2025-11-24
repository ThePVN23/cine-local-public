import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuthenticated = !!token;
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/my-reviews", "/watchlist", "/host"];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-reviews/:path*", "/watchlist/:path*", "/host/:path*"],
};