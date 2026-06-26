"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "./task-card"
import { EmptyState } from "@/components/shared/empty-state"
import { ListTodo } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  category: string
  rewardAmount: number
  verificationUrl?: string | null
  completionStatus?: string | null
}

interface ActiveTasksProps {
  tasks: Task[]
  onCompleteTask: (id: string) => void
}

export function ActiveTasks({ tasks, onCompleteTask }: ActiveTasksProps) {
  const availableTasks = tasks.filter((t) => !t.completionStatus)
  const socialTasks = availableTasks.filter(
    (t) =>
      t.category === "TWITTER" ||
      t.category === "TELEGRAM" ||
      t.category === "DISCORD" ||
      t.category === "YOUTUBE" ||
      t.category === "TIKTOK" ||
      t.category === "INSTAGRAM" ||
      t.category === "REDDIT"
  )
  const communityTasks = availableTasks.filter(
    (t) => t.category === "COMMUNITY" || t.category === "OTHER"
  )

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)]">
        Active Tasks
      </h2>
      <Tabs defaultValue="all">
        <TabsList className="bg-repe-dark-gray border border-border mb-4">
          <TabsTrigger value="all">All ({availableTasks.length})</TabsTrigger>
          <TabsTrigger value="social">Social ({socialTasks.length})</TabsTrigger>
          <TabsTrigger value="community">
            Community ({communityTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {availableTasks.length > 0 ? (
            availableTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                category={task.category}
                rewardAmount={task.rewardAmount}
                actionUrl={task.verificationUrl}
                status="available"
                onComplete={onCompleteTask}
              />
            ))
          ) : (
            <EmptyState
              icon={ListTodo}
              title="No tasks available"
              description="Check back later for new tasks and opportunities to earn REPE."
            />
          )}
        </TabsContent>

        <TabsContent value="social" className="space-y-3">
          {socialTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              category={task.category}
              rewardAmount={task.rewardAmount}
              status="available"
              onComplete={onCompleteTask}
            />
          ))}
        </TabsContent>

        <TabsContent value="community" className="space-y-3">
          {communityTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              category={task.category}
              rewardAmount={task.rewardAmount}
              status="available"
              onComplete={onCompleteTask}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
