import Link from "next/link"
import type { IconSvgElement } from "@hugeicons/react"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type SummaryDetail = { icon: IconSvgElement; label: string; value: string }

/**
 * Compact navy band at the top of every results page. Sits under the
 * transparent site header, so it carries its own top padding.
 */
export function SearchBand({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("relative overflow-hidden bg-brand-navy px-4 pt-28 pb-10 text-white sm:pt-32", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_90%_0%,rgba(61,145,255,0.4),transparent_60%),radial-gradient(40%_70%_at_0%_100%,rgba(251,184,31,0.12),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

/** White summary card: what was searched, plus an "Edit search" link. */
export function SearchSummary({
  icon,
  eyebrow,
  title,
  subtitle,
  details,
  editHref,
  editLabel = "Edit search",
}: {
  icon: IconSvgElement
  eyebrow: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  details: SummaryDetail[]
  editHref: string
  editLabel?: string
}) {
  return (
    <div className="rounded-3xl bg-card p-5 text-foreground shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-brand-navy">
            <Icon icon={icon} size={24} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">{eyebrow}</p>
            <h1 className="mt-1 text-xl font-extrabold text-brand-navy sm:text-2xl">{title}</h1>
            {subtitle && <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>}
          </div>
        </div>
        <Button
          nativeButton={false}
          render={<Link href={editHref} />}
          className="h-11 shrink-0 self-start rounded-full bg-brand-amber px-5 font-bold text-brand-navy-deep hover:bg-brand-amber/90 lg:self-center"
        >
          <Icon icon={PencilEdit01Icon} size={18} />
          {editLabel}
        </Button>
      </div>
      {details.length > 0 && (
        <dl className="mt-5 grid grid-cols-2 gap-2 border-t pt-5 sm:gap-3 lg:grid-cols-4">
          {details.map((d) => (
            <div key={d.label} className="flex items-center gap-2.5 rounded-2xl bg-muted/60 px-3 py-3 sm:gap-3 sm:px-4">
              <Icon icon={d.icon} size={20} className="shrink-0 text-brand-blue-strong" />
              <div className="min-w-0">
                <dt className="text-xs font-semibold text-muted-foreground">{d.label}</dt>
                <dd className="truncate text-sm font-bold">{d.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

/** Placeholder shown in the band while search params stream in. */
export function SearchSummarySkeleton() {
  return (
    <div className="rounded-3xl bg-card p-5 sm:p-6" aria-hidden>
      <div className="flex items-start gap-4">
        <span className="size-12 shrink-0 animate-pulse rounded-2xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-2/3 max-w-80 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 border-t pt-5 sm:gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted/70" />
        ))}
      </div>
    </div>
  )
}
