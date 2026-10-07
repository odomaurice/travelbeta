"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Hotel01Icon, Location01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { ReserveWithAgent } from "@/components/search/live/reserve-dialog"
import { formatMoney } from "@/components/search/live/format"
import type { StayResult } from "@/lib/duffel/stays"
import { cn } from "@/lib/utils"

type Sort = "price" | "rating" | "stars"

const SORTS: { value: Sort; label: string }[] = [
  { value: "price", label: "Lowest price" },
  { value: "rating", label: "Guest rating" },
  { value: "stars", label: "Star rating" },
]

export function StayResults({ results, nights, dates }: { results: StayResult[]; nights: number; dates: string }) {
  const [sort, setSort] = useState<Sort>("price")
  const sorted = useMemo(() => {
    const by: Record<Sort, (a: StayResult, b: StayResult) => number> = {
      price: (a, b) => (a.ngn?.amount ?? a.totalAmount) - (b.ngn?.amount ?? b.totalAmount),
      rating: (a, b) => (b.reviewScore ?? 0) - (a.reviewScore ?? 0),
      stars: (a, b) => (b.stars ?? 0) - (a.stars ?? 0),
    }
    return [...results].sort(by[sort])
  }, [results, sort])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {results.length} places · total price for {nights} night{nights > 1 ? "s" : ""}, taxes included
        </p>
        <div className="inline-flex rounded-full bg-muted p-1 text-sm font-semibold" role="radiogroup" aria-label="Sort hotels">
          {SORTS.map((s) => (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={sort === s.value}
              onClick={() => setSort(s.value)}
              className={cn("rounded-full px-3.5 py-1.5 transition", sort === s.value ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-foreground")}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4 grid gap-4">
        {sorted.map((r) => {
          // Naira when we have a rate, otherwise the supplier's currency.
          const price = r.ngn ? formatMoney(r.ngn.amount, "NGN") : formatMoney(r.totalAmount, r.currency)
          return (
            <li key={r.id} className="grid overflow-hidden rounded-3xl border bg-card transition hover:border-brand-blue/40 hover:shadow-[0_16px_40px_-24px_rgba(1,0,128,0.35)] sm:grid-cols-[15rem_1fr]">
              <div className="relative aspect-[16/10] bg-muted sm:aspect-auto sm:min-h-48">
                {r.photo ? (
                  <Image src={r.photo} alt="" fill unoptimized sizes="(min-width: 640px) 240px, 100vw" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-muted-foreground">
                    <Icon icon={Hotel01Icon} size={36} />
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
                <div className="min-w-0">
                  {r.stars != null && (
                    <p className="flex gap-0.5 text-brand-amber" aria-label={`${r.stars} star hotel`}>
                      {Array.from({ length: Math.round(r.stars) }, (_, i) => (
                        <Icon key={i} icon={StarIcon} size={14} className="fill-current" />
                      ))}
                    </p>
                  )}
                  <h3 className="mt-1 text-lg font-bold leading-snug">{r.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Icon icon={Location01Icon} size={14} className="shrink-0" />
                    <span className="truncate">{r.address}</span>
                  </p>
                  {r.amenities.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {r.amenities.map((a) => (
                        <li key={a} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                  {r.reviewScore != null && (
                    <p className="mt-3 flex items-center gap-2 text-sm">
                      <span className="rounded-lg bg-brand-navy px-2 py-0.5 font-bold text-white">{r.reviewScore.toFixed(1)}</span>
                      {r.reviewCount ? <span className="text-muted-foreground">{r.reviewCount.toLocaleString("en-GB")} reviews</span> : null}
                    </p>
                  )}
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="text-2xl font-extrabold text-brand-navy">{price}</p>
                  <p className="text-xs text-muted-foreground">
                    {nights} night{nights > 1 ? "s" : ""}
                    {r.dueAtProperty ? ` · ${formatMoney(r.dueAtProperty, r.currency)} paid at hotel` : ""}
                    {r.ngn && r.currency !== "NGN" && <span className="block">{formatMoney(r.totalAmount, r.currency)} from the hotel</span>}
                  </p>
                  <ReserveWithAgent
                    kind="hotel"
                    reference={r.id}
                    summary={`${r.name} · ${dates} · ${price}`}
                    trigger={<Button className="mt-3 h-11 w-full rounded-full bg-brand-amber px-6 font-bold text-brand-navy-deep hover:bg-brand-amber/90 sm:w-auto">Select</Button>}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
