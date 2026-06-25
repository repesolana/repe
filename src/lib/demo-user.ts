import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getActiveUserId(): Promise<string | null> {
  const session = await auth()
  if (session?.user?.id) return session.user.id

  const demoUser = await prisma.user.findFirst({ orderBy: { totalPoints: "desc" } })
  return demoUser?.id || null
}
