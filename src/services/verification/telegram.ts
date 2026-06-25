import type { TelegramVerificationData, VerificationResult } from "./types"
import { FALLBACK_REASON } from "./types"

async function telegramFetch(method: string, params: Record<string, string>): Promise<Response> {
  const qs = new URLSearchParams(params)
  return fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}?${qs}`,
    { cache: "no-store" }
  )
}

const ACTIVE_STATUSES = ["creator", "administrator", "member", "restricted"]

async function checkMembership(
  telegramId: string,
  chatId: string
): Promise<VerificationResult> {
  const res = await telegramFetch("getChatMember", {
    chat_id: chatId,
    user_id: telegramId,
  })

  if (res.status === 429) {
    return { verified: false, reason: FALLBACK_REASON }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (err.description?.includes("user not found")) {
      return { verified: false, reason: "You are not a member of this group/channel. Please join and try again." }
    }
    return { verified: false, reason: FALLBACK_REASON }
  }

  const data = await res.json()
  const status = data.result?.status

  if (ACTIVE_STATUSES.includes(status)) {
    return { verified: true, reason: "Telegram membership verified", rawResponse: data.result }
  }

  return { verified: false, reason: "You are not a member of this group/channel. Please join and try again." }
}

export async function verifyTelegramAction(
  telegramId: string | null,
  data: TelegramVerificationData
): Promise<VerificationResult> {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return { verified: false, reason: FALLBACK_REASON }
  }

  if (!telegramId) {
    return {
      verified: false,
      reason: "Please link your Telegram account first. Send /start to @REPEBot on Telegram.",
    }
  }

  return checkMembership(telegramId, data.chatId)
}
