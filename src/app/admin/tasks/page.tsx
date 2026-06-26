"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { formatNumber } from "@/lib/utils"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string
  type: string
  category: string
  rewardAmount: number
  status: string
  verificationMethod: string
  _count: { completions: number }
}

const EMPTY_FORM = {
  title: "", description: "", type: "SOCIAL", category: "TWITTER", platform: "",
  rewardAmount: 100, verificationMethod: "SELF_REPORT", status: "ACTIVE", priority: 0,
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const fetchTasks = () => {
    fetch("/api/admin/tasks")
      .then((r) => r.ok ? r.json() : [])
      .then(setTasks)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTasks() }, [])

  const handleSubmit = async () => {
    const url = editId ? `/api/admin/tasks/${editId}` : "/api/admin/tasks"
    const method = editId ? "PATCH" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rewardAmount: Number(form.rewardAmount), priority: Number(form.priority) }),
    })
    if (res.ok) {
      toast.success(editId ? "Task updated" : "Task created")
      setShowForm(false)
      setEditId(null)
      setForm(EMPTY_FORM)
      fetchTasks()
    } else {
      toast.error("Failed")
    }
  }

  const handleEdit = (task: Task) => {
    setForm({
      title: task.title, description: task.description, type: task.type,
      category: task.category, platform: "", rewardAmount: task.rewardAmount,
      verificationMethod: task.verificationMethod, status: task.status, priority: 0,
    })
    setEditId(task.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return
    const res = await fetch(`/api/admin/tasks/${id}`, { method: "DELETE" })
    if (res.ok) { toast.success("Task deleted"); fetchTasks() }
  }

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Tasks</h1>
        <Button className="bg-repe-red hover:bg-repe-red/90" onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>

      {showForm && (
        <GlassCard variant="accent" className="mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">{editId ? "Edit Task" : "Create Task"}</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium mb-1 block">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-repe-black border-border" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium mb-1 block">Description</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-repe-black border-border" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-9 rounded-md bg-repe-black border border-border px-3 text-sm">
                {["SOCIAL","CONTENT","COMMUNITY","ONCHAIN","QUIZ","REFERRAL","DAILY","CUSTOM"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-9 rounded-md bg-repe-black border border-border px-3 text-sm">
                {["TWITTER","TELEGRAM","DISCORD","YOUTUBE","TIKTOK","INSTAGRAM","REDDIT","ONCHAIN","COMMUNITY","OTHER"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Reward (REPE)</label>
              <Input type="number" value={form.rewardAmount} onChange={(e) => setForm({ ...form, rewardAmount: Number(e.target.value) })} className="bg-repe-black border-border" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Verification</label>
              <select value={form.verificationMethod} onChange={(e) => setForm({ ...form, verificationMethod: e.target.value })} className="w-full h-9 rounded-md bg-repe-black border border-border px-3 text-sm">
                {["AUTOMATIC","MANUAL","SELF_REPORT","PROOF_UPLOAD","LINK_SUBMIT"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-9 rounded-md bg-repe-black border border-border px-3 text-sm">
                {["ACTIVE","DRAFT","PAUSED","COMPLETED"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <Button className="mt-4 bg-repe-red hover:bg-repe-red/90" onClick={handleSubmit}>
            {editId ? "Save Changes" : "Create Task"}
          </Button>
        </GlassCard>
      )}

      <div className="glass-card overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_100px_80px_100px_80px_80px] gap-4 p-3 text-xs font-medium text-muted-foreground border-b border-border">
          <span>Task</span><span>Type</span><span>Reward</span><span>Completions</span><span>Status</span><span></span>
        </div>
        <div className="divide-y divide-border">
          {tasks.map((task) => (
            <div key={task.id} className="sm:grid grid-cols-[1fr_100px_80px_100px_80px_80px] gap-4 p-3 items-center text-sm hover:bg-white/[0.02]">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.category}</p>
              </div>
              <Badge variant="secondary" className="w-fit border-0 hidden sm:inline-flex">{task.type}</Badge>
              <span className="text-repe-red font-mono font-medium">+{formatNumber(task.rewardAmount)}</span>
              <span className="font-mono text-muted-foreground hidden sm:block">{task._count.completions}</span>
              <Badge className={`w-fit border-0 ${task.status === "ACTIVE" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{task.status}</Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(task)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(task.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
