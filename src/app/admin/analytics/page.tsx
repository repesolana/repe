"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Users, ListTodo, Flame, Activity, TrendingUp, UserPlus } from "lucide-react"
import { formatNumber, shortenAddress } from "@/lib/utils"

interface AnalyticsData {
  overview: {
    totalUsers: number
    users24h: number
    users7d: number
    users30d: number
    totalTaskCompletions: number
    completions24h: number
    completions7d: number
    totalRepeDistributed: number
    repe24h: number
    repe7d: number
    totalReferrals: number
  }
  topTasks: { title: string; currentCompletions: number; rewardAmount: number }[]
  topUsers: { username: string | null; walletAddress: string; totalRepeEarned: number }[]
  recentCompletions: {
    id: string
    completedAt: string
    user: { username: string | null; walletAddress: string }
    task: { title: string; rewardAmount: number }
  }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner className="py-20" size="lg" />
  if (!data) return null

  const o = data.overview
  const maxCompletions = data.topTasks[0]?.currentCompletions || 1

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <GlassCard>
          <Users className="h-5 w-5 text-blue-400 mb-2" />
          <AnimatedCounter value={o.totalUsers} className="text-2xl font-bold" />
          <p className="text-xs text-muted-foreground mt-1">Total Users</p>
          <p className="text-xs text-success mt-0.5">+{o.users24h} today · +{o.users7d} this week</p>
        </GlassCard>
        <GlassCard>
          <ListTodo className="h-5 w-5 text-green-400 mb-2" />
          <AnimatedCounter value={o.totalTaskCompletions} className="text-2xl font-bold" />
          <p className="text-xs text-muted-foreground mt-1">Tasks Completed</p>
          <p className="text-xs text-success mt-0.5">+{o.completions24h} today · +{o.completions7d} this week</p>
        </GlassCard>
        <GlassCard>
          <Flame className="h-5 w-5 text-repe-red mb-2" />
          <AnimatedCounter value={o.totalRepeDistributed} className="text-2xl font-bold" />
          <p className="text-xs text-muted-foreground mt-1">REPE Distributed</p>
          <p className="text-xs text-success mt-0.5">+{formatNumber(o.repe24h)} today · +{formatNumber(o.repe7d)} week</p>
        </GlassCard>
        <GlassCard>
          <UserPlus className="h-5 w-5 text-purple-400 mb-2" />
          <AnimatedCounter value={o.totalReferrals} className="text-2xl font-bold" />
          <p className="text-xs text-muted-foreground mt-1">Total Referrals</p>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div>
          <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">Top Tasks</h2>
          <GlassCard>
            <div className="space-y-4">
              {data.topTasks.map((task) => (
                <div key={task.title}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate mr-2">{task.title}</span>
                    <span className="text-sm text-muted-foreground shrink-0">{formatNumber(task.currentCompletions)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-repe-gray overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-repe-red to-repe-dark-red"
                      style={{ width: `${(task.currentCompletions / maxCompletions) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {data.topTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>}
            </div>
          </GlassCard>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">Top Earners</h2>
          <GlassCard className="!p-0 overflow-hidden">
            <div className="divide-y divide-border">
              {data.topUsers.map((user, i) => (
                <div key={user.walletAddress} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                    <span className="text-sm font-medium">{user.username || shortenAddress(user.walletAddress)}</span>
                  </div>
                  <span className="text-sm font-mono text-repe-red">{formatNumber(user.totalRepeEarned)}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">Recent Activity</h2>
      <GlassCard className="!p-0 overflow-hidden">
        <div className="divide-y divide-border">
          {data.recentCompletions.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-medium">{c.user.username || shortenAddress(c.user.walletAddress)}</p>
                <p className="text-xs text-muted-foreground">{c.task.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-repe-red">+{c.task.rewardAmount}</p>
                <p className="text-[10px] text-muted-foreground">{c.completedAt ? new Date(c.completedAt).toLocaleString() : ""}</p>
              </div>
            </div>
          ))}
          {data.recentCompletions.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No activity yet</p>}
        </div>
      </GlassCard>
    </div>
  )
}
