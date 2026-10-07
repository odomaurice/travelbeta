import type { IconSvgElement } from "@hugeicons/react"
import { Alert02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { BackToSearch, EmptyResults } from "@/components/search/empty-results"
import { FlightResults } from "@/components/search/live/flight-results"
import { StayResults } from "@/components/search/live/stay-results"
import type { SearchOutcome } from "@/lib/duffel/client"
import { type FlightSearchInput, searchFlights } from "@/lib/duffel/flights"
import { type StaySearchInput, searchStays } from "@/lib/duffel/stays"
import { CONTACT } from "@/lib/data/site"

export async function LiveFlights({ input, icon, editHref }: { input: FlightSearchInput; icon: IconSvgElement; editHref: string }) {
  const outcome = await searchFlights(input)
  if (outcome.status === "ok" && outcome.data.length > 0) {
    return (
      <>
        {outcome.testMode && <TestModeNotice example="e.g. “Duffel Airways”" />}
        <FlightResults offers={outcome.data} />
      </>
    )
  }
  return <OutcomeState outcome={outcome} icon={icon} editHref={editHref} noun="flights" />
}

export async function LiveStays({
  input,
  icon,
  editHref,
  nights,
  dates,
}: {
  input: StaySearchInput
  icon: IconSvgElement
  editHref: string
  nights: number
  dates: string
}) {
  const outcome = await searchStays(input)
  if (outcome.status === "ok" && outcome.data.results.length > 0) {
    return (
      <>
        {outcome.testMode && <TestModeNotice example="sample properties and rates" />}
        <StayResults results={outcome.data.results} nights={nights} dates={dates} />
      </>
    )
  }
  return <OutcomeState outcome={outcome} icon={icon} editHref={editHref} noun="hotels" email={CONTACT.emails.hotels} />
}

function TestModeNotice({ example }: { example: string }) {
  return (
    <p className="mb-5 flex items-start gap-2 rounded-2xl bg-brand-amber/15 px-4 py-3 text-sm text-[#6b4700]" role="note">
      <Icon icon={InformationCircleIcon} size={18} className="mt-0.5 shrink-0" />
      <span>
        <strong>Test mode.</strong> These results come from Duffel&apos;s sandbox ({example}) so the design can be checked. Switch to a live token to
        show real prices.
      </span>
    </p>
  )
}

function OutcomeState({
  outcome,
  icon,
  editHref,
  noun,
  email,
}: {
  outcome: SearchOutcome<unknown>
  icon: IconSvgElement
  editHref: string
  noun: "flights" | "hotels"
  email?: string
}) {
  if (outcome.status === "not-configured" && outcome.reason === "not-enabled") {
    return (
      <EmptyResults
        icon={icon}
        badge="Online booking coming soon"
        title={`Live ${noun} aren't available online yet`}
        body={<p>Our team can check real-time availability and book it for you right now.</p>}
        email={email}
      >
        {process.env.NODE_ENV === "development" && (
          <p className="mx-auto mt-6 max-w-lg rounded-xl bg-muted px-4 py-3 text-left text-xs text-muted-foreground">
            <strong className="text-foreground">Developer note:</strong> Duffel returned 403 — this product (e.g. Stays) isn&apos;t enabled on the account yet.
            Ask Duffel to switch it on. (Only shown in development.)
          </p>
        )}
        <BackToSearch href={editHref} label="Change your search" />
      </EmptyResults>
    )
  }
  if (outcome.status === "not-configured") {
    return (
      <EmptyResults
        icon={icon}
        badge="Live search not connected"
        title={`Live ${noun} aren't switched on yet`}
        body={<p>Our team can check real-time availability and book it for you right now.</p>}
        email={email}
      >
        {process.env.NODE_ENV === "development" && (
          <p className="mx-auto mt-6 max-w-lg rounded-xl bg-muted px-4 py-3 text-left text-xs text-muted-foreground">
            <strong className="text-foreground">Developer note:</strong> add <code>DUFFEL_ACCESS_TOKEN=duffel_test_…</code> to <code>.env.local</code> and
            restart the dev server to load live results. (Only shown in development.)
          </p>
        )}
        <BackToSearch href={editHref} label="Change your search" />
      </EmptyResults>
    )
  }
  if (outcome.status === "invalid") {
    return (
      <EmptyResults icon={icon} badge="Check your search" title="We need a little more detail" body={<p>{outcome.message}</p>} email={email}>
        <BackToSearch href={editHref} label="Edit your search" />
      </EmptyResults>
    )
  }
  if (outcome.status === "error") {
    return (
      <EmptyResults
        icon={Alert02Icon}
        badge="Search unavailable"
        title={`We couldn't load ${noun} just now`}
        body={
          <p>
            {outcome.message} Please try again in a moment — or let our team search for you.
          </p>
        }
        email={email}
      >
        <BackToSearch href={editHref} label="Try a different search" />
      </EmptyResults>
    )
  }
  return (
    <EmptyResults
      icon={icon}
      badge={noun === "flights" ? "No flights found" : "No hotels found"}
      title={`No ${noun} for these dates`}
      body={<p>Try nearby dates{noun === "flights" ? " or a different airport" : " or a nearby area"}, or ask our team — we can often find options that aren&apos;t sold online.</p>}
      email={email}
    >
      <BackToSearch href={editHref} label="Change your search" />
    </EmptyResults>
  )
}
