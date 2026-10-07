import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { cn } from "@/lib/utils"

/**
 * Navy page header shared by every inner page. It sits under the transparent
 * site header, so it includes top padding for it.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  className,
  overlap = false,
}: {
  eyebrow?: string
  title: string
  description?: string
  /** Breadcrumb trail after "Home". */
  crumbs?: { label: string; href?: string }[]
  children?: React.ReactNode
  className?: string
  /** Leave extra bottom space for a card that overlaps the hero. */
  overlap?: boolean
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-brand-navy px-4 pt-36 text-white sm:pt-40",
        overlap ? "pb-32 sm:pb-36" : "pb-16 sm:pb-20",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_90%_0%,rgba(61,145,255,0.4),transparent_60%),radial-gradient(40%_60%_at_0%_100%,rgba(251,184,31,0.12),transparent_60%)]"
      />
      {/* dotted flight arc motif */}
      <svg aria-hidden viewBox="0 0 600 200" className="pointer-events-none absolute -right-20 bottom-0 hidden w-[640px] opacity-40 md:block">
        <path d="M10 190 Q300 -60 590 150" fill="none" stroke="white" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
        <circle cx="590" cy="150" r="6" fill="var(--brand-amber)" />
      </svg>
      <div className="relative mx-auto max-w-6xl">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-white/65">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <Icon icon={ArrowRight01Icon} size={14} />
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="text-xs font-bold tracking-widest text-brand-amber uppercase">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-white/75 text-pretty">{description}</p>}
        {children}
      </div>
    </section>
  )
}
