import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet")

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  const nonce = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  await prisma.verificationNonce.create({
    data: {
      nonce,
      wallet,
      expiresAt,
    },
  })

  const message = `Sign this message to login to REPE:\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`

  return NextResponse.json({ message, nonce })
}
