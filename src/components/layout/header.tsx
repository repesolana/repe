"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { shortenAddress } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export function Header() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.ok ? r.json() : { notifications: [], unread: 0 })
      .then((d) => { setNotifications(d.notifications || []); setUnread(d.unread || 0) })
      .catch(() => {})
  }, [])

  const markRead = async () => {
    if (unread === 0) return
    await fetch("/api/notifications", { method: "PATCH" })
    setUnread(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-repe-black/80 backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Image src="/images/logo.png" alt="REPE" width={28} height={28} className="rounded-full" />
        <span className="text-lg font-bold text-gradient-red">REPE</span>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="relative" onClick={markRead}>
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-repe-red border-2 border-repe-black text-[9px] font-bold flex items-center justify-center text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-repe-dark-gray border-border p-0">
            <div className="p-3 border-b border-border">
              <p className="text-sm font-semibold">Notifications</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No notifications</p>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div key={n.id} className={`p-3 border-b border-border last:border-0 ${!n.read ? "bg-repe-red/5" : ""}`}>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {session && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="bg-repe-gray text-xs">
                {(session.user?.name || "?").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm text-muted-foreground">
              {session.user?.name || shortenAddress(session.walletAddress || "")}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
