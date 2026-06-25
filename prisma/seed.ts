import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Create tasks
  const tasks = [
    { title: "Follow @REPE on X", description: "Follow our official X account for updates and announcements", type: "SOCIAL" as const, category: "TWITTER" as const, platform: "TWITTER" as const, rewardAmount: 100, verificationMethod: "AUTOMATIC" as const, verificationData: JSON.stringify({ action: "FOLLOW_CHECK", targetAccount: "REPE" }), status: "ACTIVE" as const, priority: 10 },
    { title: "Join REPE Telegram", description: "Join our Telegram community group for real-time updates", type: "COMMUNITY" as const, category: "TELEGRAM" as const, platform: "TELEGRAM" as const, rewardAmount: 150, verificationMethod: "AUTOMATIC" as const, verificationData: JSON.stringify({ action: "MEMBERSHIP_CHECK", chatId: "-1001234567890" }), status: "ACTIVE" as const, priority: 9 },
    { title: "Join REPE Discord", description: "Join our Discord server and verify your account", type: "COMMUNITY" as const, category: "DISCORD" as const, platform: "DISCORD" as const, rewardAmount: 150, verificationMethod: "AUTOMATIC" as const, verificationData: JSON.stringify({ action: "MEMBERSHIP_CHECK", guildId: "1234567890" }), status: "ACTIVE" as const, priority: 8 },
    { title: "Retweet Campaign Post", description: "Retweet our latest campaign announcement on X", type: "SOCIAL" as const, category: "TWITTER" as const, platform: "TWITTER" as const, rewardAmount: 250, verificationMethod: "AUTOMATIC" as const, verificationData: JSON.stringify({ action: "RETWEET_CHECK", tweetId: "1234567890" }), status: "ACTIVE" as const, priority: 7 },
    { title: "Like Campaign Post", description: "Like our pinned post on X", type: "SOCIAL" as const, category: "TWITTER" as const, platform: "TWITTER" as const, rewardAmount: 50, verificationMethod: "AUTOMATIC" as const, verificationData: JSON.stringify({ action: "LIKE_CHECK", tweetId: "1234567890" }), status: "ACTIVE" as const, priority: 6 },
    { title: "Invite a Friend", description: "Share your referral link and invite friends to REPE", type: "REFERRAL" as const, category: "COMMUNITY" as const, rewardAmount: 500, verificationMethod: "AUTOMATIC" as const, status: "ACTIVE" as const, priority: 5 },
    { title: "Complete Your Profile", description: "Fill in all your profile information and connect social accounts", type: "CUSTOM" as const, category: "COMMUNITY" as const, rewardAmount: 100, verificationMethod: "AUTOMATIC" as const, status: "ACTIVE" as const, priority: 4 },
    { title: "Connect All Social Accounts", description: "Link all available social media platforms to your REPE account", type: "CUSTOM" as const, category: "OTHER" as const, rewardAmount: 300, verificationMethod: "AUTOMATIC" as const, status: "ACTIVE" as const, priority: 3 },
    { title: "Write a Thread about REPE", description: "Create an X thread about REPE with at least 3 tweets", type: "CONTENT" as const, category: "TWITTER" as const, platform: "TWITTER" as const, rewardAmount: 1000, verificationMethod: "MANUAL" as const, status: "ACTIVE" as const, priority: 2 },
    { title: "Subscribe to YouTube", description: "Subscribe to the REPE YouTube channel", type: "SOCIAL" as const, category: "YOUTUBE" as const, platform: "YOUTUBE" as const, rewardAmount: 100, verificationMethod: "SELF_REPORT" as const, status: "ACTIVE" as const, priority: 1 },
  ]

  for (const task of tasks) {
    await prisma.task.create({ data: task })
  }
  console.log(`Created ${tasks.length} tasks`)

  // Create demo users for leaderboard
  const demoUsers = [
    { walletAddress: "7xKPbR4D9mQfVnSy2WuTjEaL8NrHcG5YpZqXwJ6AkBvt", username: "CryptoKing", totalRepeEarned: 485000, currentBalance: 320000, totalPoints: 485000, loginStreak: 45 },
    { walletAddress: "3vRtYmPl8nQz5wKxHjUb7sNfCdGa2XeW6pLrMiJvOkTq", username: "SolanaQueen", totalRepeEarned: 412000, currentBalance: 280000, totalPoints: 412000, loginStreak: 38 },
    { walletAddress: "Lm5NkRp3xTy8bFcJhGq2WvEd7sZaXn4UiKoVlYjMwHgS", username: "WhaleTrader", totalRepeEarned: 380000, currentBalance: 250000, totalPoints: 380000, loginStreak: 52 },
    { walletAddress: "9pWqAzXc4tRvBn7mYkLj8sHfDe2uGxNi5oVlKwJaS6Cb", username: "MoonBoy99", totalRepeEarned: 295000, currentBalance: 190000, totalPoints: 295000, loginStreak: 28 },
    { walletAddress: "Kp7VnTxR2mBcYw4sLj8fHqDe5uGaXi9oNlKzJbS6Av3Q", username: "DiamondHands", totalRepeEarned: 268000, currentBalance: 175000, totalPoints: 268000, loginStreak: 33 },
    { walletAddress: "Bx8WqFm3nRtVy5cZj7sLkHpGa2DuXe4oNiKlJwMvSb6Q", username: "REPE_OG", totalRepeEarned: 245000, currentBalance: 160000, totalPoints: 245000, loginStreak: 41 },
    { walletAddress: "Hy3WxQm8nRtVp5cZj9sLkGpFa2DuXe7oNiKlJwMvSb4T", username: "SolFarmer", totalRepeEarned: 218000, currentBalance: 142000, totalPoints: 218000, loginStreak: 25 },
    { walletAddress: "Nz6XyRm2nStVq8cWj4sLkHpGb5DuXe3oKiJlFwMvTb7R", username: "AirdropKing", totalRepeEarned: 195000, currentBalance: 128000, totalPoints: 195000, loginStreak: 19 },
    { walletAddress: "Qw4TxSn9mPtVr7cYj2sLkHpGa8DuXe6oNiKlJwMvUb5X", username: "TokenHunter", totalRepeEarned: 172000, currentBalance: 115000, totalPoints: 172000, loginStreak: 22 },
    { walletAddress: "Uz1VxWm6nRtPy3cZj8sLkHpGa5DuXe9oNiKlJwMvSb2F", username: "CryptoNinja", totalRepeEarned: 156000, currentBalance: 98000, totalPoints: 156000, loginStreak: 15 },
    { walletAddress: "Mx7RxYn4mStVq2cWj5sLkGpFa9DuXe1oNiKlJwHvTb8L", username: "SOLdier", totalRepeEarned: 142000, currentBalance: 88000, totalPoints: 142000, loginStreak: 12 },
    { walletAddress: "Jk3PxZm1nRtVw6cYj9sLkHpGa4DuXe8oNiKlJwMvSb5G", username: "MemeKingREPE", totalRepeEarned: 128000, currentBalance: 75000, totalPoints: 128000, loginStreak: 18 },
  ]

  for (const user of demoUsers) {
    await prisma.user.create({
      data: {
        ...user,
        email: `${user.username.toLowerCase()}@example.com`,
        onboardedAt: new Date(),
        xHandle: `@${user.username}`,
        telegramHandle: `@${user.username}`,
      },
    })
  }
  console.log(`Created ${demoUsers.length} demo users`)

  // Create achievements
  const achievements = [
    { name: "Early Adopter", description: "Joined in the first week", category: "SPECIAL" as const, criteria: JSON.stringify({ type: "join_date", maxDays: 7 }), rewardAmount: 200 },
    { name: "Social Butterfly", description: "Connected all social accounts", category: "SOCIAL" as const, criteria: JSON.stringify({ type: "socials_connected", count: 7 }), rewardAmount: 300 },
    { name: "Streak Master", description: "30-day login streak", category: "STREAK" as const, criteria: JSON.stringify({ type: "login_streak", days: 30 }), rewardAmount: 500 },
    { name: "Referral King", description: "Referred 10+ friends", category: "REFERRAL" as const, criteria: JSON.stringify({ type: "referrals", count: 10 }), rewardAmount: 1000 },
    { name: "Task Hunter", description: "Completed 50 tasks", category: "TASKS" as const, criteria: JSON.stringify({ type: "tasks_completed", count: 50 }), rewardAmount: 500 },
    { name: "Top 100", description: "Reached top 100 on leaderboard", category: "MILESTONE" as const, criteria: JSON.stringify({ type: "rank", maxRank: 100 }), rewardAmount: 1000 },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement })
  }
  console.log(`Created ${achievements.length} achievements`)

  console.log("Seed complete!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
