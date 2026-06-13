import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./src/lib/auth";

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
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/profile", "/profile/:path*"],
};
