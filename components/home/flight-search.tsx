"use client"

import { useMemo, useState } from "react"
import {
  Add01Icon,
  ArrowDataTransferHorizontalIcon,
  Clock01Icon,
  Delete02Icon,
  RepeatIcon,
  Route01Icon,
  Search01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CityPicker } from "@/components/trip/city-picker"
import { MODE_STYLE, TripAnim } from "@/components/trip/trip-anim"
import { MAX_LEGS, type Leg, type TripType, useTrip } from "@/components/trip/trip-context"
import {
  MODE_LABEL,
  POPULAR_ROUTES,
  type TravelMode,
  cityById,
  distanceKm,
  formatDuration,
  getModeOptions,
  recommendMode,
} from "@/components/trip/trips"
import { CountersPopover, DateField, toISODate } from "@/components/home/search-fields"
import { cn } from "@/lib/utils"

const SUBMIT_LABEL: Record<TravelMode, string> = {
  flight: "Search flights",
  train: "Find train tickets",
  bus: "Find bus seats",
  car: "Rent a car",
}

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "round", label: "Round trip" },
  { value: "oneway", label: "One way" },
  { value: "multi", label: "Multi-city" },
]

const CABINS = [
  { value: "economy", label: "Economy" },
  { value: "premium", label: "Premium Economy" },
  { value: "business", label: "Business Class" },
  { value: "first", label: "First Class" },
]

export function FlightSearch() {
  const trip = useTrip()
  const { tripType, legs, modes, returnDate } = trip
  const [pax, setPax] = useState({ adults: 1, children: 0, infants: 0 })
  const [cabin, setCabin] = useState("economy")
  const [replay, setReplay] = useState(0)

  const multi = tripType === "multi"
  const firstMode = modes[0]
  const ready = legs.every((l) => l.fromId && l.toId && l.fromId !== l.toId)
  const people = pax.adults + pax.children + pax.infants

  const animLegs = useMemo(
    () => legs.map((l, i) => ({ from: l.fromId ? cityById(l.fromId) : undefined, to: l.toId ? cityById(l.toId) : undefined, mode: modes[i] })),
    [legs, modes]
  )

  const legsParam = JSON.stringify(
    legs.map((l, i) => ({
      from: cityById(l.fromId ?? "")?.code,
      to: cityById(l.toId ?? "")?.code,
      date: l.date ? toISODate(l.date) : undefined,
      mode: modes[i] ?? undefined,
    }))
  )

  return (
    <form action="/search">
      {/* Query string for the results page. */}
      <input type="hidden" name="trip" value={tripType} />
      <input type="hidden" name="from" value={cityById(legs[0].fromId ?? "")?.code ?? ""} />
      <input type="hidden" name="to" value={cityById(legs[0].toId ?? "")?.code ?? ""} />
      <input type="hidden" name="mode" value={firstMode ?? ""} />
      <input type="hidden" name="depart" value={legs[0].date ? toISODate(legs[0].date) : ""} />
      {tripType === "round" && <input type="hidden" name="return" value={returnDate ? toISODate(returnDate) : ""} />}
      {multi && <input type="hidden" name="legs" value={legsParam} />}
      <input type="hidden" name="adults" value={pax.adults} />
      <input type="hidden" name="children" value={pax.children} />
      <input type="hidden" name="infants" value={pax.infants} />
      <input type="hidden" name="cabin" value={cabin} />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4 pb-3 sm:px-6">
        <div className="inline-flex rounded-full bg-muted p-1 text-sm font-semibold" role="radiogroup" aria-label="Trip type">
          {TRIP_TYPES.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={tripType === o.value}
              onClick={() => trip.setTripType(o.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 transition-colors sm:px-4",
                tripType === o.value ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <CountersPopover
          icon={UserGroupIcon}
          summary={`${people} traveller${people > 1 ? "s" : ""}`}
          counters={[
            { label: "Adults", hint: "12 years and over", value: pax.adults, min: 1, max: 9, onChange: (adults) => setPax((p) => ({ ...p, adults, infants: Math.min(p.infants, adults) })) },
            { label: "Children", hint: "2 – 11 years", value: pax.children, min: 0, max: 8, onChange: (children) => setPax((p) => ({ ...p, children })) },
            { label: "Infants", hint: "Under 2 · one per adult", value: pax.infants, min: 0, max: pax.adults, onChange: (infants) => setPax((p) => ({ ...p, infants })) },
          ]}
        />

        <Select value={cabin} onValueChange={(v) => v && setCabin(v)} items={CABINS}>
          <SelectTrigger aria-label="Cabin class" className="h-auto rounded-full border-0 px-3 py-1.5 font-semibold hover:bg-muted">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CABINS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {firstMode && ready && !multi && (
          <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-brand-navy animate-in fade-in">
            <span className="size-2 rounded-full" style={{ background: MODE_STYLE[firstMode].color }} />
            {MODE_LABEL[firstMode]} selected
          </span>
        )}
      </div>

      {/* Fields */}
      <div className="grid gap-2 border-t p-3 sm:p-4">
        {legs.map((leg, i) => (
          <LegRow
            key={leg.id}
            leg={leg}
            index={i}
            multi={multi}
            canRemove={multi && legs.length > 2}
            minDate={i > 0 ? legs[i - 1].date : undefined}
            showReturn={tripType === "round"}
            submit={
              !multi ? (
                <SubmitButton disabled={!ready} label={firstMode ? SUBMIT_LABEL[firstMode] : "Search"} />
              ) : null
            }
          />
        ))}
        {multi && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              disabled={legs.length >= MAX_LEGS}
              onClick={trip.addLeg}
              className="h-11 justify-start rounded-full px-4 font-semibold text-brand-blue-strong hover:bg-accent"
            >
              <Icon icon={Add01Icon} size={18} />
              Add another trip
            </Button>
            <SubmitButton disabled={!ready} label="Search multi-city" />
          </div>
        )}
      </div>

      {/* TripAnim */}
      <div className="grid border-t bg-muted/50 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative aspect-[800/440] overflow-hidden bg-brand-navy-deep lg:aspect-auto lg:min-h-[340px]">
          <div className="absolute inset-0">
            <TripAnim legs={animLegs} replayKey={replay} />
          </div>
        </div>
        <div className="flex flex-col gap-4 p-5 sm:p-6" aria-live="polite">
          {ready ? (
            multi ? (
              <MultiInsight onReplay={() => setReplay((n) => n + 1)} />
            ) : (
              <SingleInsight onReplay={() => setReplay((n) => n + 1)} />
            )
          ) : (
            <EmptyInsight hasFrom={!!legs[0].fromId} />
          )}
        </div>
      </div>
    </form>
  )
}

function SubmitButton({ disabled, label }: { disabled: boolean; label: string }) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={disabled}
      className="h-14 rounded-2xl bg-brand-amber px-7 text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90"
    >
      <Icon icon={Search01Icon} size={18} strokeWidth={2.2} />
      {label}
    </Button>
  )
}

function LegRow({
  leg,
  index,
  multi,
  canRemove,
  minDate,
  showReturn,
  submit,
}: {
  leg: Leg
  index: number
  multi: boolean
  canRemove: boolean
  minDate?: Date
  showReturn: boolean
  submit: React.ReactNode
}) {
  const trip = useTrip()
  return (
    <div className={cn("grid gap-2 lg:items-center", submit ? "lg:grid-cols-[1fr_1fr_auto]" : "lg:grid-cols-[1fr_0.7fr_auto]")}>
      <div className="relative flex flex-col rounded-2xl border sm:flex-row sm:items-center">
        {multi && (
          <span className="absolute -top-2.5 left-4 z-10 rounded-full bg-brand-navy px-2 py-0.5 text-[11px] font-bold text-white">Trip {index + 1}</span>
        )}
        <CityPicker label="Leaving from" placeholder="Where from?" value={leg.fromId} onChange={(fromId) => trip.updateLeg(leg.id, { fromId })} exclude={leg.toId} />
        <button
          type="button"
          onClick={() => trip.swapLeg(leg.id)}
          aria-label="Swap departure and destination"
          className="absolute top-1/2 right-4 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border bg-background text-brand-navy shadow-sm transition hover:rotate-180 hover:bg-accent sm:static sm:mx-[-4px] sm:translate-y-0"
        >
          <Icon icon={ArrowDataTransferHorizontalIcon} size={16} className="rotate-90 sm:rotate-0" />
        </button>
        <div className="mx-4 h-px bg-border sm:hidden" />
        <CityPicker label="Going to" placeholder="Where to?" value={leg.toId} onChange={(toId) => trip.updateLeg(leg.id, { toId })} exclude={leg.fromId} />
      </div>

      <div className="flex rounded-2xl border">
        <DateField
          label="Departure"
          value={leg.date}
          minDate={minDate}
          onChange={(date) => {
            trip.updateLeg(leg.id, { date })
            if (date && trip.returnDate && trip.returnDate < date) trip.setReturnDate(undefined)
          }}
        />
        {!multi && (
          <>
            <div className="my-3 w-px bg-border" />
            <DateField
              label="Return"
              value={showReturn ? trip.returnDate : undefined}
              disabled={!showReturn}
              disabledText="One way"
              minDate={leg.date}
              onChange={trip.setReturnDate}
            />
          </>
        )}
      </div>

      {submit ??
        (canRemove ? (
          <Button type="button" variant="ghost" size="icon-lg" aria-label={`Remove trip ${index + 1}`} onClick={() => trip.removeLeg(leg.id)} className="justify-self-end rounded-full text-muted-foreground hover:text-destructive">
            <Icon icon={Delete02Icon} size={18} />
          </Button>
        ) : (
          <span className="hidden size-10 lg:block" />
        ))}
    </div>
  )
}

function SingleInsight({ onReplay }: { onReplay: () => void }) {
  const { legs, modes, updateLeg } = useTrip()
  const leg = legs[0]
  const from = cityById(leg.fromId!)!
  const to = cityById(leg.toId!)!
  const mode = modes[0]!
  const options = getModeOptions(from, to)
  const recommended = recommendMode(from, to, options)
  const active = options.find((o) => o.mode === mode)

  return (
    <>
      <div>
        <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Your route</p>
        <h3 className="mt-1 text-xl font-extrabold">
          {from.name} <span className="text-muted-foreground">→</span> {to.name}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Icon icon={Route01Icon} size={15} />
          {Math.round(distanceKm(from, to)).toLocaleString("en-GB")} km as the crow flies
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border bg-card p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl text-brand-navy-deep" style={{ background: MODE_STYLE[mode].color }}>
          <Icon icon={MODE_STYLE[mode].icon} size={24} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">
            {MODE_LABEL[mode]}
            {mode === recommended && (
              <span className="ml-2 rounded-full bg-brand-amber/20 px-2 py-0.5 text-[11px] font-bold text-[#8a5a00]">Best option</span>
            )}
          </p>
          {active && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon icon={Clock01Icon} size={14} />
              About {formatDuration(active.minutes)} door to door
            </p>
          )}
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Replay route animation" onClick={onReplay}>
          <Icon icon={RepeatIcon} size={18} />
        </Button>
      </div>

      {options.length > 1 ? (
        <div>
          <p className="mb-2 text-sm font-semibold">Other ways to get there</p>
          <div className="flex flex-wrap gap-2">
            {options
              .filter((o) => o.mode !== mode)
              .map((o) => (
                <button
                  key={o.mode}
                  type="button"
                  onClick={() => updateLeg(leg.id, { modeOverride: o.mode })}
                  className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold transition hover:border-brand-blue hover:bg-accent"
                >
                  <Icon icon={MODE_STYLE[o.mode].icon} size={16} />
                  {MODE_LABEL[o.mode]}
                  <span className="font-medium text-muted-foreground">{formatDuration(o.minutes)}</span>
                </button>
              ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">There&apos;s no practical road or rail link between these cities, so flying is the way to go.</p>
      )}

      <p className="mt-auto text-xs text-muted-foreground">Times are estimates to help you plan. Live schedules and fares show when you search.</p>
    </>
  )
}

function MultiInsight({ onReplay }: { onReplay: () => void }) {
  const { legs, modes, updateLeg } = useTrip()
  const rows = legs.map((leg, i) => {
    const from = cityById(leg.fromId!)!
    const to = cityById(leg.toId!)!
    const options = getModeOptions(from, to)
    const mode = modes[i]!
    const minutes = options.find((o) => o.mode === mode)?.minutes ?? 0
    return { leg, from, to, options, mode, minutes, km: distanceKm(from, to) }
  })
  const totalKm = rows.reduce((sum, r) => sum + r.km, 0)
  const totalMin = rows.reduce((sum, r) => sum + r.minutes, 0)

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Your itinerary</p>
          <h3 className="mt-1 text-xl font-extrabold">
            {rows.length} trips · {Math.round(totalKm).toLocaleString("en-GB")} km
          </h3>
          <p className="text-sm text-muted-foreground">About {formatDuration(totalMin)} of travel in total</p>
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Replay route animation" onClick={onReplay}>
          <Icon icon={RepeatIcon} size={18} />
        </Button>
      </div>
      <ol className="space-y-2">
        {rows.map((r, i) => (
          <li key={r.leg.id} className="rounded-2xl border bg-card p-3">
            <p className="text-sm font-bold">
              <span className="mr-1.5 text-muted-foreground">{i + 1}.</span>
              {r.from.name} → {r.to.name}
              <span className="ml-1.5 font-medium text-muted-foreground">· {formatDuration(r.minutes)}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Travel mode for trip ${i + 1}`}>
              {r.options.map((o) => (
                <button
                  key={o.mode}
                  type="button"
                  role="radio"
                  aria-checked={o.mode === r.mode}
                  onClick={() => updateLeg(r.leg.id, { modeOverride: o.mode })}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
                    o.mode === r.mode ? "border-brand-navy bg-brand-navy text-white" : "hover:border-brand-blue hover:bg-accent"
                  )}
                >
                  <Icon icon={MODE_STYLE[o.mode].icon} size={14} />
                  {MODE_LABEL[o.mode]}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-auto text-xs text-muted-foreground">Times are estimates to help you plan. Live schedules and fares show when you search.</p>
    </>
  )
}

function EmptyInsight({ hasFrom }: { hasFrom: boolean }) {
  const { planRoute } = useTrip()
  return (
    <>
      <div>
        <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">See your journey</p>
        <h3 className="mt-1 text-xl font-extrabold">{hasFrom ? "Now, where are you headed?" : "Pick where you're going"}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll map the route and show whether it&apos;s best by flight, train, bus or car — before you book anything.
        </p>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Try a popular route</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROUTES.slice(0, 4).map((r) => (
            <button
              key={`${r.from}-${r.to}`}
              type="button"
              onClick={() => planRoute(r.from, r.to)}
              className="rounded-full border bg-card px-3 py-1.5 text-sm font-semibold transition hover:border-brand-blue hover:bg-accent"
            >
              {cityById(r.from)?.name} → {cityById(r.to)?.name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
