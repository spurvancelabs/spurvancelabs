import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/landing", req.url));
  }

  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/admin");

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");

  const isVerifyPage = req.nextUrl.pathname.startsWith("/verify-email");

  if (isProtected && !payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && payload) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isVerifyPage && payload) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/verify-email",
  ],
};