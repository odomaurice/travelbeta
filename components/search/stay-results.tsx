import { Suspense } from "react"
import type { IconSvgElement } from "@hugeicons/react"
import { Calendar03Icon, Door01Icon, Moon02Icon, UserMultipleIcon } from "@hugeicons/core-free-icons"
import { BackToSearch, EmptyResults, ResultsSkeleton } from "@/components/search/empty-results"
import { count, formatDate, nightsBetween, param, placeFromCity, plural, type SearchParams } from "@/components/search/params"
import { ResultsReveal } from "@/components/search/results-state"
import { LiveStays } from "@/components/search/live/live-results"
import { SearchBand, SearchSummary, SearchSummarySkeleton, type SummaryDetail } from "@/components/search/search-summary"
import { CONTACT } from "@/lib/data/site"

export type StayKind = "hotel" | "shortlet"

const COPY: Record<StayKind, { eyebrow: string; noun: string; plural: string; notFound: string; edit: string }> = {
  hotel: {
    eyebrow: "Hotel search",
    noun: "hotel",
    plural: "hotels",
    notFound: "No hotel found",
    edit: "/?tab=hotels#plan",
  },
  shortlet: {
    eyebrow: "Shortlet search",
    noun: "shortlet",
    plural: "shortlets",
    notFound: "No shortlet found",
    edit: "/?tab=shortlets#plan",
  },
}

/**
 * Results shell for hotel and shortlet searches.
 * Hotel params: city, checkin, checkout, rooms, adults.
 * Shortlet params: city, checkin, checkout, guests.
 */
export function StayResultsPage({ kind, icon, searchParams }: { kind: StayKind; icon: IconSvgElement; searchParams: Promise<SearchParams> }) {
  return (
    <Suspense
      fallback={
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
      }
    >
      <StayResults kind={kind} icon={icon} searchParams={searchParams} />
    </Suspense>
  )
}

async function StayResults({ kind, icon, searchParams }: { kind: StayKind; icon: IconSvgElement; searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const copy = COPY[kind]
  const cityRaw = param(sp, "city")
  const city = cityRaw ? placeFromCity(cityRaw) : undefined
  const checkin = param(sp, "checkin")
  const checkout = param(sp, "checkout")
  const nights = nightsBetween(checkin, checkout)
  const checkinLabel = formatDate(checkin, true)
  const checkoutLabel = formatDate(checkout, true)

  const details: SummaryDetail[] = [
    { icon: Calendar03Icon, label: "Check-in", value: checkinLabel ?? "Add date" },
    { icon: Calendar03Icon, label: "Check-out", value: checkoutLabel ?? "Add date" },
  ]
  const rooms = Math.max(1, count(sp, "rooms", 1, 9))
  const adults = Math.max(1, count(sp, "adults", 1, 30))
  const children = count(sp, "children", 0, 10)
  if (kind === "hotel") {
    details.push({ icon: Door01Icon, label: "Rooms", value: plural(rooms, "room") })
    details.push({ icon: UserMultipleIcon, label: "Guests", value: plural(adults, "adult") })
  } else {
    const guests = Math.max(1, count(sp, "guests", 1, 30))
    details.push({ icon: UserMultipleIcon, label: "Guests", value: plural(guests, "guest") })
    details.push({ icon: Moon02Icon, label: "Stay", value: nights ? plural(nights, "night") : "Flexible" })
  }

  return (
    <>
      <SearchBand>
        <SearchSummary
          icon={icon}
          eyebrow={copy.eyebrow}
          title={city ? `${kind === "hotel" ? "Hotels" : "Shortlets"} in ${city}` : `Find a ${copy.noun}`}
          subtitle={
            checkinLabel && checkoutLabel
              ? `${checkinLabel} – ${checkoutLabel}${nights && kind === "hotel" ? ` · ${plural(nights, "night")}` : ""}`
              : city
                ? undefined
                : "Choose a city and your dates to search."
          }
          details={details}
          editHref={copy.edit}
        />
      </SearchBand>

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Hotels come live from Duffel Stays; shortlets are TravelBeta's own listings, booked by the team. */}
          {kind === "hotel" && city ? (
            <Suspense
              key={[city, checkin, checkout, rooms, adults, children].join("|")}
              fallback={<ResultsSkeleton label={`Finding live rates in ${city}…`} />}
            >
              <LiveStays
                input={{ city, checkIn: checkin ?? "", checkOut: checkout ?? "", rooms, adults, children }}
                icon={icon}
                editHref={copy.edit}
                nights={nights ?? 1}
                dates={checkinLabel && checkoutLabel ? `${checkinLabel} – ${checkoutLabel}` : ""}
              />
            </Suspense>
          ) : (
            <ResultsReveal skeleton={<ResultsSkeleton label={`Looking for ${copy.plural}${city ? ` in ${city}` : ""}…`} />}>
              <EmptyResults
                icon={icon}
                badge={copy.notFound}
                title={`Live ${copy.noun} rates will appear here`}
                body={
                  <p>
                    We&apos;re connecting live {copy.noun} availability to the new TravelBeta.{" "}
                    {kind === "hotel" ? "Our hotels desk can check rooms" : "Our team can check apartments"}
                    {city ? ` in ${city}` : ""} for your dates and book the best option for you.
                  </p>
                }
                email={CONTACT.emails.hotels}
              >
                <BackToSearch href={copy.edit} label="Change your search" />
              </EmptyResults>
            </ResultsReveal>
          )}
        </div>
      </section>
    </>
  )
}
