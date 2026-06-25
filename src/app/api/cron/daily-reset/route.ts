import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret")
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  // Reset streaks for users who didn't claim yesterday
  const brokenStreaks = await prisma.user.updateMany({
    where: {
      loginStreak: { gt: 0 },
      OR: [
        { lastDailyClaim: null },
        { lastDailyClaim: { lt: yesterday } },
      ],
    },
    data: { loginStreak: 0 },
  })

  return NextResponse.json({
    success: true,
    brokenStreaks: brokenStreaks.count,
    timestamp: now.toISOString(),
  })
}
