"use client"

import { useState, useEffect } from "react"
import { Trophy, Search, TrendingUp } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn, formatNumber, shortenAddress } from "@/lib/utils"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string | null
  walletAddress: string
  totalPoints: number
  totalRepeEarned: number
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [userPoints, setUserPoints] = useState(0)
  const [search, setSearch] = useState("")
  const [period, setPeriod] = useState("all-time")
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ period, page: "1", search })
      const res = await fetch(`/api/leaderboard?${params}`)
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries || [])
        setUserRank(data.userRank || null)
      }
    } catch {
      // fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeaderboard() }, [period, search])

  // Get user stats
  useEffect(() => {
    fetch("/api/user").then(r => r.ok ? r.json() : null).then(u => {
      if (u) setUserPoints(u.totalPoints)
    }).catch(() => {})
  }, [])

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">
        Leaderboard
      </h1>

      <GlassCard variant="accent" className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your Position</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">#{userRank || "—"}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Total Points</p>
            <p className="text-2xl font-bold">{formatNumber(userPoints)}</p>
          </div>
        </div>
      </GlassCard>

      <Tabs defaultValue="all-time" onValueChange={setPeriod} className="mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <TabsList className="bg-repe-dark-gray border border-border">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all-time">All Time</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-repe-dark-gray border-border w-60"
            />
          </div>
        </div>

        {["weekly", "monthly", "all-time"].map(tab => (
          <TabsContent key={tab} value={tab}>
            {loading ? (
              <LoadingSpinner className="py-12" />
            ) : entries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No users found</div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-4 p-3 text-xs font-medium text-muted-foreground border-b border-border">
                  <span>Rank</span>
                  <span>User</span>
                  <span className="text-right">Points</span>
                  <span className="text-right">REPE Earned</span>
                </div>
                <div className="divide-y divide-border">
                  {entries.map((entry) => (
                    <div
                      key={entry.userId}
                      className={cn(
                        "grid grid-cols-[60px_1fr_1fr_1fr] gap-4 p-3 items-center text-sm transition-colors hover:bg-white/[0.02]",
                        entry.rank === userRank &&
                          "bg-repe-red/5 border-l-2 border-l-repe-red"
                      )}
                    >
                      <span className="font-bold">
                        {entry.rank <= 3 ? (
                          <span className={cn(
                            "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                            entry.rank === 1 && "bg-yellow-500/20 text-yellow-500",
                            entry.rank === 2 && "bg-gray-300/20 text-gray-300",
                            entry.rank === 3 && "bg-amber-700/20 text-amber-600"
                          )}>
                            {entry.rank}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">#{entry.rank}</span>
                        )}
                      </span>
                      <span className="font-medium truncate">
                        {entry.username || shortenAddress(entry.walletAddress)}
                        {entry.rank === userRank && (
                          <Badge className="ml-2 bg-repe-red/10 text-repe-red border-0 text-[10px]">You</Badge>
                        )}
                      </span>
                      <span className="text-right font-mono text-muted-foreground">
                        {formatNumber(entry.totalPoints)}
                      </span>
                      <span className="text-right font-mono text-repe-red font-medium">
                        {formatNumber(entry.totalRepeEarned)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
