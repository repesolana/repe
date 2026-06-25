import { prisma } from "@/lib/prisma"
import { WELCOME_BONUS_AMOUNT, REFERRAL_BONUS_AMOUNT } from "@/lib/constants"
import type { OnboardingData } from "@/lib/validators"

export async function completeOnboarding(userId: string, data: OnboardingData) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      username: data.username,
      email: data.email,
      xHandle: data.xHandle,
      telegramHandle: data.telegramHandle,
      discordHandle: data.discordHandle || null,
      youtubeHandle: data.youtubeHandle || null,
      tiktokHandle: data.tiktokHandle || null,
      instagramHandle: data.instagramHandle || null,
      redditHandle: data.redditHandle || null,
      onboardedAt: new Date(),
      currentBalance: { increment: WELCOME_BONUS_AMOUNT },
      totalRepeEarned: { increment: WELCOME_BONUS_AMOUNT },
      totalPoints: { increment: WELCOME_BONUS_AMOUNT },
    },
  })

  await prisma.rewardHistory.create({
    data: {
      userId,
      amount: WELCOME_BONUS_AMOUNT,
      type: "ACHIEVEMENT",
      description: "Welcome bonus",
    },
  })

  // Handle referral
  if (data.referralCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: data.referralCode },
    })

    if (referrer && referrer.id !== userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { referredById: referrer.id },
      })

      await prisma.$transaction([
        prisma.user.update({
          where: { id: referrer.id },
          data: {
            currentBalance: { increment: REFERRAL_BONUS_AMOUNT },
            totalRepeEarned: { increment: REFERRAL_BONUS_AMOUNT },
            totalPoints: { increment: REFERRAL_BONUS_AMOUNT },
          },
        }),
        prisma.rewardHistory.create({
          data: {
            userId: referrer.id,
            amount: REFERRAL_BONUS_AMOUNT,
            type: "REFERRAL_BONUS",
            source: userId,
            description: `Referral: ${data.username} joined`,
          },
        }),
        prisma.notification.create({
          data: {
            userId: referrer.id,
            title: "New Referral!",
            message: `${data.username} joined using your referral link. +${REFERRAL_BONUS_AMOUNT} REPE`,
            type: "REFERRAL_JOINED",
          },
        }),
      ])
    }
  }

  return user
}

export async function getUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      totalRepeEarned: true,
      currentBalance: true,
      totalPoints: true,
      loginStreak: true,
      longestStreak: true,
      _count: {
        select: {
          taskCompletions: { where: { status: "APPROVED" } },
          referrals: true,
        },
      },
    },
  })

  if (!user) throw new Error("User not found")

  const rank = await prisma.user.count({
    where: {
      isBanned: false,
      totalPoints: { gt: user.totalPoints },
    },
  })

  return {
    totalRepeEarned: user.totalRepeEarned,
    currentBalance: user.currentBalance,
    totalPoints: user.totalPoints,
    loginStreak: user.loginStreak,
    longestStreak: user.longestStreak,
    rank: rank + 1,
    tasksCompleted: user._count.taskCompletions,
    totalReferrals: user._count.referrals,
  }
}
