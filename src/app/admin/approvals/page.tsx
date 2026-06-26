"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { shortenAddress } from "@/lib/utils"
import { toast } from "sonner"

interface Approval {
  id: string
  rewardAmount: number
  proofUrl: string | null
  createdAt: string
  task: { title: string; rewardAmount: number }
  user: { username: string | null; walletAddress: string }
}

export default function ApprovalsPage() {
  const [items, setItems] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApprovals = () => {
    fetch("/api/admin/approvals")
      .then((r) => r.ok ? r.json() : [])
      .then(setItems)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchApprovals() }, [])

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const res = await fetch(`/api/admin/approvals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
    if (res.ok) {
      toast.success(action === "approve" ? "Approved!" : "Rejected")
      fetchApprovals()
    }
  }

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Pending Approvals</h1>
        <Badge className="bg-yellow-500/10 text-yellow-500 border-0">
          <Clock className="h-3 w-3 mr-1" />{items.length} pending
        </Badge>
      </div>

      {items.length === 0 ? (
        <GlassCard className="text-center py-12">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-success" />
          <p className="text-muted-foreground">No pending approvals</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <GlassCard key={item.id} className="!p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{item.task.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {item.user.username || shortenAddress(item.user.walletAddress)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                  {item.proofUrl && (
                    <a href={item.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-repe-red underline mt-1 block">
                      View Proof
                    </a>
                  )}
                </div>
                <span className="text-lg font-bold text-repe-red">+{item.rewardAmount} REPE</span>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
                <Button size="sm" variant="outline" className="border-destructive/20 text-destructive" onClick={() => handleAction(item.id, "reject")}>
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button size="sm" className="bg-success hover:bg-success/90 text-white" onClick={() => handleAction(item.id, "approve")}>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
