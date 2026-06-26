"use client"

import { useEffect, useState } from "react"
import { Search, Ban, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { formatNumber, shortenAddress } from "@/lib/utils"
import { toast } from "sonner"

interface UserRow {
  id: string
  username: string | null
  walletAddress: string
  email: string | null
  role: string
  currentBalance: number
  isBanned: boolean
  createdAt: string
  _count: { taskCompletions: number; referrals: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchUsers = (q = "") => {
    setLoading(true)
    const params = q ? `?search=${encodeURIComponent(q)}` : ""
    fetch(`/api/admin/users${params}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setUsers)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSearch = () => fetchUsers(search)

  const handleBan = async (id: string, ban: boolean) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: ban }),
    })
    if (res.ok) { toast.success(ban ? "User banned" : "User unbanned"); fetchUsers(search) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Users</h1>
        <div className="relative flex gap-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 bg-repe-dark-gray border-border w-60"
          />
        </div>
      </div>

      {loading ? <LoadingSpinner className="py-20" size="lg" /> : (
        <div className="glass-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_120px_100px_80px_80px] gap-4 p-3 text-xs font-medium text-muted-foreground border-b border-border">
            <span>User</span><span>Wallet</span><span>Balance</span><span>Role</span><span>Actions</span>
          </div>
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div key={user.id} className="sm:grid grid-cols-[1fr_120px_100px_80px_80px] gap-4 p-3 items-center text-sm hover:bg-white/[0.02]">
                <div>
                  <p className="font-medium">{user.username || "—"}</p>
                  <p className="text-xs text-muted-foreground">{user.email || "no email"}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground hidden sm:block">{shortenAddress(user.walletAddress)}</span>
                <span className="font-mono text-repe-red">{formatNumber(user.currentBalance)}</span>
                <Badge className={`border-0 w-fit ${user.role === "ADMIN" ? "bg-repe-red/10 text-repe-red" : "bg-muted text-muted-foreground"}`}>{user.role}</Badge>
                <div>
                  {user.isBanned ? (
                    <Button size="sm" variant="outline" className="text-xs border-border" onClick={() => handleBan(user.id, false)}>
                      <ShieldCheck className="h-3 w-3 mr-1" /> Unban
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" className="text-xs text-destructive" onClick={() => handleBan(user.id, true)}>
                      <Ban className="h-3 w-3 mr-1" /> Ban
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
