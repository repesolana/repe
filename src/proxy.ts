import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware disabled for local development without database
// Enable this when PostgreSQL is running by uncommenting the auth-based middleware below
export function proxy(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
}

/*
// Production middleware with auth protection:
import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/onboarding")
  const isAdminPage = pathname.startsWith("/admin")
  const isApiRoute = pathname.startsWith("/api")
  const isPublicApi = pathname.startsWith("/api/auth")

  if (isPublicApi) return NextResponse.next()
  if (isAuthPage && req.auth) return NextResponse.redirect(new URL("/", req.url))
  if (!isAuthPage && !isApiRoute && !req.auth) return NextResponse.redirect(new URL("/login", req.url))
  if (isAdminPage && (req.auth as any)?.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url))

  return NextResponse.next()
})
*/
