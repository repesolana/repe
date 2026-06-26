"use client"

import Image from "next/image"
import { Shield, Zap, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/glass-card"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { useEffect } from "react"

export default function LoginPage() {
  const { setVisible } = useWalletModal()
  const { connected, wallet } = useWallet()
  const { authenticate, loading, error } = useWalletAuth()

  useEffect(() => {
    if (connected) {
      authenticate()
    }
  }, [connected, authenticate])

  const handleConnect = () => {
    setVisible(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,45,45,0.1),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-repe-red/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-repe-dark-red/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-repe-red/20 blur-xl animate-pulse" />
              <Image src="/images/logo.png" alt="REPE" width={80} height={80} className="relative rounded-full border border-repe-red/20" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient-red font-[family-name:var(--font-display)]">
            REPE
          </h1>
          <p className="mt-2 text-muted-foreground">
            Connect your wallet to start earning
          </p>
        </div>

        <GlassCard variant="accent" className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-center">Connect Wallet</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-repe-red" />
              <p className="text-sm text-muted-foreground">Verifying wallet...</p>
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              className="w-full h-14 bg-gradient-to-r from-repe-red to-repe-dark-red hover:from-repe-red/90 hover:to-repe-dark-red/90 text-white font-semibold text-base"
            >
              {connected ? "Signing in..." : "Connect Solana Wallet"}
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center mt-4">
            Supports Phantom, Solflare, Backpack, Trust Wallet
          </p>
        </GlassCard>

        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3 text-center">
            <Zap className="h-5 w-5 mx-auto mb-1 text-repe-red" />
            <p className="text-[10px] text-muted-foreground">Earn Rewards</p>
          </div>
          <div className="glass-card p-3 text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-repe-red" />
            <p className="text-[10px] text-muted-foreground">Community</p>
          </div>
          <div className="glass-card p-3 text-center">
            <Shield className="h-5 w-5 mx-auto mb-1 text-repe-red" />
            <p className="text-[10px] text-muted-foreground">Secure</p>
          </div>
        </div>
      </div>
    </div>
  )
}
