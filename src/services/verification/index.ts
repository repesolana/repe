import { prisma } from "@/lib/prisma"
import {
  FALLBACK_REASON,
  twitterVerificationSchema,
  telegramVerificationSchema,
  discordVerificationSchema,
} from "./types"
import { verifyTwitterAction } from "./twitter"
import { verifyTelegramAction } from "./telegram"
import { verifyDiscordAction } from "./discord"

interface VerifyTaskResult {
  status: "APPROVED" | "PENDING" | "FAILED"
  reason: string
  proofData?: string
}

export async function verifyTask(
  task: { id: string; category: string; platform: string | null; verificationData: unknown },
  userId: string
): Promise<VerifyTaskResult> {
  try {
    const socialCategories = ["TWITTER", "TELEGRAM", "DISCORD"]
    if (!socialCategories.includes(task.category)) {
      return { status: "APPROVED", reason: "Auto-approved" }
    }

    if (!task.verificationData) {
      return { status: "PENDING", reason: "No verification configuration" }
    }

    let parsed: unknown
    if (typeof task.verificationData === "string") {
      try { parsed = JSON.parse(task.verificationData) } catch {
        return { status: "PENDING", reason: "Invalid verification configuration" }
      }
    } else {
      parsed = task.verificationData
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xHandle: true, telegramId: true, discordId: true },
    })
    if (!user) return { status: "FAILED", reason: "User not found" }

    // Route to platform verifier
    if (task.category === "TWITTER") {
      const data = twitterVerificationSchema.safeParse(parsed)
      if (!data.success) return { status: "PENDING", reason: "Invalid Twitter verification config" }

      if (!user.xHandle) {
        return { status: "FAILED", reason: "Please connect your X (Twitter) account in Profile first." }
      }

      const result = await verifyTwitterAction(user.xHandle, data.data)
      if (result.reason === FALLBACK_REASON) {
        return { status: "PENDING", reason: "Verification pending review" }
      }
      return {
        status: result.verified ? "APPROVED" : "FAILED",
        reason: result.reason,
        proofData: result.rawResponse ? JSON.stringify(result.rawResponse) : undefined,
      }
    }

    if (task.category === "TELEGRAM") {
      const data = telegramVerificationSchema.safeParse(parsed)
      if (!data.success) return { status: "PENDING", reason: "Invalid Telegram verification config" }

      const result = await verifyTelegramAction(user.telegramId, data.data)
      if (result.reason === FALLBACK_REASON) {
        return { status: "PENDING", reason: "Verification pending review" }
      }
      return {
        status: result.verified ? "APPROVED" : "FAILED",
        reason: result.reason,
        proofData: result.rawResponse ? JSON.stringify(result.rawResponse) : undefined,
      }
    }

    if (task.category === "DISCORD") {
      const data = discordVerificationSchema.safeParse(parsed)
      if (!data.success) return { status: "PENDING", reason: "Invalid Discord verification config" }

      const result = await verifyDiscordAction(user.discordId, data.data)
      if (result.reason === FALLBACK_REASON) {
        return { status: "PENDING", reason: "Verification pending review" }
      }
      return {
        status: result.verified ? "APPROVED" : "FAILED",
        reason: result.reason,
        proofData: result.rawResponse ? JSON.stringify(result.rawResponse) : undefined,
      }
    }

    return { status: "PENDING", reason: "No verifier for this platform" }
  } catch {
    return { status: "PENDING", reason: "Verification error — pending manual review" }
  }
}
