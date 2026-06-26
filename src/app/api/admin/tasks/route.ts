import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const tasks = await prisma.task.findMany({
    orderBy: { priority: "desc" },
    include: { _count: { select: { completions: true } } },
  })

  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()

  const task = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
      instructions: body.instructions || null,
      type: body.type,
      category: body.category,
      platform: body.platform || null,
      rewardAmount: body.rewardAmount,
      maxCompletions: body.maxCompletions || null,
      verificationMethod: body.verificationMethod,
      verificationUrl: body.verificationUrl || null,
      verificationData: body.verificationData || null,
      status: body.status || "ACTIVE",
      priority: body.priority || 0,
    },
  })

  return NextResponse.json(task)
}
