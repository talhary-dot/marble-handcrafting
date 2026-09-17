import { NextRequest, NextResponse } from "next/server"
import { verifyAdminSession, ADMIN_COOKIE_NAME } from "@/lib/auth"

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value
  const session = token ? await verifyAdminSession(token) : null
  const isAuthenticated = !!session

  // 1. If hitting /admin/login
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      // Already authenticated, redirect to admin dashboard
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return NextResponse.next()
  }

  // 2. Allow auth API routes without check
  if (pathname === "/api/admin/login") {
    return NextResponse.next()
  }

  // 3. Guard /admin/:path* routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("from", pathname + search)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // 4. Guard mutating API routes (POST, PUT, PATCH, DELETE)
  const mutatingMethods = ["POST", "PUT", "PATCH", "DELETE"]
  if (mutatingMethods.includes(req.method)) {
    const isProtectedApi =
      pathname.startsWith("/api/products") ||
      pathname.startsWith("/api/upload") ||
      pathname.startsWith("/api/seed") ||
      pathname.startsWith("/api/admin")

    if (isProtectedApi && !isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized: Valid Sang Tarash admin session required." },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products/:path*",
    "/api/upload/:path*",
    "/api/seed/:path*",
    "/api/admin/:path*"
  ]
}
