import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req: { auth: any; nextUrl: any; }) => {
  const isLoggedIn = !!req.auth;
  const url = req.nextUrl;

  // Example: protect /my-reviews and /watchlist
  if (
    !isLoggedIn &&
    (url.pathname.startsWith("/my-reviews") ||
      url.pathname.startsWith("/watchlist") ||
      url.pathname.startsWith("/host"))
  ) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
});

export const config = {
    matcher: ["/my-reviews/:path*", "/watchlist/:path*", "/host/:path*"],
  };
  
