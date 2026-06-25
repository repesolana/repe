"use client"

import { Send, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { toast } from "sonner"

export default function NotificationsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [target, setTarget] = useState<"all" | "specific">("all")

  const handleSend = () => {
    if (!title || !message) {
      toast.error("Please fill in all fields")
      return
    }
    toast.success("Notification sent successfully")
    setTitle("")
    setMessage("")
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">
        Send Notification
      </h1>

      <GlassCard className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Target Audience</label>
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
              <label className="text-sm font-medium mb-1.5 block">Username or Wallet</label>
              <Input placeholder="Enter username or wallet address" className="bg-repe-black border-border" />
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1.5 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              className="bg-repe-black border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notification message..."
              className="w-full min-h-[100px] rounded-lg bg-repe-black border border-border p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-repe-red"
            />
          </div>

          <Button onClick={handleSend} className="w-full bg-repe-red hover:bg-repe-red/90">
            <Send className="h-4 w-4 mr-2" /> Send Notification
          </Button>
        </div>
      </GlassCard>

      {/* Recent Notifications */}
      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">
        Recent Notifications
      </h2>
      <div className="space-y-3">
        {[
          { title: "New Campaign Live!", message: "Check out our latest Twitter growth campaign", target: "All Users", time: "2 hours ago" },
          { title: "Maintenance Notice", message: "Brief downtime scheduled for tonight", target: "All Users", time: "1 day ago" },
          { title: "Reward Bonus", message: "Double REPE weekend is here!", target: "All Users", time: "3 days ago" },
        ].map((notif, i) => (
          <GlassCard key={i} className="!p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">{notif.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <Badge variant="secondary" className="border-0 text-[10px]">{notif.target}</Badge>
                <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
