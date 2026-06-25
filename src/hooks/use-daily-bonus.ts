"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useClaimDailyBonus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/rewards/daily", { method: "POST" })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to claim daily bonus")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}
