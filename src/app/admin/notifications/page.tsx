"use client"

import { useEffect, useState } from "react"
import { Send, Users, User, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { toast } from "sonner"

interface SentNotification {
  id: string
  title: string
  message: string
  createdAt: string
  user: { username: string | null }
}

export default function NotificationsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [target, setTarget] = useState<"all" | "specific">("all")
  const [walletOrUsername, setWalletOrUsername] = useState("")
  const [sending, setSending] = useState(false)
  const [history, setHistory] = useState<SentNotification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = () => {
    fetch("/api/admin/notifications")
      .then((r) => r.ok ? r.json() : [])
      .then(setHistory)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchHistory() }, [])

  const handleSend = async () => {
    if (!title || !message) {
      toast.error("Title and message required")
      return
    }

    setSending(true)
    try {
      const body: Record<string, string> = { title, message, target }
      if (target === "specific") body.userId = walletOrUsername

      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`Notification sent to ${data.sent} user(s)`)
        setTitle("")
        setMessage("")
        setWalletOrUsername("")
        fetchHistory()
      } else {
        toast.error("Failed to send")
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">Notifications</h1>

      <GlassCard variant="accent" className="mb-6">
        <h2 className="font-semibold mb-4">Send Notification</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Target</label>
            <div className="flex gap-2">
              <Button
                variant={target === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTarget("all")}
                className={target === "all" ? "bg-repe-red hover:bg-repe-red/90" : "border-border"}
              >
                <Users className="h-4 w-4 mr-1" /> All Users
              </Button>
              <Button
                variant={target === "specific" ? "default" : "outline"}
                size="sm"
                onClick={() => setTarget("specific")}
                className={target === "specific" ? "bg-repe-red hover:bg-repe-red/90" : "border-border"}
              >
                <User className="h-4 w-4 mr-1" /> Specific User
              </Button>
            </div>
          </div>

          {target === "specific" && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">User ID</label>
              <Input
                value={walletOrUsername}
                onChange={(e) => setWalletOrUsername(e.target.value)}
                placeholder="Enter user ID from Users page"
                className="bg-repe-black border-border"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1.5 block">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" className="bg-repe-black border-border" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="w-full min-h-[100px] rounded-lg bg-repe-black border border-border p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-repe-red"
            />
          </div>

          <Button onClick={handleSend} disabled={sending} className="w-full bg-repe-red hover:bg-repe-red/90">
            <Send className="h-4 w-4 mr-2" /> {sending ? "Sending..." : "Send Notification"}
          </Button>
        </div>
      </GlassCard>

      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">Sent History</h2>
      {loading ? <LoadingSpinner className="py-8" /> : history.length === 0 ? (
        <GlassCard className="text-center py-8">
          <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No notifications sent yet</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {history.map((n) => (
            <GlassCard key={n.id} className="!p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{n.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs text-muted-foreground">{n.user?.username || "Broadcast"}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
