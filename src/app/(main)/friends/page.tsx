"use client"

import { useState } from "react"
import { Users, Link2, Copy, Check, AtSign, MessageCircle, Send } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"
import { toast } from "sonner"

const DEMO_REFERRALS = [
  { id: "1", username: "JohnCrypto", walletAddress: "8xK2...mNp4", createdAt: "2 days ago", rewardGenerated: 500, active: true },
  { id: "2", username: "SolanaFan42", walletAddress: "3vRt...yQ7z", createdAt: "5 days ago", rewardGenerated: 500, active: true },
  { id: "3", username: "CryptoWhale", walletAddress: "Lm5N...xRk9", createdAt: "1 week ago", rewardGenerated: 500, active: true },
  { id: "4", username: null, walletAddress: "9pWq...aB2c", createdAt: "2 weeks ago", rewardGenerated: 0, active: false },
]

export default function FriendsPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = "REPE8X4K"
  const referralLink = `https://repe.io/ref/${referralCode}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success("Referral link copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">
        Friends & Referrals
      </h1>

      {/* Referral Link Card */}
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
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="border-border">
            <AtSign className="h-4 w-4 mr-1" /> Share on X
          </Button>
          <Button variant="outline" size="sm" className="border-border">
            <Send className="h-4 w-4 mr-1" /> Telegram
          </Button>
          <Button variant="outline" size="sm" className="border-border">
            <MessageCircle className="h-4 w-4 mr-1" /> Discord
          </Button>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <GlassCard>
          <p className="text-sm text-muted-foreground mb-1">Total Invited</p>
          <AnimatedCounter value={4} className="text-2xl font-bold" />
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground mb-1">Active Friends</p>
          <AnimatedCounter value={3} className="text-2xl font-bold text-success" />
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground mb-1">Rewards Earned</p>
          <AnimatedCounter value={1500} className="text-2xl font-bold text-repe-red" suffix=" REPE" />
        </GlassCard>
      </div>

      {/* Referred Users */}
      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">
        Referred Users
      </h2>
      <div className="space-y-3">
        {DEMO_REFERRALS.map((user) => (
          <GlassCard key={user.id} className="!p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-repe-gray flex items-center justify-center">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {user.username || user.walletAddress}
                </p>
                <p className="text-xs text-muted-foreground">
                  Joined: {user.createdAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user.active ? (
                <Badge className="bg-success/10 text-success border-0">Active</Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
                  Inactive
                </Badge>
              )}
              <span className="text-sm font-bold text-repe-red">
                +{formatNumber(user.rewardGenerated)} REPE
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
