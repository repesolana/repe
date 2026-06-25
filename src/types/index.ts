import type { UserRole } from "@/generated/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    walletAddress: string
    role: UserRole
    onboarded: boolean
  }

  interface JWT {
    userId?: string
    walletAddress?: string
    username?: string | null
    role?: UserRole
    onboarded?: boolean
  }
}

export interface UserStats {
  totalRepeEarned: number
  currentBalance: number
  totalPoints: number
  loginStreak: number
  longestStreak: number
  rank: number
  tasksCompleted: number
  totalReferrals: number
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string | null
  walletAddress: string
  totalPoints: number
  totalRepeEarned: number
}

export interface TaskWithCompletion {
  id: string
  title: string
  description: string
  type: string
  category: string
  platform: string | null
  rewardAmount: number
  verificationMethod: string
  status: string
  completionStatus?: string | null
  completedAt?: Date | null
}

export interface ReferralInfo {
  totalInvited: number
  activeReferrals: number
  totalEarned: number
  referralCode: string
  referredUsers: {
    id: string
    username: string | null
    walletAddress: string
    createdAt: Date
    totalRepeEarned: number
  }[]
}
