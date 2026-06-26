import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getActiveUserId } from "@/lib/demo-user"

export async function GET() {
  const userId = await getActiveUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  const unread = notifications.filter((n) => !n.read).length

  return NextResponse.json({ notifications, unread })
}

export async function PATCH(request: NextRequest) {
  const userId = await getActiveUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })

  return NextResponse.json({ success: true })
}
