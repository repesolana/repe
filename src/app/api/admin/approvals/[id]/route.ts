import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await requireAdmin()
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const { action, reason } = await request.json()

  const completion = await prisma.taskCompletion.findUnique({
    where: { id },
    include: { task: true },
  })

  if (!completion || completion.status !== "PENDING") {
    return NextResponse.json({ error: "Not found or already processed" }, { status: 404 })
  }

  if (action === "approve") {
    await prisma.$transaction([
      prisma.taskCompletion.update({
        where: { id },
        data: { status: "APPROVED", reviewedById: adminId, reviewedAt: new Date(), completedAt: new Date() },
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
    ])
    return NextResponse.json({ success: true, status: "APPROVED" })
  }

  if (action === "reject") {
    await prisma.taskCompletion.update({
      where: { id },
      data: { status: "REJECTED", reviewedById: adminId, reviewedAt: new Date(), reviewNote: reason || null },
    })
    return NextResponse.json({ success: true, status: "REJECTED" })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
