"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { shortenAddress } from "@/lib/utils"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-repe-black/80 backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Image src="/images/logo.png" alt="REPE" width={28} height={28} className="rounded-full" />
        <span className="text-lg font-bold text-gradient-red">REPE</span>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-repe-red border-2 border-repe-black" />
        </Button>

        {session && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="bg-repe-gray text-xs">
                {(session.user?.name || "?").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm text-muted-foreground">
              {session.user?.name ||
                shortenAddress(session.walletAddress || "")}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
