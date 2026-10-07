import Link from "next/link"
import type { IconSvgElement } from "@hugeicons/react"
import { Call02Icon, CustomerSupportIcon, Mail01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { CONTACT } from "@/lib/data/site"
import { cn } from "@/lib/utils"

/** Pulsing result cards shown while a search "loads". */
export function ResultsSkeleton({ rows = 3, label = "Searching…" }: { rows?: number; label?: string }) {
  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <span className="size-2 animate-pulse rounded-full bg-brand-amber" />
        {label}
      </p>
      <div className="grid gap-4" aria-hidden>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex flex-col gap-5 rounded-3xl border bg-card p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="size-14 shrink-0 animate-pulse rounded-2xl bg-muted" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted/70" />
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-muted/70" />
            </div>
            <div className="h-11 w-full animate-pulse rounded-full bg-muted sm:w-36" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Honest empty state for results pages: no live inventory is connected yet,
 * so we point people to the team who can book it by phone or email.
 */
export function EmptyResults({
  icon,
  badge,
  title,
  body,
  phones = [CONTACT.main, CONTACT.emergency],
  email = CONTACT.emails.info,
  actions,
  children,
  className,
}: {
  icon: IconSvgElement
  /** Primary actions shown right under the message, above the contact panel. */
  actions?: React.ReactNode
  badge?: string
  title: string
  body: React.ReactNode
  phones?: { display: string; tel: string }[]
  email?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-3xl border bg-card p-6 text-center sm:p-12", className)}>
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-brand-navy">
        <Icon icon={icon} size={30} />
      </span>
      {badge && (
        <p className="mx-auto mt-5 w-fit rounded-full bg-brand-mist px-3 py-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          {badge}
        </p>
      )}
      <h2 className="mt-3 text-2xl font-extrabold text-brand-navy text-balance">{title}</h2>
      <div className="mx-auto mt-2 max-w-lg text-muted-foreground text-pretty">{body}</div>
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}

      <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-brand-mist p-5 text-left sm:p-6">
        <p className="flex items-center gap-2 font-bold text-brand-navy">
          <Icon icon={CustomerSupportIcon} size={22} className="text-brand-blue-strong" />
          Our team can book this for you now
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Call or email us with your trip details and a travel expert will find you the best available option — 24/7.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {phones.map((p, i) => (
            <Button
              key={p.tel}
              nativeButton={false}
              render={<a href={`tel:${p.tel}`} />}
              className={cn(
                "h-11 rounded-full px-5 font-bold",
                i === 0 ? "bg-brand-amber text-brand-navy-deep hover:bg-brand-amber/90" : "bg-brand-navy text-white hover:bg-brand-navy/90"
              )}
            >
              <Icon icon={Call02Icon} size={18} />
              {p.display}
            </Button>
          ))}
          <Button nativeButton={false} variant="outline" render={<a href={`mailto:${email}`} />} className="h-11 rounded-full bg-card px-5 font-bold">
            <Icon icon={Mail01Icon} size={18} />
            {email}
          </Button>
        </div>
      </div>
      {children}
    </div>
  )
}

/** Small link back to the planner, used under empty states. */
export function BackToSearch({ href = "/#plan", label = "Start a new search" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="mt-6 inline-block text-sm font-semibold text-brand-blue-strong underline-offset-4 hover:underline">
      {label}
    </Link>
  )
}
