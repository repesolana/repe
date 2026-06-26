"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useCallback, useState } from "react"
import { signIn } from "next-auth/react"
import bs58 from "bs58"

export function useWalletAuth() {
  const { publicKey, signMessage, connected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authenticate = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setError("Please connect your wallet first")
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const wallet = publicKey.toBase58()

      const nonceRes = await fetch(`/api/auth/nonce?wallet=${wallet}`)
      if (!nonceRes.ok) {
        setError("Failed to get login nonce")
        return false
      }
      const { message } = await nonceRes.json()

      const messageBytes = new TextEncoder().encode(message)
      const signatureBytes = await signMessage(messageBytes)
      const signature = bs58.encode(signatureBytes)

      const result = await signIn("solana", {
        wallet,
        signature,
        message,
        redirect: false,
      })

      if (result?.error) {
        setError("Wallet verification failed")
        return false
      }

      const urlParams = new URLSearchParams(window.location.search)
      const ref = urlParams.get("ref")
      window.location.href = ref ? `/onboarding?ref=${ref}` : "/onboarding"
      return true
    } catch (err: any) {
      setError(err?.message || "Authentication failed")
      return false
    } finally {
      setLoading(false)
    }
  }, [publicKey, signMessage])

  return { authenticate, loading, error, connected, publicKey }
}
