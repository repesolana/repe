import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const notifications = await prisma.notification.findMany({
    where: { type: { in: ["SYSTEM", "ADMIN"] } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { user: { select: { username: true } } },
  })

  return NextResponse.json(notifications)
}

export async function POST(request: NextRequest) {
  const adminId = await requireAdmin()
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { title, message, target, userId } = await request.json()

  if (!title || !message) {
    return NextResponse.json({ error: "Title and message required" }, { status: 400 })
  }

  if (target === "specific" && userId) {
    await prisma.notification.create({
      data: { userId, title, message, type: "ADMIN" },
    })
    return NextResponse.json({ success: true, sent: 1 })
  }

  // Broadcast to all users
  const users = await prisma.user.findMany({
    where: { isBanned: false },
    select: { id: true },
  })

  await prisma.notification.createMany({
    data: users.map((u) => ({
      userId: u.id,
      title,
      message,
      type: "ADMIN" as const,
    })),
  })

  return NextResponse.json({ success: true, sent: users.length })
}
