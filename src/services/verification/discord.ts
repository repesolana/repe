import type { DiscordVerificationData, VerificationResult } from "./types"
import { FALLBACK_REASON } from "./types"

async function discordFetch(endpoint: string): Promise<Response> {
  return fetch(`https://discord.com/api/v10${endpoint}`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    cache: "no-store",
  })
}

async function checkMembership(
  discordId: string,
  guildId: string
): Promise<VerificationResult> {
  const res = await discordFetch(`/guilds/${guildId}/members/${discordId}`)

  if (res.status === 429) {
    return { verified: false, reason: FALLBACK_REASON }
  }

  if (res.status === 404) {
    return { verified: false, reason: "You are not a member of the REPE Discord server. Please join and try again." }
  }

  if (res.status === 403) {
    return { verified: false, reason: FALLBACK_REASON }
  }

  if (!res.ok) {
    return { verified: false, reason: FALLBACK_REASON }
  }

  const data = await res.json()
  return { verified: true, reason: "Discord membership verified", rawResponse: { user: data.user?.id } }
}

export async function verifyDiscordAction(
  discordId: string | null,
  data: DiscordVerificationData
): Promise<VerificationResult> {
  if (!process.env.DISCORD_BOT_TOKEN) {
    return { verified: false, reason: FALLBACK_REASON }
  }

  if (!discordId) {
    return {
      verified: false,
      reason: "Please connect your Discord account in Profile settings to verify Discord tasks.",
    }
  }

  return checkMembership(discordId, data.guildId)
}
