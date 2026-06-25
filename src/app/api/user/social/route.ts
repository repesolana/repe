import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getActiveUserId } from "@/lib/demo-user"

const SOCIAL_FIELDS: Record<string, string> = {
  twitter: "xHandle",
  telegram: "telegramHandle",
  discord: "discordHandle",
  youtube: "youtubeHandle",
  tiktok: "tiktokHandle",
  instagram: "instagramHandle",
  reddit: "redditHandle",
}

export async function POST(request: NextRequest) {
  const userId = await getActiveUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { platform, handle } = await request.json()

  const field = SOCIAL_FIELDS[platform]
  if (!field) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
  }

  if (!handle || typeof handle !== "string") {
    return NextResponse.json({ error: "Handle is required" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: userId },
    data: { [field]: handle },
  })

  return NextResponse.json({ success: true, platform, handle })
}

export async function DELETE(request: NextRequest) {
  const userId = await getActiveUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const platform = request.nextUrl.searchParams.get("platform")
  const field = platform ? SOCIAL_FIELDS[platform] : null

  if (!field) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: userId },
    data: { [field]: null },
  })

  return NextResponse.json({ success: true })
}
