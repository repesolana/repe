"use client"

import { useEffect, useState } from "react"
import {
  User,
  Wallet,
  Mail,
  Calendar,
  Trophy,
  Flame,
  Target,
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
  LogOut,
} from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { shortenAddress } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

interface UserData {
  id: string
  walletAddress: string
  username: string | null
  email: string | null
  xHandle: string | null
  telegramHandle: string | null
  discordHandle: string | null
  youtubeHandle: string | null
  tiktokHandle: string | null
  instagramHandle: string | null
  redditHandle: string | null
  totalRepeEarned: number
  currentBalance: number
  totalPoints: number
  loginStreak: number
  longestStreak: number
  createdAt: string
  _count: { taskCompletions: number; referrals: number }
}

const SOCIALS = [
  { key: "twitter", platform: "X (Twitter)", field: "xHandle", icon: AtSign },
  { key: "telegram", platform: "Telegram", field: "telegramHandle", icon: MessageCircle },
  { key: "discord", platform: "Discord", field: "discordHandle", icon: Hash },
  { key: "youtube", platform: "YouTube", field: "youtubeHandle", icon: Video },
  { key: "tiktok", platform: "TikTok", field: "tiktokHandle", icon: Music2 },
  { key: "instagram", platform: "Instagram", field: "instagramHandle", icon: Camera },
  { key: "reddit", platform: "Reddit", field: "redditHandle", icon: Globe },
]

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null)
  const [handleInput, setHandleInput] = useState("")

  const fetchUser = () => {
    fetch("/api/user")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUser() }, [])

  const handleConnectSocial = async (platform: string) => {
    if (!handleInput.trim()) return
    const res = await fetch("/api/user/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, handle: handleInput.trim() }),
    })
    if (res.ok) {
      toast.success(`${platform} connected!`)
      setEditingPlatform(null)
      setHandleInput("")
      fetchUser()
    } else {
      toast.error("Failed to connect")
    }
  }

  const handleDisconnect = async (platform: string) => {
    const res = await fetch(`/api/user/social?platform=${platform}`, { method: "DELETE" })
    if (res.ok) {
      toast.success(`${platform} disconnected`)
      fetchUser()
    }
  }

  if (loading) return <LoadingSpinner className="py-20" size="lg" />
  if (!user) return null

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Profile</h1>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>

      <GlassCard variant="accent" className="mb-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-repe-red/30">
            <AvatarFallback className="bg-repe-gray text-lg font-bold">
              {(user.username || "?").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.username || "Anonymous"}</h2>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" />
                {shortenAddress(user.walletAddress)}
              </span>
              {user.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <GlassCard className="text-center">
          <Flame className="h-5 w-5 mx-auto mb-2 text-repe-red" />
          <AnimatedCounter value={user.totalRepeEarned} className="text-lg font-bold block" />
          <p className="text-xs text-muted-foreground mt-1">Total REPE</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
          <p className="text-lg font-bold">#{user.totalPoints > 0 ? "—" : "—"}</p>
          <p className="text-xs text-muted-foreground mt-1">Current Rank</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Target className="h-5 w-5 mx-auto mb-2 text-blue-400" />
          <AnimatedCounter value={user._count.taskCompletions} className="text-lg font-bold block" />
          <p className="text-xs text-muted-foreground mt-1">Tasks Done</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Zap className="h-5 w-5 mx-auto mb-2 text-green-400" />
          <p className="text-lg font-bold">{user.loginStreak} Days</p>
          <p className="text-xs text-muted-foreground mt-1">Login Streak</p>
        </GlassCard>
      </div>

      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">
        Social Connections
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {SOCIALS.map((social) => {
          const handle = (user as any)[social.field] as string | null
          const isEditing = editingPlatform === social.key

          return (
            <GlassCard key={social.key} className="!p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <social.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{social.platform}</p>
                    {handle && <p className="text-xs text-muted-foreground">{handle}</p>}
                  </div>
                </div>
                {handle ? (
                  <Badge
                    className="bg-success/10 text-success border-0 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDisconnect(social.key)}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : isEditing ? null : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border text-xs"
                    onClick={() => { setEditingPlatform(social.key); setHandleInput("") }}
                  >
                    <Link2 className="h-3 w-3 mr-1" /> Connect
                  </Button>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2 mt-3">
                  <Input
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    placeholder={`@your${social.key}`}
                    className="bg-repe-black border-border text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleConnectSocial(social.key)}
                  />
                  <Button
                    size="sm"
                    className="bg-repe-red hover:bg-repe-red/90"
                    onClick={() => handleConnectSocial(social.key)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingPlatform(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
