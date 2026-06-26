import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const search = request.nextUrl.searchParams.get("search") || ""

  const where = search
    ? {
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
          { walletAddress: { contains: search } },
        ],
      }
    : {}

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      username: true,
      walletAddress: true,
      email: true,
      role: true,
      currentBalance: true,
      totalRepeEarned: true,
      isBanned: true,
      createdAt: true,
      _count: { select: { taskCompletions: true, referrals: true } },
    },
  })

  return NextResponse.json(users)
}
