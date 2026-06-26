import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { DAILY_BONUS_AMOUNT, STREAK_BONUS_MULTIPLIER } from "@/lib/constants"

export async function POST() {
  const session = await auth()
  const targetUserId = session?.user?.id

  if (!targetUserId) {
    return NextResponse.json({ error: "Please connect your wallet first" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { lastDailyClaim: true, loginStreak: true, longestStreak: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (user.lastDailyClaim) {
    const lastClaim = new Date(user.lastDailyClaim)
    const lastClaimDay = new Date(lastClaim.getFullYear(), lastClaim.getMonth(), lastClaim.getDate())
    if (lastClaimDay.getTime() === today.getTime()) {
      return NextResponse.json({ error: "Already claimed today" }, { status: 429 })
    }
  }

  // Calculate streak
  let newStreak = 1
  if (user.lastDailyClaim) {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastClaimDay = new Date(user.lastDailyClaim)
    const lastClaimDayStart = new Date(lastClaimDay.getFullYear(), lastClaimDay.getMonth(), lastClaimDay.getDate())
    if (lastClaimDayStart.getTime() === yesterday.getTime()) {
      newStreak = user.loginStreak + 1
    }
  }

  const streakBonus = Math.floor(newStreak / 7) * STREAK_BONUS_MULTIPLIER
  const totalReward = DAILY_BONUS_AMOUNT + streakBonus

  await prisma.$transaction([
    prisma.user.update({
      where: { id: targetUserId },
      data: {
        lastDailyClaim: now,
        lastLoginDate: now,
        loginStreak: newStreak,
        longestStreak: Math.max(newStreak, user.longestStreak),
        currentBalance: { increment: totalReward },
        totalRepeEarned: { increment: totalReward },
        totalPoints: { increment: totalReward },
      },
    }),
    prisma.rewardHistory.create({
      data: {
        userId: targetUserId,
        amount: totalReward,
        type: "DAILY_BONUS",
        description: `Day ${newStreak} streak bonus`,
      },
    }),
  ])

  return NextResponse.json({
    reward: totalReward,
    streak: newStreak,
    streakBonus,
  })
}
