import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { WELCOME_BONUS_AMOUNT, REFERRAL_BONUS_AMOUNT } from "@/lib/constants"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { username, email, xHandle, telegramHandle, discordHandle, youtubeHandle, tiktokHandle, instagramHandle, redditHandle, referralCode } = body

  if (!username || !email || !xHandle || !telegramHandle) {
    return NextResponse.json({ error: "Username, email, X handle, and Telegram are required" }, { status: 400 })
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } })
  if (existingUsername && existingUsername.id !== session.user.id) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 })
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } })
  if (existingEmail && existingEmail.id !== session.user.id) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      username,
      email,
      xHandle,
      telegramHandle,
      discordHandle: discordHandle || null,
      youtubeHandle: youtubeHandle || null,
      tiktokHandle: tiktokHandle || null,
      instagramHandle: instagramHandle || null,
      redditHandle: redditHandle || null,
      onboardedAt: new Date(),
      currentBalance: { increment: WELCOME_BONUS_AMOUNT },
      totalRepeEarned: { increment: WELCOME_BONUS_AMOUNT },
      totalPoints: { increment: WELCOME_BONUS_AMOUNT },
    },
  })

  await prisma.rewardHistory.create({
    data: {
      userId: session.user.id,
      amount: WELCOME_BONUS_AMOUNT,
      type: "ACHIEVEMENT",
      description: "Welcome bonus",
    },
  })

  if (referralCode) {
    const referrer = await prisma.user.findUnique({ where: { referralCode } })
    if (referrer && referrer.id !== session.user.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { referredById: referrer.id },
      })
      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          currentBalance: { increment: REFERRAL_BONUS_AMOUNT },
          totalRepeEarned: { increment: REFERRAL_BONUS_AMOUNT },
          totalPoints: { increment: REFERRAL_BONUS_AMOUNT },
        },
      })
      await prisma.rewardHistory.create({
        data: {
          userId: referrer.id,
          amount: REFERRAL_BONUS_AMOUNT,
          type: "REFERRAL_BONUS",
          source: session.user.id,
          description: `Referral: ${username} joined`,
        },
      })
    }
  }

  return NextResponse.json({ success: true, user })
}
