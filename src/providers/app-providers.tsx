"use client"

import { SolanaWalletProvider } from "./wallet-provider"
import { SessionProvider } from "./session-provider"
import { QueryProvider } from "./query-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <SolanaWalletProvider>
          <TooltipProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#141414",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#EDEDED",
                },
              }}
            />
          </TooltipProvider>
        </SolanaWalletProvider>
      </SessionProvider>
    </QueryProvider>
  )
}
