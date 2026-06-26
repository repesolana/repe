import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/onboarding")
  const isApiRoute = pathname.startsWith("/api")
  const isPublicApi = pathname.startsWith("/api/auth") || pathname.startsWith("/api/cron")
  const isAdminPage = pathname.startsWith("/admin")

  if (isPublicApi) return NextResponse.next()

  const session = await auth()

  if (isAuthPage && session?.user) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (!isAuthPage && !isApiRoute && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAdminPage && (session as any)?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
}
