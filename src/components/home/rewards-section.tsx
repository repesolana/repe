"use client"

import { TaskCard } from "./task-card"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { Gift } from "lucide-react"

interface CompletedTask {
  id: string
  title: string
  description: string
  category: string
  rewardAmount: number
}

interface RewardsSectionProps {
  completedTasks: CompletedTask[]
  totalEarned: number
}

export function RewardsSection({
  completedTasks,
  totalEarned,
}: RewardsSectionProps) {
  if (completedTasks.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-[family-name:var(--font-display)]">
          Your Rewards
        </h2>
        <GlassCard variant="accent" className="!p-2 !px-3 flex items-center gap-2">
          <Gift className="h-4 w-4 text-repe-red" />
          <AnimatedCounter
            value={totalEarned}
            className="text-sm font-bold"
            suffix=" REPE"
          />
        </GlassCard>
      </div>

      <div className="space-y-3">
        {completedTasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            category={task.category}
            rewardAmount={task.rewardAmount}
            status="completed"
          />
        ))}
      </div>
    </div>
  )
}
