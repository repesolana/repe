import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { verifyTask } from "@/services/verification"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: "Please connect your wallet first" }, { status: 401 })
  }

  const { id: taskId } = await params
  const body = await request.json().catch(() => ({}))

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.status !== "ACTIVE") {
    return NextResponse.json({ error: "Task not found or inactive" }, { status: 404 })
  }

  const existing = await prisma.taskCompletion.findUnique({
    where: { taskId_userId: { taskId, userId } },
  })
  if (existing) {
    return NextResponse.json({ error: "Task already submitted" }, { status: 409 })
  }

  if (task.maxCompletions && task.currentCompletions >= task.maxCompletions) {
    return NextResponse.json({ error: "Task max completions reached" }, { status: 410 })
  }

  // Determine verification status
  let completionStatus: "APPROVED" | "PENDING" = "PENDING"
  let verificationProofData: string | undefined

  if (task.verificationMethod === "SELF_REPORT") {
    completionStatus = "APPROVED"
  } else if (task.verificationMethod === "AUTOMATIC") {
    const result = await verifyTask(task, userId)

    if (result.status === "FAILED") {
      // Don't create a record — let user retry after completing the action
      return NextResponse.json({ error: result.reason }, { status: 422 })
    }

    completionStatus = result.status
    verificationProofData = result.proofData
  }
  // MANUAL, PROOF_UPLOAD, LINK_SUBMIT, ONCHAIN → stay PENDING

  const completion = await prisma.taskCompletion.create({
    data: {
      taskId,
      userId,
      status: completionStatus as any,
      rewardAmount: task.rewardAmount,
      proofUrl: body.proofUrl || null,
      proofData: verificationProofData || body.proofData || null,
      completedAt: completionStatus === "APPROVED" ? new Date() : null,
    },
  })

  if (completionStatus === "APPROVED") {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          currentBalance: { increment: task.rewardAmount },
          totalRepeEarned: { increment: task.rewardAmount },
          totalPoints: { increment: task.rewardAmount },
        },
      }),
      prisma.task.update({
        where: { id: taskId },
        data: { currentCompletions: { increment: 1 } },
      }),
      prisma.rewardHistory.create({
        data: {
          userId,
          amount: task.rewardAmount,
          type: "TASK_COMPLETION",
          source: taskId,
          description: task.title,
        },
      }),
    ])
  }

  return NextResponse.json({
    completion,
    autoApproved: completionStatus === "APPROVED",
    status: completionStatus,
  })
}
