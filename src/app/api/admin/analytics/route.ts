import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const now = new Date()
  const day1 = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const day7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const day30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    users24h,
    users7d,
    users30d,
    totalTaskCompletions,
    completions24h,
    completions7d,
    totalRepe,
    repe24h,
    repe7d,
    totalReferrals,
    topTasks,
    topUsers,
    recentCompletions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: day1 } } }),
    prisma.user.count({ where: { createdAt: { gte: day7 } } }),
    prisma.user.count({ where: { createdAt: { gte: day30 } } }),
    prisma.taskCompletion.count({ where: { status: "APPROVED" } }),
    prisma.taskCompletion.count({ where: { status: "APPROVED", completedAt: { gte: day1 } } }),
    prisma.taskCompletion.count({ where: { status: "APPROVED", completedAt: { gte: day7 } } }),
    prisma.rewardHistory.aggregate({ _sum: { amount: true } }),
    prisma.rewardHistory.aggregate({ where: { createdAt: { gte: day1 } }, _sum: { amount: true } }),
    prisma.rewardHistory.aggregate({ where: { createdAt: { gte: day7 } }, _sum: { amount: true } }),
    prisma.user.count({ where: { referredById: { not: null } } }),
    prisma.task.findMany({
      where: { status: "ACTIVE" },
      orderBy: { currentCompletions: "desc" },
      take: 10,
      select: { title: true, currentCompletions: true, rewardAmount: true },
    }),
    prisma.user.findMany({
      orderBy: { totalRepeEarned: "desc" },
      take: 5,
      select: { username: true, walletAddress: true, totalRepeEarned: true },
    }),
    prisma.taskCompletion.findMany({
      where: { status: "APPROVED" },
      orderBy: { completedAt: "desc" },
      take: 10,
      include: {
        user: { select: { username: true, walletAddress: true } },
        task: { select: { title: true, rewardAmount: true } },
      },
    }),
  ])

  return NextResponse.json({
    overview: {
      totalUsers,
      users24h,
      users7d,
      users30d,
      totalTaskCompletions,
      completions24h,
      completions7d,
      totalRepeDistributed: totalRepe._sum.amount || 0,
      repe24h: repe24h._sum.amount || 0,
      repe7d: repe7d._sum.amount || 0,
      totalReferrals,
    },
    topTasks,
    topUsers,
    recentCompletions,
  })
}
