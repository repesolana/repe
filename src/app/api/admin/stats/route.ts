import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const [totalUsers, newUsers24h, activeTasks, totalRepeDistributed, pendingApprovals, completions24h] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: yesterday } } }),
    prisma.task.count({ where: { status: "ACTIVE" } }),
    prisma.rewardHistory.aggregate({ _sum: { amount: true } }),
    prisma.taskCompletion.count({ where: { status: "PENDING" } }),
    prisma.taskCompletion.count({ where: { createdAt: { gte: yesterday }, status: "APPROVED" } }),
  ])

  return NextResponse.json({
    totalUsers,
    newUsers24h,
    activeTasks,
    totalRepeDistributed: totalRepeDistributed._sum.amount || 0,
    pendingApprovals,
    completions24h,
  })
}
