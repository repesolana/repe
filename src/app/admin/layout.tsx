"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { adminNavItems } from "@/config/navigation"
import { ArrowLeft } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-border bg-repe-black">
        <div className="flex h-16 items-center gap-2 px-6">
          <Image src="/images/logo.png" alt="REPE" width={28} height={28} className="rounded-full" />
          <span className="text-lg font-bold text-gradient-red">REPE Admin</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-repe-red/10 text-repe-red"
                    : "text-muted-foreground hover:bg-repe-gray hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-repe-black/80 backdrop-blur-xl px-6">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
