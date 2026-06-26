"use client"

import { HeroSection } from "@/components/home/hero-section"
import { ActiveTasks } from "@/components/home/active-tasks"
import { RewardsSection } from "@/components/home/rewards-section"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string
  category: string
  rewardAmount: number
  completionStatus: string | null
}

interface UserData {
  currentBalance: number
  totalRepeEarned: number
  totalPoints: number
  loginStreak: number
  lastDailyClaim: string | null
  _count: { taskCompletions: number; referrals: number }
}

interface LeaderboardData {
  userRank: number | null
}

export default function MainHomePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [rank, setRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [tasksRes, userRes, lbRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/user"),
        fetch("/api/leaderboard?period=all-time&page=1"),
      ])
      if (tasksRes.ok) setTasks(await tasksRes.json())
      if (userRes.ok) setUser(await userRes.json())
      if (lbRes.ok) {
        const lb = await lbRes.json()
        if (lb.userRank) setRank(lb.userRank)
      }
    } catch {
      // API not available - use fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const canClaimDaily = user
    ? !user.lastDailyClaim || new Date(user.lastDailyClaim).toDateString() !== new Date().toDateString()
    : true

  const handleClaimDaily = async () => {
    const res = await fetch("/api/rewards/daily", { method: "POST" })
    if (res.ok) {
      const data = await res.json()
      toast.success(`+${data.reward} REPE`, { description: `Day ${data.streak} streak!` })
      fetchData()
    } else {
      const err = await res.json()
      toast.error(err.error || "Failed to claim")
    }
  }

  const handleCompleteTask = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    if (res.ok) {
      const data = await res.json()
      const task = tasks.find(t => t.id === id)
      if (data.autoApproved) {
        toast.success(`+${task?.rewardAmount} REPE`, { description: task?.title })
      } else {
        toast.info("Submitted for review", { description: task?.title })
      }
      fetchData()
    } else {
      const err = await res.json()
      toast.error(err.error || "Failed")
    }
  }

  const availableTasks = tasks.filter(t => !t.completionStatus)
  const completedTasks = tasks
    .filter(t => t.completionStatus === "APPROVED")
    .map(t => ({ id: t.id, title: t.title, description: t.description, category: t.category, rewardAmount: t.rewardAmount }))

  const totalEarned = user?.totalRepeEarned || 0

  return (
    <div className="max-w-4xl">
      <HeroSection
        balance={user?.currentBalance || 0}
        rank={rank || 0}
        streak={user?.loginStreak || 0}
        canClaimDaily={canClaimDaily}
        onClaimDaily={handleClaimDaily}
      />
      <ActiveTasks tasks={availableTasks} onCompleteTask={handleCompleteTask} />
      <RewardsSection completedTasks={completedTasks} totalEarned={totalEarned} />
    </div>
  )
}
