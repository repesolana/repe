"use client"

import { motion } from "framer-motion"
import {
  AtSign,
  MessageCircle,
  Hash,
  Music2,
  Globe,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowRight,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"

const platformIcons: Record<string, React.ElementType> = {
  TWITTER: AtSign,
  TELEGRAM: MessageCircle,
  DISCORD: Hash,
  YOUTUBE: Globe,
  TIKTOK: Music2,
  INSTAGRAM: Globe,
  OTHER: Globe,
  COMMUNITY: Flame,
  ONCHAIN: Globe,
}

interface TaskCardProps {
  id: string
  title: string
  description: string
  category: string
  rewardAmount: number
  actionUrl?: string | null
  status?: "available" | "pending" | "completed"
  onComplete?: (id: string) => void
}

export function TaskCard({
  id,
  title,
  description,
  category,
  rewardAmount,
  actionUrl,
  status = "available",
  onComplete,
}: TaskCardProps) {
  const Icon = platformIcons[category] || Globe

  const handleClick = () => {
    if (actionUrl) {
      window.open(actionUrl, "_blank", "noopener,noreferrer")
    }
    onComplete?.(id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "glass-card p-4 flex items-center gap-4 transition-all",
        status === "completed" && "opacity-60"
      )}
    >
      <div
        className={cn(
          "shrink-0 rounded-xl p-3",
          status === "completed"
            ? "bg-success/10"
            : "bg-repe-red/10"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            status === "completed" ? "text-success" : "text-repe-red"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold truncate">{title}</h3>
          {status === "pending" && (
            <Badge variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-500 border-0">
              Pending
            </Badge>
          )}
          {status === "completed" && (
            <Badge variant="secondary" className="text-[10px] bg-success/10 text-success border-0">
              Done
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {description}
        </p>
      </div>

      <div className="shrink-0 flex items-center gap-3">
        <span className="text-sm font-bold text-repe-red">
          +{formatNumber(rewardAmount)}
        </span>
        {status === "available" && (
          <Button
            size="sm"
            onClick={handleClick}
            className="bg-repe-red/10 text-repe-red hover:bg-repe-red hover:text-white border-0 gap-1"
          >
            {actionUrl ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        )}
        {status === "completed" && (
          <CheckCircle2 className="h-5 w-5 text-success" />
        )}
        {status === "pending" && (
          <Clock className="h-5 w-5 text-yellow-500" />
        )}
      </div>
    </motion.div>
  )
}
