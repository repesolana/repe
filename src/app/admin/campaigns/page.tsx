"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"

const DEMO_CAMPAIGNS = [
  { id: "1", title: "Launch Campaign", status: "ACTIVE", tasks: 8, budget: 50000, spent: 32000 },
  { id: "2", title: "Twitter Growth", status: "ACTIVE", tasks: 5, budget: 25000, spent: 12000 },
  { id: "3", title: "Community Building", status: "DRAFT", tasks: 3, budget: 15000, spent: 0 },
  { id: "4", title: "Early Adopter Rewards", status: "COMPLETED", tasks: 10, budget: 100000, spent: 100000 },
]

const statusColors: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success",
  DRAFT: "bg-yellow-500/10 text-yellow-500",
  COMPLETED: "bg-muted text-muted-foreground",
  PAUSED: "bg-orange-500/10 text-orange-500",
}

export default function CampaignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Campaigns</h1>
        <Button className="bg-repe-red hover:bg-repe-red/90">
          <Plus className="h-4 w-4 mr-2" /> New Campaign
        </Button>
      </div>

      <div className="space-y-4">
        {DEMO_CAMPAIGNS.map((campaign) => (
          <GlassCard key={campaign.id} className="!p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{campaign.title}</h3>
              <p className="text-sm text-muted-foreground">{campaign.tasks} tasks</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-mono">{campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">REPE Budget</p>
              </div>
              <Badge className={`border-0 ${statusColors[campaign.status]}`}>
                {campaign.status}
              </Badge>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
