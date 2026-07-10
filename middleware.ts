import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? await verifyToken(token) : null;

  // ─── Admin login page: always accessible ─────────────────
  if (req.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // ─── Admin pages: require admin role ─────────────────
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!payload) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (!payload.role || !["SUPER_ADMIN", "ADMIN", "EDITOR", "NANO_EDITOR", "VIEWER"].includes(payload.role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ─── LMS pages: 404 if not authenticated ─────────────────
  const lmsAuthRoutes = [
    "/lms/my-courses",
    "/lms/learn",
    "/lms/wishlist",
    "/lms/certificates",
    "/lms/profile",
    "/lms/instructor",
    "/lms/admin",
  ];

  if (lmsAuthRoutes.some((p) => req.nextUrl.pathname.startsWith(p)) && !payload) {
    return new NextResponse(null, { status: 404, statusText: "Not Found" });
  }

  // ─── General app pages: redirect to login if not authenticated ──
  const generalProtected = [
    "/dashboard",
    "/profile",
  ];

  if (generalProtected.some((p) => req.nextUrl.pathname.startsWith(p)) && !payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ─── Auth pages: redirect to dashboard if already logged in ──
  const authPages = ["/login", "/signup"];
  if (authPages.some((p) => req.nextUrl.pathname.startsWith(p)) && payload) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ─── Verify email page: redirect if already logged in ──
  if (req.nextUrl.pathname.startsWith("/verify-email") && payload) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/lms/admin/:path*",
    "/lms/instructor/:path*",
    "/lms/my-courses",
    "/lms/learn/:path*",
    "/lms/wishlist",
    "/lms/certificates",
    "/lms/profile",
    "/login",
    "/signup",
    "/verify-email",
  ],
};
