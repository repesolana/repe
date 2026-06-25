"use client"

import { CheckCircle2, XCircle, ExternalLink, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const DEMO_APPROVALS = [
  { id: "1", user: "CryptoKing", task: "Write Thread about REPE", reward: 1000, proofUrl: "https://x.com/...", submittedAt: "10 min ago" },
  { id: "2", user: "SolanaFan42", task: "YouTube Video Review", reward: 2000, proofUrl: "https://youtube.com/...", submittedAt: "25 min ago" },
  { id: "3", user: "MoonBoy", task: "Instagram Story", reward: 500, proofUrl: "https://instagram.com/...", submittedAt: "1 hour ago" },
  { id: "4", user: "WhaleTrader", task: "Write Thread about REPE", reward: 1000, proofUrl: "https://x.com/...", submittedAt: "2 hours ago" },
]

export default function ApprovalsPage() {
  const handleApprove = (id: string) => {
    toast.success("Task approved and reward distributed")
  }

  const handleReject = (id: string) => {
    toast.error("Task submission rejected")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">
          Pending Approvals
        </h1>
        <Badge className="bg-yellow-500/10 text-yellow-500 border-0">
          <Clock className="h-3 w-3 mr-1" />
          {DEMO_APPROVALS.length} pending
        </Badge>
      </div>

      <div className="space-y-4">
        {DEMO_APPROVALS.map((item) => (
          <GlassCard key={item.id} className="!p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{item.task}</h3>
                <p className="text-sm text-muted-foreground">by {item.user}</p>
                <p className="text-xs text-muted-foreground mt-1">Submitted: {item.submittedAt}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-repe-red">+{item.reward} REPE</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="border-border text-xs">
                <ExternalLink className="h-3 w-3 mr-1" /> View Proof
              </Button>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive/20 text-destructive hover:bg-destructive/10"
                  onClick={() => handleReject(item.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={() => handleApprove(item.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
