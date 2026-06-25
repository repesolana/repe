"use client"

import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { TrendingUp, TrendingDown, Users, ListTodo, Flame, Activity } from "lucide-react"

const METRICS = [
  { label: "Daily Active Users", value: 3420, change: "+12%", trending: "up", icon: Users },
  { label: "Tasks Completed / Day", value: 8560, change: "+8%", trending: "up", icon: ListTodo },
  { label: "Avg. REPE / User", value: 655, change: "-3%", trending: "down", icon: Flame },
  { label: "Retention Rate", value: 78, change: "+2%", trending: "up", icon: Activity, suffix: "%" },
]

const TOP_TASKS = [
  { name: "Daily Check-in", completions: 4820, percentage: 100 },
  { name: "Follow on X", completions: 3200, percentage: 66 },
  { name: "Join Telegram", completions: 2800, percentage: 58 },
  { name: "Join Discord", completions: 2100, percentage: 44 },
  { name: "Retweet Campaign", completions: 1500, percentage: 31 },
]

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {METRICS.map((metric) => (
          <GlassCard key={metric.label}>
            <div className="flex items-center justify-between mb-2">
              <metric.icon className="h-5 w-5 text-muted-foreground" />
              <span className={`text-xs font-medium flex items-center gap-0.5 ${
                metric.trending === "up" ? "text-success" : "text-destructive"
              }`}>
                {metric.trending === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {metric.change}
              </span>
            </div>
            <AnimatedCounter value={metric.value} className="text-2xl font-bold" suffix={metric.suffix || ""} />
            <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Top Tasks */}
      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">
        Top Tasks by Completion
      </h2>
      <GlassCard>
        <div className="space-y-4">
          {TOP_TASKS.map((task) => (
            <div key={task.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{task.name}</span>
                <span className="text-sm text-muted-foreground">{task.completions.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-repe-gray overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-repe-red to-repe-dark-red transition-all duration-500"
                  style={{ width: `${task.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
