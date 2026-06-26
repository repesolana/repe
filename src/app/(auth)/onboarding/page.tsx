"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/shared/glass-card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const STEPS = [
  { title: "Username & Email", description: "Set up your basic profile" },
  { title: "Connect Socials", description: "Required for task verification" },
]

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingForm />
    </Suspense>
  )
}

function OnboardingForm() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    xHandle: "",
    telegramHandle: "",
    referralCode: "",
  })

  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) {
      setFormData((prev) => ({ ...prev, referralCode: ref }))
    }
  }, [searchParams])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canAdvance = () => {
    switch (step) {
      case 0:
        return formData.username.length >= 3 && formData.email.includes("@")
      case 1:
        return formData.xHandle.length > 0 && formData.telegramHandle.length > 0
      default:
        return false
    }
  }

  const handleComplete = async () => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast.success("Welcome to REPE! +100 REPE")
        window.location.href = "/"
      } else {
        const err = await res.json()
        toast.error(err.error || "Something went wrong")
      }
    } catch {
      toast.error("Connection error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,45,45,0.08),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="REPE" width={48} height={48} className="mx-auto mb-3 rounded-full" />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">
            Complete Your Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                i <= step ? "bg-repe-red" : "bg-repe-gray"
              )}
            />
          ))}
        </div>

        <GlassCard variant="accent">
          <h2 className="text-lg font-semibold mb-1">{STEPS[step].title}</h2>
          <p className="text-sm text-muted-foreground mb-6">{STEPS[step].description}</p>

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Username</label>
                <Input
                  value={formData.username}
                  onChange={(e) => updateField("username", e.target.value)}
                  placeholder="Choose a username"
                  className="bg-repe-black border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="your@email.com"
                  className="bg-repe-black border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Referral Code <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  value={formData.referralCode}
                  onChange={(e) => updateField("referralCode", e.target.value)}
                  placeholder="Enter referral code"
                  className="bg-repe-black border-border"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">X (Twitter) Handle</label>
                <Input
                  value={formData.xHandle}
                  onChange={(e) => updateField("xHandle", e.target.value)}
                  placeholder="@yourhandle"
                  className="bg-repe-black border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Telegram Username</label>
                <Input
                  value={formData.telegramHandle}
                  onChange={(e) => updateField("telegramHandle", e.target.value)}
                  placeholder="@yourtelegram"
                  className="bg-repe-black border-border"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Required to verify social tasks and earn REPE rewards.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="border-border"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="bg-repe-red hover:bg-repe-red/90"
              >
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={submitting || !canAdvance()}
                className="bg-gradient-to-r from-repe-red to-repe-dark-red hover:from-repe-red/90 hover:to-repe-dark-red/90"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                )}
                Complete Setup
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
