"use client"

import { Flame, Trophy, Zap } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  balance: number
  rank: number
  streak: number
  canClaimDaily: boolean
  onClaimDaily: () => void
}

export function HeroSection({
  balance,
  rank,
  streak,
  canClaimDaily,
  onClaimDaily,
}: HeroSectionProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] md:text-3xl">
          Welcome back <span className="text-gradient-red">to REPE</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete tasks, earn rewards, climb the leaderboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard variant="accent" className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-repe-red/10 blur-2xl" />
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-repe-red/10 p-2">
              <Flame className="h-5 w-5 text-repe-red" />
            </div>
            <span className="text-sm text-muted-foreground">Balance</span>
          </div>
          <AnimatedCounter
            value={balance}
            className="text-2xl font-bold"
            suffix=" REPE"
          />
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-yellow-500/10 blur-2xl" />
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-yellow-500/10 p-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <span className="text-sm text-muted-foreground">Rank</span>
          </div>
          <p className="text-2xl font-bold">#{rank}</p>
        </GlassCard>

        <GlassCard className="relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-green-500/10 blur-2xl" />
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-green-500/10 p-2">
              <Zap className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              Daily Bonus — {streak} day streak
            </span>
          </div>
          <Button
            onClick={onClaimDaily}
            disabled={!canClaimDaily}
            className="w-full bg-gradient-to-r from-repe-red to-repe-dark-red hover:from-repe-red/90 hover:to-repe-dark-red/90 text-white font-semibold"
          >
            {canClaimDaily ? "+50 REPE — Claim Now" : "Already Claimed Today"}
          </Button>
        </GlassCard>
      </div>
    </div>
  )
}
