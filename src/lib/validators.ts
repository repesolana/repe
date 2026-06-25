import { z } from "zod"

export const walletAddressSchema = z
  .string()
  .min(32)
  .max(44)
  .regex(/^[1-9A-HJ-NP-Za-km-z]+$/, "Invalid Solana address")

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")

export const onboardingSchema = z.object({
  username: usernameSchema,
  email: z.string().email("Invalid email address"),
  xHandle: z.string().min(1, "X handle is required"),
  telegramHandle: z.string().min(1, "Telegram handle is required"),
  discordHandle: z.string().optional(),
  youtubeHandle: z.string().optional(),
  tiktokHandle: z.string().optional(),
  instagramHandle: z.string().optional(),
  redditHandle: z.string().optional(),
  referralCode: z.string().optional(),
})

export const taskCompletionSchema = z.object({
  taskId: z.string().cuid(),
  proofUrl: z.string().url().optional(),
  proofData: z.record(z.unknown()).optional(),
})

export const adminTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  instructions: z.string().optional(),
  type: z.enum(["SOCIAL", "CONTENT", "COMMUNITY", "ONCHAIN", "QUIZ", "REFERRAL", "DAILY", "CUSTOM"]),
  category: z.enum(["TWITTER", "TELEGRAM", "DISCORD", "YOUTUBE", "TIKTOK", "INSTAGRAM", "REDDIT", "ONCHAIN", "COMMUNITY", "OTHER"]),
  platform: z.enum(["TWITTER", "TELEGRAM", "DISCORD", "YOUTUBE", "TIKTOK", "INSTAGRAM", "REDDIT"]).optional(),
  rewardAmount: z.number().int().positive(),
  maxCompletions: z.number().int().positive().optional(),
  verificationMethod: z.enum(["AUTOMATIC", "MANUAL", "PROOF_UPLOAD", "LINK_SUBMIT", "ONCHAIN", "SELF_REPORT"]),
  verificationUrl: z.string().url().optional(),
  campaignId: z.string().cuid().optional(),
})

export type OnboardingData = z.infer<typeof onboardingSchema>
export type TaskCompletionData = z.infer<typeof taskCompletionSchema>
export type AdminTaskData = z.infer<typeof adminTaskSchema>
