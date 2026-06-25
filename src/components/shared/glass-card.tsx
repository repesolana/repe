"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "accent" | "highlight"
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  variant = "default",
  hover = false,
  onClick,
}: GlassCardProps) {
  const variants = {
    default: "glass-card",
    accent: "glass-card-accent",
    highlight:
      "glass-card border-repe-red/30 shadow-[0_0_30px_rgba(255,45,45,0.2)]",
  }

  if (hover) {
    return (
      <motion.div
        className={cn(variants[variant], "p-6", className)}
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(variants[variant], "p-6", className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
