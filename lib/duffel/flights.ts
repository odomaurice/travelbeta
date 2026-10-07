import "server-only"
import { cacheLife } from "next/cache"
import type { CabinClass, CreateOfferRequestPassenger, Offer } from "@duffel/api/types"
import { type SearchOutcome, describeError, durationMinutes, getDuffel, isTestMode, validationMessage } from "@/lib/duffel/client"
import { type NgnRate, ngnRate, toNaira } from "@/lib/fx"

export type FlightSearchInput = {
  slices: { origin: string; destination: string; date: string }[]
  adults: number
  children: number
  infants: number
  cabin: CabinClass
}

export type FlightPlace = {
  code: string
  city: string
  name: string
  /** IANA zone of the airport, e.g. "Africa/Lagos"; times are local to it. */
  timeZone: string | null
}

export type FlightSegment = {
  carrier: string
  carrierLogo: string | null
  flightNumber: string
  origin: FlightPlace
  destination: FlightPlace
  departingAt: string
  arrivingAt: string
  minutes: number | null
  aircraft: string | null
}

export type FlightSlice = {
  origin: FlightPlace
  destination: FlightPlace
  departingAt: string
  arrivingAt: string
  minutes: number | null
  stops: number
  segments: FlightSegment[]
  fareBrand: string | null
}

/** Plain, serialisable view of a Duffel offer — only what the results UI needs. */
export type FlightOffer = {
  id: string
  totalAmount: number
  currency: string
  /** Naira price we show and sort by; null when no rate is available. */
  ngn: { amount: number; rate: NgnRate } | null
  airline: { name: string; code: string | null; logo: string | null }
  slices: FlightSlice[]
  cabin: string
  checkedBags: number
  carryOnBags: number
  refundable: boolean | null
  changeable: boolean | null
  emissionsKg: number | null
  expiresAt: string
}

// Duffel prices children by age; our form only collects counts, so we use a
// representative age inside each band (children 2–11, infants under 2).
const CHILD_AGE = 8
const INFANT_AGE = 1
const MAX_OFFERS = 60

export function cabinFromParam(value?: string): CabinClass {
  const v = value?.toLowerCase().replace(/[\s-]+/g, "_")
  if (v === "premium" || v === "premium_economy") return "premium_economy"
  if (v === "business" || v === "first") return v
  return "economy"
}

export async function searchFlights(input: FlightSearchInput): Promise<SearchOutcome<FlightOffer[]>> {
  if (!getDuffel()) return { status: "not-configured" }
  if (input.slices.length === 0) return { status: "invalid", message: "Choose where you're flying from and to." }
  if (input.slices.some((s) => !/^[A-Z]{3}$/.test(s.origin) || !/^[A-Z]{3}$/.test(s.destination))) {
    return { status: "invalid", message: "One of the airports in this search isn't recognised." }
  }
  if (input.slices.some((s) => !s.date)) {
    return { status: "invalid", message: "Pick a departure date for every flight to see live fares." }
  }
  try {
    const result = await fetchOffers(input)
    if ("invalid" in result) return { status: "invalid", message: result.invalid }
    return { status: "ok", data: await withNaira(result.offers), testMode: isTestMode() }
  } catch (err) {
    return { status: "error", message: describeError(err) }
  }
}

/**
 * Cached for a few minutes per identical search: refreshes and back/forward
 * navigation don't trigger new (billable) searches, and offers stay well inside
 * Duffel's expiry window. Validation problems are returned (same input, same
 * answer); transient failures are thrown so they're never cached.
 */
async function fetchOffers(input: FlightSearchInput): Promise<{ offers: FlightOffer[] } | { invalid: string }> {
  "use cache"
  cacheLife({ stale: 60, revalidate: 300, expire: 600 })

  const duffel = getDuffel()
  if (!duffel) throw new Error("Duffel is not configured")

  const passengers: CreateOfferRequestPassenger[] = [
    ...Array.from({ length: input.adults }, () => ({ type: "adult" as const })),
    ...Array.from({ length: input.children }, () => ({ age: CHILD_AGE })),
    ...Array.from({ length: input.infants }, () => ({ age: INFANT_AGE })),
  ]

  let res
  try {
    res = await duffel.offerRequests.create({
    slices: input.slices.map((s) => ({
      origin: s.origin,
      destination: s.destination,
      departure_date: s.date,
      arrival_time: null,
      departure_time: null,
    })),
    passengers,
    cabin_class: input.cabin,
    max_connections: 2,
    return_offers: true,
    supplier_timeout: 15000,
    })
  } catch (err) {
    const invalid = validationMessage(err)
    if (invalid) return { invalid }
    throw err
  }

  return {
    offers: res.data.offers
      .map(toFlightOffer)
      .sort((a, b) => a.totalAmount - b.totalAmount)
      .slice(0, MAX_OFFERS),
  }
}

/**
 * Adds naira prices outside the offer cache, so a new rate (or a change to
 * NGN_RATES) applies immediately. Offers stay cheapest-first in naira.
 */
async function withNaira(offers: FlightOffer[]): Promise<FlightOffer[]> {
  const rates = new Map<string, NgnRate | null>()
  for (const c of new Set(offers.map((o) => o.currency))) rates.set(c, await ngnRate(c))
  return offers
    .map((o) => {
      const rate = rates.get(o.currency)
      return { ...o, ngn: rate ? { amount: toNaira(o.totalAmount, rate.rate), rate } : null }
    })
    .sort((a, b) => (a.ngn?.amount ?? a.totalAmount) - (b.ngn?.amount ?? b.totalAmount))
}

function place(p: { iata_code?: string | null; city_name?: string | null; name: string; time_zone?: string | null }): FlightPlace {
  return { code: p.iata_code ?? "", city: p.city_name ?? p.name, name: p.name, timeZone: p.time_zone ?? null }
}

function toFlightOffer(offer: Omit<Offer, "available_services">): FlightOffer {
  const firstSegmentPassenger = offer.slices[0]?.segments[0]?.passengers[0]
  const bags = firstSegmentPassenger?.baggages ?? []
  return {
    id: offer.id,
    totalAmount: Number(offer.total_amount),
    currency: offer.total_currency,
    ngn: null,
    airline: { name: offer.owner.name, code: offer.owner.iata_code, logo: offer.owner.logo_symbol_url },
    slices: offer.slices.map((slice) => {
      const segs = slice.segments
      return {
        origin: place(slice.origin),
        destination: place(slice.destination),
        departingAt: segs[0].departing_at,
        arrivingAt: segs[segs.length - 1].arriving_at,
        minutes: durationMinutes(slice.duration),
        stops: segs.length - 1 + segs.reduce((n, s) => n + (s.stops?.length ?? 0), 0),
        fareBrand: slice.fare_brand_name,
        segments: segs.map((s) => ({
          carrier: s.marketing_carrier.name,
          carrierLogo: s.marketing_carrier.logo_symbol_url,
          flightNumber: `${s.marketing_carrier.iata_code ?? ""}${s.marketing_carrier_flight_number}`,
          origin: place(s.origin),
          destination: place(s.destination),
          departingAt: s.departing_at,
          arrivingAt: s.arriving_at,
          minutes: durationMinutes(s.duration),
          aircraft: s.aircraft?.name ?? null,
        })),
      }
    }),
    cabin: firstSegmentPassenger?.cabin_class_marketing_name ?? firstSegmentPassenger?.cabin_class ?? "Economy",
    checkedBags: bags.filter((b) => b.type === "checked").reduce((n, b) => n + b.quantity, 0),
    carryOnBags: bags.filter((b) => b.type === "carry_on").reduce((n, b) => n + b.quantity, 0),
    refundable: offer.conditions.refund_before_departure?.allowed ?? null,
    changeable: offer.conditions.change_before_departure?.allowed ?? null,
    emissionsKg: offer.total_emissions_kg ? Number(offer.total_emissions_kg) : null,
    expiresAt: offer.expires_at,
  }
}
