import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const pending = await prisma.taskCompletion.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      task: { select: { title: true, rewardAmount: true } },
      user: { select: { username: true, walletAddress: true } },
    },
  })

  return NextResponse.json(pending)
}
