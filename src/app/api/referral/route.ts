import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getActiveUserId } from "@/lib/demo-user"

export async function GET() {
  const userId = await getActiveUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      referralCode: true,
      referrals: {
        select: {
          id: true,
          username: true,
          walletAddress: true,
          createdAt: true,
          totalRepeEarned: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const referralRewards = await prisma.rewardHistory.aggregate({
    where: {
      userId,
      type: { in: ["REFERRAL_BONUS", "REFERRAL_MILESTONE"] },
    },
    _sum: { amount: true },
  })

  const activeReferrals = user.referrals.filter((r) => r.totalRepeEarned > 0).length

  return NextResponse.json({
    referralCode: user.referralCode,
    totalInvited: user.referrals.length,
    activeReferrals,
    totalEarned: referralRewards._sum.amount || 0,
    referredUsers: user.referrals,
  })
}
