"use client"

import Image from "next/image"
import { Wallet, Shield, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/glass-card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,45,45,0.1),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-repe-red/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-repe-dark-red/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
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

        {/* Connect Wallet Card */}
        <GlassCard variant="accent" className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-center">Connect Wallet</h2>
          <div className="space-y-3">
            <Button
              className="w-full h-12 bg-repe-gray hover:bg-repe-light-gray border border-border justify-start gap-3 text-foreground"
              variant="outline"
            >
              <div className="h-7 w-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-purple-400" />
              </div>
              Phantom
            </Button>
            <Button
              className="w-full h-12 bg-repe-gray hover:bg-repe-light-gray border border-border justify-start gap-3 text-foreground"
              variant="outline"
            >
              <div className="h-7 w-7 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-orange-400" />
              </div>
              Solflare
            </Button>
            <Button
              className="w-full h-12 bg-repe-gray hover:bg-repe-light-gray border border-border justify-start gap-3 text-foreground"
              variant="outline"
            >
              <div className="h-7 w-7 rounded-full bg-red-500/20 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-red-400" />
              </div>
              Backpack
            </Button>
            <Button
              className="w-full h-12 bg-repe-gray hover:bg-repe-light-gray border border-border justify-start gap-3 text-foreground"
              variant="outline"
            >
              <div className="h-7 w-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-blue-400" />
              </div>
              Trust Wallet
            </Button>
          </div>
        </GlassCard>

        {/* Features */}
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
