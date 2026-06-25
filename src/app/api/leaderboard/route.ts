import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { LEADERBOARD_PAGE_SIZE, LEADERBOARD_MAX_RANK } from "@/lib/constants"
import { getCache, getCached } from "@/lib/redis"
import { getActiveUserId } from "@/lib/demo-user"

interface RankedEntry {
  rank: number
  userId: string
  username: string | null
  walletAddress: string
  totalPoints: number
  totalRepeEarned: number
}

export async function GET(request: NextRequest) {
  const userId = await getActiveUserId()
  const period = request.nextUrl.searchParams.get("period") || "all-time"
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")
  const search = request.nextUrl.searchParams.get("search") || ""

  // Try cron-generated cache first (set every 6h)
  if (!search) {
    const cached = await getCache<{ entries: RankedEntry[]; page: number; totalPages: number }>(`leaderboard:page:${page}`)
    if (cached) {
      let userRank: number | null = null
      if (userId) {
        const rankMap = await getCache<Record<string, number>>("leaderboard:ranks")
        userRank = rankMap?.[userId] ?? null
      }
      return NextResponse.json({ ...cached, userRank })
    }
  }

  // Cache miss — query DB and cache for 5 minutes
  const cacheKey = `leaderboard:live:${period}:${page}:${search}`

  const data = await getCached(
    cacheKey,
    async () => {
      const skip = (page - 1) * LEADERBOARD_PAGE_SIZE
      const take = Math.min(LEADERBOARD_PAGE_SIZE, LEADERBOARD_MAX_RANK - skip)

      if (take <= 0) {
        return { entries: [], page, totalPages: 0, userRank: null as number | null }
      }

      // If we have the full ranked list cached, filter it for search
      if (search) {
        const allRanked = await getCache<RankedEntry[]>("leaderboard:ranked")
        if (allRanked) {
          const searchLower = search.toLowerCase()
          const filtered = allRanked.filter(
            (e) =>
              e.username?.toLowerCase().includes(searchLower) ||
              e.walletAddress.toLowerCase().includes(searchLower)
          )
          const paged = filtered.slice(skip, skip + take)
          const totalPages = Math.ceil(filtered.length / LEADERBOARD_PAGE_SIZE)

          let userRank: number | null = null
          if (userId) {
            const rankMap = await getCache<Record<string, number>>("leaderboard:ranks")
            userRank = rankMap?.[userId] ?? null
          }

          return { entries: paged, page, totalPages, userRank }
        }
      }

      // Fallback: live DB query (before first cron run)
      const where = search
        ? {
            OR: [
              { username: { contains: search } },
              { walletAddress: { contains: search } },
            ],
            isBanned: false,
          }
        : { isBanned: false }

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          walletAddress: true,
          totalPoints: true,
          totalRepeEarned: true,
        },
        orderBy: { totalPoints: "desc" },
        skip,
        take,
      })

      const entries = users.map((user, i) => ({
        rank: skip + i + 1,
        userId: user.id,
        username: user.username,
        walletAddress: user.walletAddress,
        totalPoints: user.totalPoints,
        totalRepeEarned: user.totalRepeEarned,
      }))

      const totalUsers = await prisma.user.count({ where: { isBanned: false } })
      const totalPages = Math.ceil(Math.min(totalUsers, LEADERBOARD_MAX_RANK) / LEADERBOARD_PAGE_SIZE)

      let userRank: number | null = null
      if (userId) {
        const currentUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { totalPoints: true },
        })
        if (currentUser) {
          const above = await prisma.user.count({
            where: { isBanned: false, totalPoints: { gt: currentUser.totalPoints } },
          })
          userRank = above + 1
        }
      }

      return { entries, page, totalPages, userRank }
    },
    300
  )

  return NextResponse.json(data)
}
