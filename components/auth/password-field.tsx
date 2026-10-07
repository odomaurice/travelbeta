"use client"

import { useId, useState } from "react"
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const control =
  "h-12 w-full rounded-xl border-input bg-background pr-12 pl-4 text-[15px] shadow-none focus-visible:border-brand-blue focus-visible:ring-brand-blue/20"

const STRENGTH = [
  { label: "Too short", bar: "bg-destructive", text: "text-destructive" },
  { label: "Weak", bar: "bg-destructive", text: "text-destructive" },
  { label: "Fair", bar: "bg-brand-amber", text: "text-[#9a6b00]" },
  { label: "Good", bar: "bg-brand-blue", text: "text-brand-blue-strong" },
  { label: "Strong", bar: "bg-[#5fb042]", text: "text-[#3d8a26]" },
]

function strengthOf(value: string, min: number) {
  if (value.length < min) return 0
  let score = 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++
  if (/\d/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 14) score++
  return Math.min(score, 4)
}

/** Password input with a show/hide toggle, styled to match form-kit fields. */
export function PasswordField({
  label = "Password",
  name = "password",
  required = true,
  minLength,
  autoComplete = "current-password",
  hint,
  showStrength = false,
  labelAside,
  full,
  className,
}: {
  label?: string
  name?: string
  required?: boolean
  minLength?: number
  autoComplete?: "current-password" | "new-password"
  hint?: string
  /** Show a strength meter (for sign-up / registration). */
  showStrength?: boolean
  /** Element shown at the right of the label row, e.g. a "Forgot password?" link. */
  labelAside?: React.ReactNode
  /** Span both columns of the RequestForm grid. */
  full?: boolean
  className?: string
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState("")
  const min = minLength ?? 0
  const strength = STRENGTH[strengthOf(value, min)]
  const level = strengthOf(value, min)

  return (
    <Field className={cn("gap-2", full && "sm:col-span-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
          {required && (
            <span className="text-destructive" aria-hidden>
              {" "}
              *
            </span>
          )}
        </FieldLabel>
        {labelAside}
      </div>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          aria-describedby={hint || showStrength ? hintId : undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={control}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={id}
          className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-brand-navy focus-visible:ring-3 focus-visible:ring-brand-blue/30 focus-visible:outline-none"
        >
          <Icon icon={visible ? ViewOffSlashIcon : ViewIcon} size={20} />
        </button>
      </div>
      {showStrength ? (
        <div id={hintId} className="space-y-1.5">
          <div className="grid grid-cols-4 gap-1.5" aria-hidden>
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={cn("h-1.5 rounded-full bg-muted transition-colors", value && level >= i && strength.bar)} />
            ))}
          </div>
          <FieldDescription className="flex justify-between gap-2 text-xs">
            <span>{hint ?? (min ? `Minimum of ${min} characters` : undefined)}</span>
            {value && <span className={cn("font-semibold", strength.text)}>{strength.label}</span>}
          </FieldDescription>
        </div>
      ) : (
        hint && (
          <FieldDescription id={hintId} className="text-xs">
            {hint}
          </FieldDescription>
        )
      )}
    </Field>
  )
}
