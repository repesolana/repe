import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isLoginPage = pathname.startsWith("/login")
  const isOnboardingPage = pathname.startsWith("/onboarding")
  const isApiRoute = pathname.startsWith("/api")
  const isPublicApi = pathname.startsWith("/api/auth") || pathname.startsWith("/api/cron")
  const isAdminPage = pathname.startsWith("/admin")

  if (isPublicApi) return NextResponse.next()

  const session = await auth()
  const isLoggedIn = !!session?.user
  const role = (session as any)?.role
  const onboarded = (session as any)?.onboarded

  // Logged in user going to login → redirect to home
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL(onboarded ? "/" : "/onboarding", req.url))
  }

  // Not logged in → redirect to login (except auth pages)
  if (!isLoginPage && !isOnboardingPage && !isApiRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Logged in but not onboarded → redirect to onboarding (except onboarding itself and API)
  if (isLoggedIn && !onboarded && !isOnboardingPage && !isApiRoute && !isLoginPage) {
    return NextResponse.redirect(new URL("/onboarding", req.url))
  }

  // Admin check
  if (isAdminPage && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
}
