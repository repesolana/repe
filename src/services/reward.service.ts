import { prisma } from "@/lib/prisma"
import { REFERRAL_BONUS_AMOUNT } from "@/lib/constants"

export async function distributeReferralBonus(referrerId: string, referredUserId: string) {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: referrerId },
      data: {
        currentBalance: { increment: REFERRAL_BONUS_AMOUNT },
        totalRepeEarned: { increment: REFERRAL_BONUS_AMOUNT },
        totalPoints: { increment: REFERRAL_BONUS_AMOUNT },
      },
    }),
    prisma.rewardHistory.create({
      data: {
        userId: referrerId,
        amount: REFERRAL_BONUS_AMOUNT,
        type: "REFERRAL_BONUS",
        source: referredUserId,
        description: "Referral bonus - friend joined",
      },
    }),
  ])
}

export async function approveTaskCompletion(completionId: string, reviewerId: string) {
  const completion = await prisma.taskCompletion.findUnique({
    where: { id: completionId },
    include: { task: true },
  })

  if (!completion || completion.status !== "PENDING") {
    throw new Error("Completion not found or already processed")
  }

  await prisma.$transaction([
    prisma.taskCompletion.update({
      where: { id: completionId },
      data: {
        status: "APPROVED",
        reviewedById: reviewerId,
        reviewedAt: new Date(),
        completedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: completion.userId },
      data: {
        currentBalance: { increment: completion.rewardAmount },
        totalRepeEarned: { increment: completion.rewardAmount },
        totalPoints: { increment: completion.rewardAmount },
      },
    }),
    prisma.task.update({
      where: { id: completion.taskId },
      data: { currentCompletions: { increment: 1 } },
    }),
    prisma.rewardHistory.create({
      data: {
        userId: completion.userId,
        amount: completion.rewardAmount,
        type: "TASK_COMPLETION",
        source: completion.taskId,
        description: completion.task.title,
      },
    }),
    prisma.notification.create({
      data: {
        userId: completion.userId,
        title: "Task Approved!",
        message: `Your submission for "${completion.task.title}" was approved. +${completion.rewardAmount} REPE`,
        type: "TASK_APPROVED",
      },
    }),
  ])
}

export async function rejectTaskCompletion(completionId: string, reviewerId: string, reason?: string) {
  const completion = await prisma.taskCompletion.findUnique({
    where: { id: completionId },
    include: { task: true },
  })

  if (!completion || completion.status !== "PENDING") {
    throw new Error("Completion not found or already processed")
  }

  await prisma.$transaction([
    prisma.taskCompletion.update({
      where: { id: completionId },
      data: {
        status: "REJECTED",
        reviewedById: reviewerId,
        reviewedAt: new Date(),
        reviewNote: reason,
      },
    }),
    prisma.notification.create({
      data: {
        userId: completion.userId,
        title: "Task Rejected",
        message: `Your submission for "${completion.task.title}" was rejected.${reason ? ` Reason: ${reason}` : ""}`,
        type: "TASK_REJECTED",
      },
    }),
  ])
}
