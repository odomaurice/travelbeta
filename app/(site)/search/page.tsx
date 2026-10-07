import { Suspense } from "react"
import type { Metadata } from "next"
import {
  AirplaneTakeOff01Icon,
  ArrowRight02Icon,
  Bus01Icon,
  Calendar03Icon,
  Car01Icon,
  Route01Icon,
  Ticket01Icon,
  Train01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { Icon } from "@/components/icons"
import { BackToSearch, EmptyResults, ResultsSkeleton } from "@/components/search/empty-results"
import {
  cabinLabel,
  count,
  formatDate,
  modeFrom,
  param,
  placeFromCode,
  plural,
  readLegs,
  type Leg,
  type SearchParams,
} from "@/components/search/params"
import { ResultsReveal } from "@/components/search/results-state"
import { LiveFlights } from "@/components/search/live/live-results"
import { cabinFromParam, type FlightSearchInput } from "@/lib/duffel/flights"
import { SearchBand, SearchSummary, SearchSummarySkeleton, type SummaryDetail } from "@/components/search/search-summary"
import { MODE_LABEL, type TravelMode } from "@/components/trip/trips"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Search results — TravelBeta",
  description: "Compare flights, trains, buses and car rentals for your trip, or let our team book it for you.",
}

const MODE_ICON: Record<TravelMode, IconSvgElement> = {
  flight: AirplaneTakeOff01Icon,
  train: Train01Icon,
  bus: Bus01Icon,
  car: Car01Icon,
}

export default function FlightSearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<SearchFallback />}>
      <FlightResults searchParams={searchParams} />
    </Suspense>
  )
}

function SearchFallback() {
  return (
    <>
      <SearchBand>
        <SearchSummarySkeleton />
      </SearchBand>
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <ResultsSkeleton />
        </div>
      </section>
    </>
  )
}

function travellersLabel(adults: number, children: number, infants: number) {
  return [plural(adults, "adult"), children > 0 && plural(children, "child", "children"), infants > 0 && plural(infants, "infant")]
    .filter(Boolean)
    .join(", ")
}

async function FlightResults({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const mode = modeFrom(param(sp, "mode"))
  const legs: Leg[] = readLegs(sp)
  const fromCode = param(sp, "from")
  const toCode = param(sp, "to")
  if (legs.length === 0 && fromCode && toCode) {
    legs.push({ from: placeFromCode(fromCode), to: placeFromCode(toCode), depart: param(sp, "depart") })
  }
  const multiCity = legs.length > 1
  const returnDate = multiCity ? undefined : formatDate(param(sp, "return"), true)
  const adults = Math.max(1, count(sp, "adults", 1, 9))
  const travellers = travellersLabel(adults, count(sp, "children", 0, 9), count(sp, "infants", 0, 9))
  const modeLabel = MODE_LABEL[mode]
  // Only flights have a live supplier; other modes are booked by our team.
  const noun = "schedules and fares"

  const first = legs[0]
  const last = legs.at(-1)

  const details: SummaryDetail[] = []
  if (first) {
    details.push({ icon: Calendar03Icon, label: multiCity ? "First departure" : "Departs", value: formatDate(first.depart, true) ?? "Flexible" })
    details.push({
      icon: Calendar03Icon,
      label: multiCity ? "Trip" : "Returns",
      value: multiCity ? `${legs.length} legs` : (returnDate ?? "One way"),
    })
  }
  details.push({ icon: UserMultipleIcon, label: "Travellers", value: travellers })
  details.push(
    mode === "flight"
      ? { icon: Ticket01Icon, label: "Cabin", value: cabinLabel(param(sp, "cabin")) ?? "Economy" }
      : { icon: MODE_ICON[mode], label: "Travel by", value: modeLabel }
  )

  const routeText = first && last ? `${first.from.name} to ${last.to.name}` : undefined

  // Round trips add the return as a second slice; multi-city sends every leg.
  const rawReturn = param(sp, "return")
  const flightInput: FlightSearchInput = {
    slices: [
      ...legs.map((l) => ({ origin: l.from.code, destination: l.to.code, date: l.depart ?? "" })),
      ...(!multiCity && first && rawReturn ? [{ origin: first.to.code, destination: first.from.code, date: rawReturn }] : []),
    ],
    adults,
    children: count(sp, "children", 0, 9),
    infants: Math.min(count(sp, "infants", 0, 9), adults),
    cabin: cabinFromParam(param(sp, "cabin")),
  }

  return (
    <>
      <SearchBand>
        <SearchSummary
          icon={MODE_ICON[mode]}
          eyebrow={multiCity ? "Multi-city search" : `${modeLabel} search`}
          title={
            first && last ? (
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {first.from.name}
                <Icon icon={ArrowRight02Icon} size={22} className="text-brand-amber" aria-label="to" />
                {last.to.name}
              </span>
            ) : (
              "Where are you heading?"
            )
          }
          subtitle={
            first && last && !multiCity ? (
              <>
                {[first.from.detail, first.from.code].filter(Boolean).join(" · ")}
                <span aria-hidden> → </span>
                <span className="sr-only"> to </span>
                {[last.to.detail, last.to.code].filter(Boolean).join(" · ")}
              </>
            ) : !first ? (
              "Pick a departure and destination to search."
            ) : undefined
          }
          details={details}
          editHref="/#plan"
          editLabel={first ? "Edit search" : "Plan a trip"}
        />

        {multiCity && (
          <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {legs.map((l, i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-amber text-xs font-extrabold text-brand-navy-deep">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate font-bold">
                    {l.from.code} → {l.to.code}
                  </span>
                  <span className="text-white/70">{formatDate(l.depart, true) ?? "Date flexible"}</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </SearchBand>

      <section className="px-4 py-12 sm:py-16">
        {/* Live results need room for the filter column; empty states read better narrow. */}
        <div className={cn("mx-auto", first && mode === "flight" ? "max-w-6xl" : "max-w-4xl")}>
          {first && mode === "flight" ? (
            <Suspense key={JSON.stringify(flightInput)} fallback={<ResultsSkeleton label="Searching live fares across airlines…" />}>
              <LiveFlights input={flightInput} icon={MODE_ICON.flight} editHref="/#plan" />
            </Suspense>
          ) : first ? (
            <ResultsReveal skeleton={<ResultsSkeleton label={`Looking for ${modeLabel.toLowerCase()} options…`} />}>
              <EmptyResults
                icon={MODE_ICON[mode]}
                badge="Live booking coming soon"
                title={`Live ${noun} will appear here`}
                body={
                  <p>
                    We&apos;re connecting live {modeLabel.toLowerCase()} inventory to the new TravelBeta. Until then our travel experts can check
                    real-time availability{routeText ? ` from ${routeText}` : ""} and book it for you.
                  </p>
                }
              >
                <BackToSearch label="Change your search" />
              </EmptyResults>
            </ResultsReveal>
          ) : (
            <EmptyResults
              icon={Route01Icon}
              title="Tell us where you're going"
              body={<p>Choose where you&apos;re leaving from and where you&apos;re going on the trip planner, then search again.</p>}
            >
              <BackToSearch label="Open the trip planner" />
            </EmptyResults>
          )}
        </div>
      </section>
    </>
  )
}
