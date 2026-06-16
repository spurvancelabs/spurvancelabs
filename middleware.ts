import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
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
      const res = NextResponse.redirect(new URL("/login", req.url));

      res.cookies.delete("token");
      res.cookies.delete("refreshToken");

      return res;
    }
  }

  return NextResponse.next();
}