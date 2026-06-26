import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { wallet, secret } = await request.json()

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { walletAddress: wallet } })
  if (!user) {
    return NextResponse.json({ error: "User not found. Login first." }, { status: 404 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  })

  return NextResponse.json({ success: true, username: user.username, role: "ADMIN" })
}
