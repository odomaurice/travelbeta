"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Airplane01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FilterHorizontalIcon,
  Luggage01Icon,
  MoneyExchange01Icon,
  Leaf01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ReserveWithAgent } from "@/components/search/live/reserve-dialog"
import { dayDiff, formatMinutes, formatMoney, localDay, localTime, stopsLabel, timeDifferenceNote } from "@/components/search/live/format"
import type { FlightOffer, FlightSlice } from "@/lib/duffel/flights"
import { FX_CREDIT } from "@/lib/fx-credit"
import { cn } from "@/lib/utils"

type Sort = "cheapest" | "fastest" | "earliest"
type StopFilter = "any" | "direct" | "max1"

const SORTS: { value: Sort; label: string }[] = [
  { value: "cheapest", label: "Cheapest" },
  { value: "fastest", label: "Fastest" },
  { value: "earliest", label: "Earliest" },
]

/** What the traveller pays: naira when we have a rate, otherwise the airline's currency. */
const price = (o: FlightOffer) => (o.ngn ? { amount: o.ngn.amount, currency: "NGN" } : { amount: o.totalAmount, currency: o.currency })
const priceText = (o: FlightOffer) => formatMoney(price(o).amount, price(o).currency)

const totalMinutes = (o: FlightOffer) => o.slices.reduce((n, s) => n + (s.minutes ?? 0), 0)
const maxStops = (o: FlightOffer) => Math.max(...o.slices.map((s) => s.stops))

export function FlightResults({ offers }: { offers: FlightOffer[] }) {
  const [sort, setSort] = useState<Sort>("cheapest")
  const [stops, setStops] = useState<StopFilter>("any")
  const [hiddenAirlines, setHiddenAirlines] = useState<Set<string>>(new Set())
  // Filters are always visible on desktop; on phones they sit behind a toggle so results come first.
  const [showFilters, setShowFilters] = useState(false)
  const activeFilters = (stops === "any" ? 0 : 1) + hiddenAirlines.size

  const airlines = useMemo(() => {
    const map = new Map<string, { name: string; from: number; currency: string }>()
    for (const o of offers) {
      const cur = map.get(o.airline.name)
      const p = price(o)
      if (!cur || p.amount < cur.from) map.set(o.airline.name, { name: o.airline.name, from: p.amount, currency: p.currency })
    }
    return [...map.values()].sort((a, b) => a.from - b.from)
  }, [offers])

  const visible = useMemo(() => {
    const list = offers.filter((o) => {
      if (hiddenAirlines.has(o.airline.name)) return false
      if (stops === "direct") return maxStops(o) === 0
      if (stops === "max1") return maxStops(o) <= 1
      return true
    })
    const by: Record<Sort, (a: FlightOffer, b: FlightOffer) => number> = {
      cheapest: (a, b) => price(a).amount - price(b).amount,
      fastest: (a, b) => totalMinutes(a) - totalMinutes(b),
      earliest: (a, b) => a.slices[0].departingAt.localeCompare(b.slices[0].departingAt),
    }
    return [...list].sort(by[sort])
  }, [offers, sort, stops, hiddenAirlines])

  const cheapest = offers[0]
  const fastest = offers.reduce((best, o) => (totalMinutes(o) < totalMinutes(best) ? o : best), offers[0])

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-6">
      <Button
        variant="outline"
        aria-expanded={showFilters}
        aria-controls="flight-filters"
        onClick={() => setShowFilters((v) => !v)}
        className="h-11 justify-between rounded-2xl bg-card px-4 font-semibold lg:hidden"
      >
        <span className="flex items-center gap-2">
          <Icon icon={FilterHorizontalIcon} size={18} />
          Filters{activeFilters > 0 && ` (${activeFilters})`}
        </span>
        <Icon icon={showFilters ? ArrowUp01Icon : ArrowDown01Icon} size={16} />
      </Button>

      {/* Filters */}
      <aside
        id="flight-filters"
        className={cn("min-w-0 rounded-3xl border bg-card p-5 lg:sticky lg:top-24 lg:block", !showFilters && "hidden")}
        aria-label="Filter flights"
      >
        <fieldset>
          <legend className="text-sm font-bold">Stops</legend>
          <div className="mt-3 grid gap-1.5">
            {(
              [
                ["any", "Any number of stops"],
                ["max1", "1 stop or fewer"],
                ["direct", "Direct only"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm hover:bg-muted">
                <input type="radio" name="stops" checked={stops === value} onChange={() => setStops(value)} className="accent-brand-navy" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {airlines.length > 1 && (
          <fieldset className="mt-5 border-t pt-5">
            <legend className="text-sm font-bold">Airlines</legend>
            <div className="mt-3 grid gap-1.5">
              {airlines.map((a) => (
                <label key={a.name} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm hover:bg-muted">
                  <Checkbox
                    checked={!hiddenAirlines.has(a.name)}
                    onCheckedChange={(on) =>
                      setHiddenAirlines((prev) => {
                        const next = new Set(prev)
                        if (on) next.delete(a.name)
                        else next.add(a.name)
                        return next
                      })
                    }
                  />
                  <span className="min-w-0 flex-1 truncate">{a.name}</span>
                  <span className="text-xs text-muted-foreground">{formatMoney(a.from, a.currency)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </aside>

      {/* min-w-0 stops long, unbreakable content from stretching the grid column past the screen. */}
      <div className="min-w-0">
        {/* Sort tabs double as a price/speed summary */}
        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border bg-card" role="radiogroup" aria-label="Sort flights">
          {SORTS.map((s) => {
            const ref = s.value === "cheapest" ? cheapest : s.value === "fastest" ? fastest : undefined
            return (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={sort === s.value}
                onClick={() => setSort(s.value)}
                className={cn(
                  "border-r px-3 py-3 text-left transition last:border-r-0 sm:px-4",
                  sort === s.value ? "bg-brand-navy text-white" : "hover:bg-muted",
                )}
              >
                <span className="block text-sm font-bold">{s.label}</span>
                <span className={cn("block truncate text-xs", sort === s.value ? "text-white/75" : "text-muted-foreground")}>
                  {ref ? `${priceText(ref)} · ${formatMinutes(totalMinutes(ref))}` : "By departure time"}
                </span>
              </button>
            )
          })}
        </div>

        <p className="mt-4 mb-3 text-sm text-muted-foreground" aria-live="polite">
          Showing {visible.length} of {offers.length} flights · prices are for all travellers, taxes included
        </p>
        <FxNote offers={offers} />

        {visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
            No flights match these filters.{" "}
            <button
              type="button"
              className="font-semibold text-brand-blue-strong underline-offset-4 hover:underline"
              onClick={() => {
                setStops("any")
                setHiddenAirlines(new Set())
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="grid gap-4">
            {visible.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/** Decorative: the airline name is always shown beside it. */
function AirlineMark({ logo, size = 40 }: { logo: string | null; size?: number }) {
  return logo ? (
    <Image src={logo} alt="" width={size} height={size} unoptimized className="shrink-0 rounded-lg bg-white object-contain p-1 ring-1 ring-border" />
  ) : (
    <span className="grid shrink-0 place-items-center rounded-lg bg-accent text-brand-navy" style={{ width: size, height: size }}>
      <Icon icon={Airplane01Icon} size={size / 2} />
    </span>
  )
}

function SliceRow({ slice }: { slice: FlightSlice }) {
  const days = dayDiff(slice.departingAt, slice.arrivingAt)
  const tzNote = timeDifferenceNote(slice.origin, slice.destination, slice.departingAt)
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">
        <div className="text-left">
          <p className="text-xl font-extrabold tabular-nums">{localTime(slice.departingAt)}</p>
          <p className="text-sm font-semibold text-muted-foreground">{slice.origin.code}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{formatMinutes(slice.minutes)}</p>
          <div className="relative my-1.5 h-px bg-border">
            {Array.from({ length: Math.min(slice.stops, 3) }, (_, i) => (
              <span
                key={i}
                className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-card bg-brand-amber"
                style={{ left: `${((i + 1) / (Math.min(slice.stops, 3) + 1)) * 100}%` }}
              />
            ))}
          </div>
          <p className={cn("text-xs font-semibold", slice.stops === 0 ? "text-[#3d8a26]" : "text-muted-foreground")}>
            {stopsLabel(slice.stops)}
            {slice.stops > 0 &&
              ` · ${slice.segments
                .slice(0, -1)
                .map((s) => s.destination.code)
                .join(", ")}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold tabular-nums">
            {localTime(slice.arrivingAt)}
            {days > 0 && <sup className="ml-0.5 text-xs font-bold text-brand-blue-strong">+{days}</sup>}
          </p>
          <p className="text-sm font-semibold text-muted-foreground">{slice.destination.code}</p>
        </div>
      </div>
      {tzNote && <p className="mt-1 text-[11px] text-muted-foreground">Local times · {tzNote}</p>}
    </div>
  )
}

function OfferCard({ offer }: { offer: FlightOffer }) {
  const [open, setOpen] = useState(false)
  const shown = priceText(offer)
  const first = offer.slices[0]
  const last = offer.slices[offer.slices.length - 1]
  // A return trip ends where it started, so name the far end instead of "Lagos → Lagos".
  const roundTrip = offer.slices.length === 2 && last.destination.code === first.origin.code
  const route = roundTrip ? `${first.origin.city} ⇄ ${first.destination.city}` : `${first.origin.city} → ${last.destination.city}`
  const summary = `${route} · ${localDay(first.departingAt)} · ${offer.airline.name} · ${shown}`

  return (
    <li className="overflow-hidden rounded-3xl border bg-card transition hover:border-brand-blue/40 hover:shadow-[0_16px_40px_-24px_rgba(1,0,128,0.35)]">
      <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <AirlineMark logo={offer.airline.logo} size={36} />
            <p className="font-bold">{offer.airline.name}</p>
            {first.fareBrand && <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{first.fareBrand}</span>}
          </div>
          {offer.slices.map((s, i) => (
            <div key={i}>
              {offer.slices.length > 1 && <p className="mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">{localDay(s.departingAt)}</p>}
              <SliceRow slice={s} />
            </div>
          ))}
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Icon icon={Luggage01Icon} size={14} />
              {offer.checkedBags > 0 ? `${offer.checkedBags} checked bag${offer.checkedBags > 1 ? "s" : ""}` : "No checked bag"}
            </li>
            {offer.refundable != null && (
              <li className={cn("flex items-center gap-1.5", offer.refundable && "text-[#3d8a26]")}>
                <Icon icon={MoneyExchange01Icon} size={14} />
                {offer.refundable ? "Refundable" : "Non-refundable"}
              </li>
            )}
            {offer.changeable != null && (
              <li className="flex items-center gap-1.5">
                <Icon icon={Clock01Icon} size={14} />
                {offer.changeable ? "Changes allowed" : "No changes"}
              </li>
            )}
            {offer.emissionsKg != null && (
              <li className="flex items-center gap-1.5">
                <Icon icon={Leaf01Icon} size={14} />
                {offer.emissionsKg} kg CO₂
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t pt-4 md:flex-col md:flex-nowrap md:items-end md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <div className="md:text-right">
            <p className="text-2xl font-extrabold text-brand-navy">{shown}</p>
            <p className="text-xs text-muted-foreground">
              {offer.cabin} · total
              {offer.ngn && offer.currency !== "NGN" && <span className="block">{formatMoney(offer.totalAmount, offer.currency)} from the airline</span>}
            </p>
          </div>
          <div className="flex gap-2 md:flex-col">
            <ReserveWithAgent
              kind="flight"
              reference={offer.id}
              summary={summary}
              trigger={<Button className="h-11 rounded-full bg-brand-amber px-6 font-bold text-brand-navy-deep hover:bg-brand-amber/90">Select</Button>}
            />
            <Button
              variant="ghost"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="h-11 rounded-full px-4 font-semibold text-brand-blue-strong"
            >
              Details
              <Icon icon={open ? ArrowUp01Icon : ArrowDown01Icon} size={16} />
            </Button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t bg-muted/40 px-5 py-5 animate-in fade-in sm:px-6">
          {offer.slices.map((s, i) => (
            <div key={i} className={cn(i > 0 && "mt-6 border-t pt-6")}>
              <p className="text-sm font-bold">
                {s.origin.city} → {s.destination.city} · {localDay(s.departingAt)}
              </p>
              <ol className="mt-3 grid gap-3">
                {s.segments.map((seg, j) => (
                  <li key={j}>
                    <div className="flex gap-3 rounded-2xl bg-card p-4 ring-1 ring-border">
                      <AirlineMark logo={seg.carrierLogo} size={32} />
                      <div className="min-w-0 flex-1 text-sm">
                        <p className="font-semibold">
                          {localTime(seg.departingAt)} <span className="font-normal text-muted-foreground">{seg.origin.city} time</span> · {seg.origin.name} (
                          {seg.origin.code})
                        </p>
                        <p className="my-1 text-xs text-muted-foreground">
                          {seg.carrier} {seg.flightNumber}
                          {seg.aircraft && ` · ${seg.aircraft}`} · {formatMinutes(seg.minutes)}
                        </p>
                        <p className="font-semibold">
                          {localTime(seg.arrivingAt)} <span className="font-normal text-muted-foreground">{seg.destination.city} time</span> ·{" "}
                          {seg.destination.name} ({seg.destination.code})
                        </p>
                      </div>
                    </div>
                    {j < s.segments.length - 1 && (
                      <p className="my-2 ml-4 flex items-center gap-1.5 text-xs font-semibold text-[#8a5a00]">
                        <Icon icon={Clock01Icon} size={14} />
                        Change planes in {seg.destination.city}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
            <Icon icon={CheckmarkCircle02Icon} size={14} className="mt-0.5 shrink-0" />
            Times are local to each airport. Fares are live and can change until the booking is paid.
          </p>
        </div>
      )}
    </li>
  )
}

/** Explains where the naira prices come from (and credits the rate provider when we use it). */
function FxNote({ offers }: { offers: FlightOffer[] }) {
  const converted = offers.find((o) => o.ngn && o.currency !== "NGN")
  if (!converted?.ngn) return null
  const { rate, source } = converted.ngn.rate
  const symbol = formatMoney(1, converted.currency).replace(/[\d.,\s]/g, "")
  return (
    <p className="-mt-2 mb-3 text-xs text-muted-foreground">
      Converted from {converted.currency} at ₦{Math.round(rate).toLocaleString("en-NG")}/{symbol}{" "}
      {source === "override" ? (
        "(TravelBeta rate)."
      ) : (
        <>
          (today&apos;s rate,{" "}
          <a href={FX_CREDIT.href} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
            {FX_CREDIT.label}
          </a>
          ).
        </>
      )}{" "}
      Final price is confirmed in naira before you pay.
    </p>
  )
}
