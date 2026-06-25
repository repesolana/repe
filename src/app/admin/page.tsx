"use client"

import { Users, ListTodo, Flame, TrendingUp, ShieldCheck, Activity } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"

const STATS = [
  { label: "Total Users", value: 12847, icon: Users, color: "text-blue-400", bgColor: "bg-blue-400/10" },
  { label: "Active Tasks", value: 24, icon: ListTodo, color: "text-green-400", bgColor: "bg-green-400/10" },
  { label: "REPE Distributed", value: 8420000, icon: Flame, color: "text-repe-red", bgColor: "bg-repe-red/10" },
  { label: "Pending Approvals", value: 18, icon: ShieldCheck, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
  { label: "New Users (24h)", value: 342, icon: TrendingUp, color: "text-purple-400", bgColor: "bg-purple-400/10" },
  { label: "Tasks Completed (24h)", value: 1856, icon: Activity, color: "text-cyan-400", bgColor: "bg-cyan-400/10" },
]

const RECENT_ACTIVITY = [
  { user: "CryptoKing", action: "Completed 'Follow on X'", reward: 100, time: "2 min ago" },
  { user: "SolanaFan42", action: "Claimed daily bonus", reward: 50, time: "5 min ago" },
  { user: "NewUser123", action: "Registered via referral", reward: 500, time: "8 min ago" },
  { user: "WhaleTrader", action: "Completed 'Join Discord'", reward: 150, time: "12 min ago" },
  { user: "MoonBoy", action: "Submitted proof for review", reward: 0, time: "15 min ago" },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
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

      {/* Recent Activity */}
      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">
        Recent Activity
      </h2>
      <GlassCard className="!p-0 overflow-hidden">
        <div className="divide-y divide-border">
          {RECENT_ACTIVITY.map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{activity.user}</p>
                <p className="text-xs text-muted-foreground">{activity.action}</p>
              </div>
              <div className="text-right">
                {activity.reward > 0 && (
                  <p className="text-sm font-bold text-repe-red">+{activity.reward} REPE</p>
                )}
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
