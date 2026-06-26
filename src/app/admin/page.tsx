"use client"

import { useEffect, useState } from "react"
import { Users, ListTodo, Flame, TrendingUp, ShieldCheck, Activity } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { formatNumber } from "@/lib/utils"

interface Stats {
  totalUsers: number
  newUsers24h: number
  activeTasks: number
  totalRepeDistributed: number
  pendingApprovals: number
  completions24h: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setStats(d))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  const STATS = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400", bgColor: "bg-blue-400/10" },
    { label: "Active Tasks", value: stats?.activeTasks || 0, icon: ListTodo, color: "text-green-400", bgColor: "bg-green-400/10" },
    { label: "REPE Distributed", value: stats?.totalRepeDistributed || 0, icon: Flame, color: "text-repe-red", bgColor: "bg-repe-red/10" },
    { label: "Pending Approvals", value: stats?.pendingApprovals || 0, icon: ShieldCheck, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
    { label: "New Users (24h)", value: stats?.newUsers24h || 0, icon: TrendingUp, color: "text-purple-400", bgColor: "bg-purple-400/10" },
    { label: "Tasks Completed (24h)", value: stats?.completions24h || 0, icon: Activity, color: "text-cyan-400", bgColor: "bg-cyan-400/10" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat) => (
          <GlassCard key={stat.label}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <AnimatedCounter value={stat.value} className="text-2xl font-bold" />
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
