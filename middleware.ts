import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";

  // Public routes
  const publicRoutes = ["/login", "/register", "/verify"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthApiRoute = pathname.startsWith("/api/auth");

  // Allow all API routes (they handle their own auth)
  if (pathname.startsWith("/api")) return;

  // Redirect authenticated users away from auth pages
  if (isPublicRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Redirect unauthenticated users to login
  if (!isPublicRoute && !isLoggedIn && pathname !== "/") {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Admin route protection
  if (pathname.startsWith("/admin") && !isAdmin) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|logo|uploads).*)",
  ],
};
