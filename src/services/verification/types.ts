import { z } from "zod"

export interface VerificationResult {
  verified: boolean
  reason: string
  rawResponse?: unknown
}

export const FALLBACK_REASON = "FALLBACK_TO_MANUAL"

// Twitter
export const twitterVerificationSchema = z.object({
  action: z.enum(["FOLLOW_CHECK", "RETWEET_CHECK", "LIKE_CHECK", "TWEET_CHECK"]),
  targetAccount: z.string().optional(),
  tweetId: z.string().optional(),
  requiredText: z.string().optional(),
})
export type TwitterVerificationData = z.infer<typeof twitterVerificationSchema>

// Telegram
export const telegramVerificationSchema = z.object({
  action: z.literal("MEMBERSHIP_CHECK"),
  chatId: z.string(),
})
export type TelegramVerificationData = z.infer<typeof telegramVerificationSchema>

// Discord
export const discordVerificationSchema = z.object({
  action: z.literal("MEMBERSHIP_CHECK"),
  guildId: z.string(),
})
export type DiscordVerificationData = z.infer<typeof discordVerificationSchema>
