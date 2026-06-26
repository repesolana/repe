import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  const category = request.nextUrl.searchParams.get("category")
  const status = request.nextUrl.searchParams.get("status") || "ACTIVE"

  const tasks = await prisma.task.findMany({
    where: {
      status: status as any,
      ...(category && category !== "all" ? { category: category as any } : {}),
    },
    ...(userId ? {
      include: {
        completions: {
          where: { userId },
          select: { status: true, completedAt: true },
        },
      },
    } : {}),
    orderBy: { priority: "desc" },
  })

  const formatted = tasks.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    type: task.type,
    category: task.category,
    platform: task.platform,
    rewardAmount: task.rewardAmount,
    verificationMethod: task.verificationMethod,
    verificationUrl: task.verificationUrl,
    status: task.status,
    completionStatus: task.completions?.[0]?.status || null,
    completedAt: task.completions?.[0]?.completedAt || null,
  }))

  return NextResponse.json(formatted)
}
