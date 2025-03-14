import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes with explicit patterns following Clerk's documentation
const isPublicRoute = createRouteMatcher([
  "/", // Home page
  "/sign-in(.*)", // Sign-in pages with any parameters
  "/sign-up(.*)", // Sign-up pages with any parameters
  "/(api|trpc)(.*)", // API routes
  "/_next/(.*)", // Next.js system routes
  "/favicon.ico", // Favicon

  // Simplified static assets patterns that work with path-to-regexp
  "/assets/:path*", // Static assets in the assets directory
  "/images/:path*", // Images directory
]);

export default clerkMiddleware(async (auth, request) => {
  // Get authentication status
  const { userId } = await auth();
  const { pathname } = request.nextUrl;

  // If user is signed in and tries to access sign-in or sign-up pages, redirect to dashboard
  if (
    userId &&
    (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

// Use Clerk's recommended matcher configuration exactly as in their documentation
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
