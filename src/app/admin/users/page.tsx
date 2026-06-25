"use client"

import { Search, Ban, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatNumber, shortenAddress } from "@/lib/utils"
import { useState } from "react"

const DEMO_USERS = [
  { id: "1", username: "CryptoKing", wallet: "8xK2nQpV...mNp4", email: "king@example.com", balance: 45000, role: "USER", status: "active" },
  { id: "2", username: "SolanaFan42", wallet: "3vRtYmPl...yQ7z", email: "fan@example.com", balance: 32000, role: "USER", status: "active" },
  { id: "3", username: "WhaleTrader", wallet: "Lm5NkRp3...xRk9", email: "whale@example.com", balance: 125000, role: "MODERATOR", status: "active" },
  { id: "4", username: "SpamBot99", wallet: "9pWqAzXc...aB2c", email: "spam@test.com", balance: 500, role: "USER", status: "banned" },
  { id: "5", username: "MoonBoy", wallet: "Kp7VnTxR...dF8m", email: "moon@example.com", balance: 8900, role: "USER", status: "active" },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")

  const filtered = DEMO_USERS.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Users</h1>
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

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-[1fr_150px_100px_100px_100px] gap-4 p-3 text-xs font-medium text-muted-foreground border-b border-border">
          <span>User</span>
          <span>Wallet</span>
          <span>Balance</span>
          <span>Role</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((user) => (
            <div key={user.id} className="grid grid-cols-[1fr_150px_100px_100px_100px] gap-4 p-3 items-center text-sm hover:bg-white/[0.02]">
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{user.wallet}</span>
              <span className="font-mono text-repe-red">{formatNumber(user.balance)}</span>
              <Badge
                className={`border-0 w-fit ${
                  user.role === "ADMIN"
                    ? "bg-repe-red/10 text-repe-red"
                    : user.role === "MODERATOR"
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {user.role}
              </Badge>
              <div className="flex gap-1">
                {user.status === "active" ? (
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                    <Ban className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Badge className="bg-destructive/10 text-destructive border-0">Banned</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
