"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"

const DEMO_TASKS = [
  { id: "1", title: "Follow @REPE on X", type: "SOCIAL", category: "TWITTER", reward: 100, completions: 842, status: "ACTIVE" },
  { id: "2", title: "Join REPE Telegram", type: "COMMUNITY", category: "TELEGRAM", reward: 150, completions: 1203, status: "ACTIVE" },
  { id: "3", title: "Retweet Campaign Post", type: "SOCIAL", category: "TWITTER", reward: 250, completions: 523, status: "ACTIVE" },
  { id: "4", title: "Daily Check-in", type: "DAILY", category: "COMMUNITY", reward: 50, completions: 4820, status: "ACTIVE" },
  { id: "5", title: "Write Thread about REPE", type: "CONTENT", category: "TWITTER", reward: 1000, completions: 45, status: "ACTIVE" },
]

export default function AdminTasksPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Tasks</h1>
        <Button className="bg-repe-red hover:bg-repe-red/90">
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_100px_80px] gap-4 p-3 text-xs font-medium text-muted-foreground border-b border-border">
          <span>Task</span>
          <span>Type</span>
          <span>Reward</span>
          <span>Completions</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-border">
          {DEMO_TASKS.map((task) => (
            <div key={task.id} className="grid grid-cols-[1fr_100px_100px_100px_80px] gap-4 p-3 items-center text-sm hover:bg-white/[0.02]">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.category}</p>
              </div>
              <Badge variant="secondary" className="w-fit border-0">{task.type}</Badge>
              <span className="text-repe-red font-mono font-medium">+{task.reward}</span>
              <span className="font-mono text-muted-foreground">{formatNumber(task.completions)}</span>
              <Badge className="bg-success/10 text-success border-0 w-fit">{task.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
