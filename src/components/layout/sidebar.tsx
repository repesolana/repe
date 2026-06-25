"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { mainNavItems } from "@/config/navigation"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-border bg-repe-black">
      <div className="flex h-16 items-center gap-2 px-6">
        <Image src="/images/logo.png" alt="REPE" width={36} height={36} className="rounded-full" />
        <span className="text-xl font-bold text-gradient-red font-[var(--font-display)]">
          REPE
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {mainNavItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
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
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-muted-foreground">Powered by</p>
          <p className="text-sm font-bold text-repe-red">Solana</p>
        </div>
      </div>
    </aside>
  )
}
