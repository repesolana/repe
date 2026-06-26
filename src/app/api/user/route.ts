import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getActiveUserId } from "@/lib/demo-user"

export async function GET() {
  const userId = await getActiveUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      walletAddress: true,
      username: true,
      email: true,
      avatarUrl: true,
      role: true,
      xHandle: true,
      telegramHandle: true,
      discordHandle: true,
      youtubeHandle: true,
      tiktokHandle: true,
      instagramHandle: true,
      redditHandle: true,
      totalRepeEarned: true,
      currentBalance: true,
      totalPoints: true,
      loginStreak: true,
      longestStreak: true,
      lastDailyClaim: true,
      referralCode: true,
      createdAt: true,
      onboardedAt: true,
      _count: {
        select: {
          taskCompletions: { where: { status: "APPROVED" } },
          referrals: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(request: NextRequest) {
  const userId = await getActiveUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const allowedFields = ["username", "email", "avatarUrl"]
  const updateData: Record<string, string> = {}

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field]
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  })

  return NextResponse.json(user)
}
