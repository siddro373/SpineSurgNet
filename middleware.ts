import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";

  // Public page routes
  const publicRoutes = ["/login", "/register", "/verify"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Public API routes (no auth needed)
  const publicApiRoutes = ["/api/auth", "/api/register", "/api/conferences"];
  const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route));

  // API route protection
  if (pathname.startsWith("/api")) {
    if (isPublicApiRoute) return;
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (pathname.startsWith("/api/admin") && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return;
  }

  // Redirect authenticated users away from auth pages
  if (isPublicRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Redirect unauthenticated users to login
  if (!isPublicRoute && !isLoggedIn && pathname !== "/") {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Admin page route protection
  if (pathname.startsWith("/admin") && !isAdmin) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|logo|uploads).*)",
  ],
};
