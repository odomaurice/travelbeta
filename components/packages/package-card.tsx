import Image from "next/image"
import Link from "next/link"
import { ArrowRight01Icon, Location01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { formatNaira, type VacationPackage } from "@/lib/data/packages"
import { cn } from "@/lib/utils"
import { packageRegion, tidyInclusion } from "./package-utils"

export function PackageCard({ pkg, chips = 3, className }: { pkg: VacationPackage; chips?: number; className?: string }) {
  const extra = pkg.inclusions.length - chips
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-card transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-navy/10 has-focus-visible:ring-3 has-focus-visible:ring-brand-blue/40",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-mist">
        <Image
          src={pkg.images[0]}
          alt={pkg.title}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-navy shadow-sm">
          <Icon icon={Location01Icon} size={14} />
          {packageRegion(pkg)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg leading-snug font-bold text-brand-navy">
          <Link href={`/packages/${pkg.slug}`} className="outline-none after:absolute after:inset-0">
            {pkg.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{pkg.description}</p>
        {chips > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Includes">
            {pkg.inclusions.slice(0, chips).map((inc) => (
              <li key={inc} className="max-w-full truncate rounded-full bg-brand-mist px-2.5 py-1 text-xs font-medium text-brand-navy">
                {tidyInclusion(inc)}
              </li>
            ))}
            {extra > 0 && <li className="rounded-full px-1 py-1 text-xs font-semibold text-muted-foreground">+{extra} more</li>}
          </ul>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{pkg.unit} from</p>
            <p className="text-2xl font-extrabold tracking-tight text-brand-navy">{formatNaira(pkg.price)}</p>
          </div>
          <span
            aria-hidden
            className="grid size-11 place-items-center rounded-full bg-brand-amber text-brand-navy-deep transition group-hover:translate-x-0.5"
          >
            <Icon icon={ArrowRight01Icon} size={20} />
          </span>
        </div>
      </div>
    </article>
  )
}
