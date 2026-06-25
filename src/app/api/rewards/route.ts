import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getActiveUserId } from "@/lib/demo-user"

export async function GET(request: NextRequest) {
  const userId = await getActiveUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")
  const limit = 20

  const rewards = await prisma.rewardHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  })

  const total = await prisma.rewardHistory.count({
    where: { userId },
  })

  return NextResponse.json({ rewards, total, page, totalPages: Math.ceil(total / limit) })
}
