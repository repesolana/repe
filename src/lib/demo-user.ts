import { auth } from "@/lib/auth"

export async function getActiveUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id || null
}
