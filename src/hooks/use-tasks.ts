"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useTasks(category?: string) {
  return useQuery({
    queryKey: ["tasks", category],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (category && category !== "all") params.set("category", category)
      const res = await fetch(`/api/tasks?${params}`)
      if (!res.ok) throw new Error("Failed to fetch tasks")
      return res.json()
    },
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, proofUrl }: { taskId: string; proofUrl?: string }) => {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofUrl }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to complete task")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}
