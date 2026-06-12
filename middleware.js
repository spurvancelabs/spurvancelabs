import { NextResponse } from "next/server";
import { verifyToken } from "./src/lib/auth";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/profile");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isProtected && token) {
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/profile", "/profile/:path*"],
};
