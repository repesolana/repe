export const SITE_NAME = "REPE"
export const SITE_DESCRIPTION = "Earn REPE tokens by completing tasks, inviting friends, and climbing the leaderboard."
export const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"

export const DAILY_BONUS_AMOUNT = 50
export const REFERRAL_BONUS_AMOUNT = 500
export const WELCOME_BONUS_AMOUNT = 100
export const STREAK_BONUS_MULTIPLIER = 10

export const LEADERBOARD_PAGE_SIZE = 50
export const LEADERBOARD_MAX_RANK = 999

export const SUPPORTED_WALLETS = ["Phantom", "Solflare", "Backpack", "Trust Wallet"] as const

export const SOCIAL_PLATFORMS = {
  twitter: { name: "X (Twitter)", required: true },
  telegram: { name: "Telegram", required: true },
  discord: { name: "Discord", required: false },
  youtube: { name: "YouTube", required: false },
  tiktok: { name: "TikTok", required: false },
  instagram: { name: "Instagram", required: false },
  reddit: { name: "Reddit", required: false },
} as const
