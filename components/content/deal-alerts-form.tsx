"use client"

import { useState } from "react"
import { CheckmarkCircle02Icon, Loading03Icon, Notification01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"

export function DealAlertsForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle")

  if (state === "sent") {
    return (
      <p role="status" className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white">
        <Icon icon={CheckmarkCircle02Icon} size={20} className="text-brand-amber" />
        You&apos;re on the list — we&apos;ll email you when new deals go live.
      </p>
    )
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault()
        setState("sending")
        // TODO: POST the email to the deal-alerts / newsletter API.
        await new Promise((r) => setTimeout(r, 700))
        setState("sent")
      }}
    >
      <label htmlFor="deal-alert-email" className="sr-only">
        Email address
      </label>
      <input
        id="deal-alert-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="h-12 min-w-0 flex-1 rounded-xl border-0 bg-white px-4 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-brand-amber/60"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-amber px-6 font-bold text-brand-navy-deep transition outline-none hover:bg-brand-amber/90 focus-visible:ring-3 focus-visible:ring-white/60 disabled:opacity-70"
      >
        <Icon icon={state === "sending" ? Loading03Icon : Notification01Icon} size={18} className={state === "sending" ? "animate-spin" : undefined} />
        {state === "sending" ? "Signing up…" : "Get deal alerts"}
      </button>
    </form>
  )
}
