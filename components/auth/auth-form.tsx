"use client"

import { useState } from "react"
import { CheckmarkCircle02Icon, InformationCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Shell for the log in / sign up / reset forms: heading, loading state and an
 * honest result. Until the accounts API is connected, `notice` is shown after
 * submit (the form stays put), or `success` replaces the form when given.
 */
export function AuthForm({
  title,
  description,
  submitLabel,
  pendingLabel = "Please wait…",
  notice,
  success,
  footer,
  children,
  className,
}: {
  title: string
  description?: React.ReactNode
  submitLabel: string
  pendingLabel?: string
  /** Subtle message shown under the button after submit (form stays visible). */
  notice?: string
  /** Replaces the form after submit. Receives the submitted data. */
  success?: (data: FormData) => { title: string; body: React.ReactNode }
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle")
  const [result, setResult] = useState<{ title: string; body: React.ReactNode } | null>(null)

  if (state === "done" && result) {
    return (
      <div className={cn("text-center", className)} role="status">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#5fb042]/15 text-[#3d8a26]">
          <Icon icon={CheckmarkCircle02Icon} size={34} />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-navy">{result.title}</h1>
        <div className="mx-auto mt-2 max-w-sm text-muted-foreground">{result.body}</div>
        {footer && <div className="mt-8 text-sm text-muted-foreground">{footer}</div>}
      </div>
    )
  }

  return (
    <div className={className}>
      <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{title}</h1>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      <form
        className="mt-8 grid gap-5"
        onSubmit={async (e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          setState("sending")
          // TODO: call the accounts API here (sign in / sign up / password reset).
          await new Promise((r) => setTimeout(r, 900))
          if (success) {
            setResult(success(data))
          }
          setState("done")
        }}
      >
        {children}
        <Button
          type="submit"
          disabled={state === "sending"}
          className="mt-1 h-12 w-full rounded-xl bg-brand-amber text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90"
        >
          {state === "sending" && <Icon icon={Loading03Icon} size={18} className="animate-spin" />}
          {state === "sending" ? pendingLabel : submitLabel}
        </Button>
        {state === "done" && notice && (
          <p role="status" className="flex items-start gap-2 rounded-xl bg-brand-mist px-4 py-3 text-sm text-muted-foreground">
            <Icon icon={InformationCircleIcon} size={18} className="mt-0.5 shrink-0 text-brand-blue-strong" />
            {notice}
          </p>
        )}
      </form>
      {footer && <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  )
}
