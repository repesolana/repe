"use client"

import { useQuery } from "@tanstack/react-query"

export function useLeaderboard(period = "all-time", page = 1, search = "") {
  return useQuery({
    queryKey: ["leaderboard", period, page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ period, page: String(page), search })
      const res = await fetch(`/api/leaderboard?${params}`)
      if (!res.ok) throw new Error("Failed to fetch leaderboard")
      return res.json()
    },
    refetchInterval: 30000,
  })
}
