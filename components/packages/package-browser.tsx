"use client"

import { useState } from "react"
import { ArrowRight01Icon, MagicWand01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import type { VacationPackage } from "@/lib/data/packages"
import { CustomisePackageDialog } from "./enquiry-forms"
import { PackageCard } from "./package-card"
import { PACKAGE_FILTERS, packageCategories, type PackageCategory } from "./package-utils"

export function PackageBrowser({ packages }: { packages: VacationPackage[] }) {
  const [filter, setFilter] = useState<PackageCategory>("all")
  const visible = filter === "all" ? packages : packages.filter((p) => packageCategories(p).includes(filter))
  const count = (c: PackageCategory) => (c === "all" ? packages.length : packages.filter((p) => packageCategories(p).includes(c)).length)

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Handpicked getaways</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">Choose your next escape</h2>
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing {visible.length} of {packages.length} packages
        </p>
      </div>

      <div role="group" aria-label="Filter packages" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {PACKAGE_FILTERS.map((f) => {
          const active = filter === f.value
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.value)}
              className={
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition outline-none focus-visible:ring-3 focus-visible:ring-brand-blue/40 " +
                (active ? "border-brand-navy bg-brand-navy text-white" : "bg-card text-foreground hover:border-brand-navy/40")
              }
            >
              {f.label}
              <span className={"ml-1.5 text-xs " + (active ? "text-brand-amber" : "text-muted-foreground")}>{count(f.value)}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <PackageCard key={p.slug} pkg={p} />
        ))}

        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-brand-navy p-8 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_100%_0%,rgba(61,145,255,0.45),transparent_60%),radial-gradient(60%_50%_at_0%_100%,rgba(251,184,31,0.18),transparent_60%)]"
          />
          <div className="relative">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-brand-amber">
              <Icon icon={MagicWand01Icon} size={24} />
            </span>
            <h3 className="mt-6 text-2xl leading-tight font-extrabold">Customise your own package</h3>
            <p className="mt-2 text-white/75">
              Can&apos;t find the perfect trip? Tell us where you want to go and your budget, and we&apos;ll build a package around you.
            </p>
          </div>
          <CustomisePackageDialog
            trigger={
              <button
                type="button"
                className="relative mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-amber px-6 font-bold text-brand-navy-deep transition outline-none hover:bg-brand-amber/90 focus-visible:ring-3 focus-visible:ring-white/60"
              >
                Start your enquiry
                <Icon icon={ArrowRight01Icon} size={18} />
              </button>
            }
          />
        </div>
      </div>
    </div>
  )
}
