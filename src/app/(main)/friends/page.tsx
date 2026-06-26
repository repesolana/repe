"use client"

import { useState, useEffect } from "react"
import { Users, Link2, Copy, Check, AtSign, MessageCircle, Send } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { formatNumber, shortenAddress } from "@/lib/utils"
import { toast } from "sonner"

interface ReferralData {
  referralCode: string
  totalInvited: number
  activeReferrals: number
  totalEarned: number
  referredUsers: {
    id: string
    username: string | null
    walletAddress: string
    createdAt: string
    totalRepeEarned: number
  }[]
}

export default function FriendsPage() {
  const [copied, setCopied] = useState(false)
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const referralLink = data
    ? `https://repesolana.com/login?ref=${data.referralCode}`
    : ""

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success("Referral link copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">
        Friends & Referrals
      </h1>

      <GlassCard variant="accent" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="h-5 w-5 text-repe-red" />
          <h2 className="font-semibold">Your Referral Link</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Earn <span className="text-repe-red font-bold">500 REPE</span> for every friend who joins!
        </p>
        <div className="flex gap-2">
          <Input
            value={referralLink}
            readOnly
            className="bg-repe-black border-border font-mono text-sm"
          />
          <Button onClick={handleCopy} className="shrink-0 bg-repe-red hover:bg-repe-red/90">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <GlassCard>
          <p className="text-sm text-muted-foreground mb-1">Total Invited</p>
          <AnimatedCounter value={data?.totalInvited || 0} className="text-2xl font-bold" />
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground mb-1">Active Friends</p>
          <AnimatedCounter value={data?.activeReferrals || 0} className="text-2xl font-bold text-success" />
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground mb-1">Rewards Earned</p>
          <AnimatedCounter value={data?.totalEarned || 0} className="text-2xl font-bold text-repe-red" suffix=" REPE" />
        </GlassCard>
      </div>

      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">
        Referred Users
      </h2>
      {data?.referredUsers && data.referredUsers.length > 0 ? (
        <div className="space-y-3">
          {data.referredUsers.map((user) => (
            <GlassCard key={user.id} className="!p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-repe-gray flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {user.username || shortenAddress(user.walletAddress)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {user.totalRepeEarned > 0 ? (
                  <Badge className="bg-success/10 text-success border-0">Active</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">New</Badge>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="text-center py-8">
          <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No referrals yet. Share your link!</p>
        </GlassCard>
      )}
    </div>
  )
}
