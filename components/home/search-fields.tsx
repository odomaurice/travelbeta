"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/** Shared look for the big tappable fields in the search card. */
export const fieldButton =
  "flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent data-popup-open:bg-muted"

export const dateFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" })

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

export function isBeforeToday(day: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return day < today
}

export function FieldText({ label, value, placeholder }: { label: string; value?: string; placeholder: string }) {
  return (
    <span className="min-w-0">
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      <span className={cn("block truncate font-bold", !value && "font-semibold text-muted-foreground/80")}>{value ?? placeholder}</span>
    </span>
  )
}

export function DateField({
  label,
  value,
  onChange,
  disabled,
  disabledText,
  minDate,
  className,
}: {
  label: string
  value?: Date
  onChange: (d: Date | undefined) => void
  disabled?: boolean
  disabledText?: string
  minDate?: Date
  className?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} className={cn(fieldButton, className)}>
        <Icon icon={Calendar03Icon} size={18} className="shrink-0 text-brand-navy" />
        <FieldText label={label} value={disabled ? disabledText : value && dateFmt.format(value)} placeholder="Add date" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value ?? minDate}
          onSelect={(d) => {
            onChange(d)
            setOpen(false)
          }}
          disabled={(d) => isBeforeToday(d) || (!!minDate && d < minDate)}
        />
      </PopoverContent>
    </Popover>
  )
}

/** Check-in / check-out picked in one calendar. */
export function DateRangeField({
  labels,
  value,
  onChange,
}: {
  labels: [string, string]
  value?: DateRange
  onChange: (r: DateRange | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(fieldButton, "gap-0 p-0 hover:bg-transparent data-popup-open:bg-transparent")}>
        {[value?.from, value?.to].map((d, i) => (
          <span key={i} className={cn("flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 hover:bg-muted", i === 1 && "border-l")}>
            <Icon icon={Calendar03Icon} size={18} className="shrink-0 text-brand-navy" />
            <FieldText label={labels[i]} value={d && dateFmt.format(d)} placeholder="Add date" />
          </span>
        ))}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={value}
          onSelect={(r) => {
            onChange(r)
            if (r?.from && r?.to && r.from.getTime() !== r.to.getTime()) setOpen(false)
          }}
          disabled={isBeforeToday}
          className="[&_.rdp-months]:flex-col sm:[&_.rdp-months]:flex-row"
        />
      </PopoverContent>
    </Popover>
  )
}

export type CounterSpec = {
  label: string
  hint: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}

export function Counter({ label, hint, value, min, max, onChange }: CounterSpec) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon-sm" className="rounded-full" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`Fewer ${label.toLowerCase()}`}>
          −
        </Button>
        <span className="w-5 text-center font-bold tabular-nums" aria-live="polite">
          {value}
        </span>
        <Button type="button" variant="outline" size="icon-sm" className="rounded-full" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`More ${label.toLowerCase()}`}>
          +
        </Button>
      </div>
    </div>
  )
}

/** Popover with +/- counters (travellers, rooms, guests). */
export function CountersPopover({
  icon,
  summary,
  counters,
  children,
  className,
}: {
  icon: React.ComponentProps<typeof Icon>["icon"]
  summary: string
  counters: CounterSpec[]
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 data-popup-open:bg-muted",
          className
        )}
      >
        <Icon icon={icon} size={16} />
        {summary}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 gap-4 p-4">
        {counters.map((c) => (
          <Counter key={c.label} {...c} />
        ))}
        {children}
      </PopoverContent>
    </Popover>
  )
}
