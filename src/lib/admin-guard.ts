import { auth } from "@/lib/auth"

export async function requireAdmin(): Promise<string | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  if ((session as any)?.role !== "ADMIN") return null
  return session.user.id
}
