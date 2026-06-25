"use client"

import {
  User,
  Wallet,
  Mail,
  Calendar,
  Trophy,
  Flame,
  Target,
  Users,
  Zap,
  AtSign,
  MessageCircle,
  Hash,
  Video,
  Music2,
  Camera,
  Globe,
  CheckCircle2,
  Link2,
} from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatNumber, shortenAddress } from "@/lib/utils"

const SOCIALS = [
  { platform: "X (Twitter)", handle: "@repe_user", icon: AtSign, connected: true },
  { platform: "Telegram", handle: "@repe_user", icon: MessageCircle, connected: true },
  { platform: "Discord", handle: "repe_user#1234", icon: Hash, connected: true },
  { platform: "YouTube", handle: null, icon: Video, connected: false },
  { platform: "TikTok", handle: null, icon: Music2, connected: false },
  { platform: "Instagram", handle: null, icon: Camera, connected: false },
  { platform: "Reddit", handle: null, icon: Globe, connected: false },
]

const BADGES = [
  { name: "Early Adopter", description: "Joined in the first week", unlocked: true },
  { name: "Social Butterfly", description: "Connected all social accounts", unlocked: false },
  { name: "Streak Master", description: "30-day login streak", unlocked: true },
  { name: "Referral King", description: "Referred 10+ friends", unlocked: false },
  { name: "Task Hunter", description: "Completed 50 tasks", unlocked: true },
  { name: "Top 100", description: "Reached top 100 on leaderboard", unlocked: true },
]

export default function ProfilePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">
        Profile
      </h1>

      {/* User Info */}
      <GlassCard variant="accent" className="mb-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-repe-red/30">
            <AvatarFallback className="bg-repe-gray text-lg font-bold">
              R
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">RepeUser</h2>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" />
                {shortenAddress("8xK2nQpVYmR7tHjLkWf5sNpZdGcAeB3uX9vMqYrTmNp4")}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                user@example.com
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined Dec 2024
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <GlassCard className="text-center">
          <Flame className="h-5 w-5 mx-auto mb-2 text-repe-red" />
          <AnimatedCounter value={150250} className="text-lg font-bold block" />
          <p className="text-xs text-muted-foreground mt-1">Total REPE</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
          <p className="text-lg font-bold">#43</p>
          <p className="text-xs text-muted-foreground mt-1">Current Rank</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Target className="h-5 w-5 mx-auto mb-2 text-blue-400" />
          <AnimatedCounter value={82} className="text-lg font-bold block" />
          <p className="text-xs text-muted-foreground mt-1">Tasks Done</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Zap className="h-5 w-5 mx-auto mb-2 text-green-400" />
          <p className="text-lg font-bold">35 Days</p>
          <p className="text-xs text-muted-foreground mt-1">Login Streak</p>
        </GlassCard>
      </div>

      {/* Social Connections */}
      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">
        Social Connections
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {SOCIALS.map((social) => (
          <GlassCard key={social.platform} className="!p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <social.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{social.platform}</p>
                {social.handle && (
                  <p className="text-xs text-muted-foreground">{social.handle}</p>
                )}
              </div>
            </div>
            {social.connected ? (
              <Badge className="bg-success/10 text-success border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Button size="sm" variant="outline" className="border-border text-xs">
                <Link2 className="h-3 w-3 mr-1" />
                Connect
              </Button>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Achievements */}
      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">
        Achievement Badges
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map((badge) => (
          <GlassCard
            key={badge.name}
            className={`!p-4 ${!badge.unlocked ? "opacity-40" : ""}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                badge.unlocked ? "bg-repe-red/10" : "bg-repe-gray"
              }`}>
                <Trophy className={`h-4 w-4 ${badge.unlocked ? "text-repe-red" : "text-muted-foreground"}`} />
              </div>
              <span className="text-sm font-semibold">{badge.name}</span>
            </div>
            <p className="text-xs text-muted-foreground ml-10">{badge.description}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
