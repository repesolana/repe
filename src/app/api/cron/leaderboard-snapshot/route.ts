import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { setCache } from "@/lib/redis"
import { LEADERBOARD_MAX_RANK } from "@/lib/constants"

const CACHE_TTL = 600 // 10 minutes

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret")
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const startTime = Date.now()

  // Fetch top users sorted by points
  const users = await prisma.user.findMany({
    where: { isBanned: false },
    select: {
      id: true,
      username: true,
      walletAddress: true,
      totalPoints: true,
      totalRepeEarned: true,
    },
    orderBy: { totalPoints: "desc" },
    take: LEADERBOARD_MAX_RANK,
  })

  const rankedEntries = users.map((user, i) => ({
    rank: i + 1,
    userId: user.id,
    username: user.username,
    walletAddress: user.walletAddress,
    totalPoints: user.totalPoints,
    totalRepeEarned: user.totalRepeEarned,
  }))

  // Build a userId → rank lookup
  const rankMap: Record<string, number> = {}
  for (const entry of rankedEntries) {
    rankMap[entry.userId] = entry.rank
  }

  // Cache the full ranked list
  await setCache("leaderboard:ranked", rankedEntries, CACHE_TTL)

  // Cache the rank lookup map
  await setCache("leaderboard:ranks", rankMap, CACHE_TTL)

  // Cache paginated views (50 per page)
  const pageSize = 50
  const totalPages = Math.ceil(rankedEntries.length / pageSize)

  for (let page = 1; page <= totalPages; page++) {
    const start = (page - 1) * pageSize
    const pageEntries = rankedEntries.slice(start, start + pageSize)
    await setCache(`leaderboard:page:${page}`, {
      entries: pageEntries,
      page,
      totalPages,
    }, CACHE_TTL)
  }

  // Also store in DB as a snapshot
  await prisma.leaderboardSnapshot.create({
    data: {
      period: "ALL_TIME",
      startDate: new Date(),
      endDate: new Date(),
      data: JSON.parse(JSON.stringify(rankedEntries.slice(0, 100))),
    },
  })

  const duration = Date.now() - startTime

  return NextResponse.json({
    success: true,
    totalUsers: rankedEntries.length,
    totalPages,
    durationMs: duration,
    cachedFor: `${CACHE_TTL}s`,
  })
}
