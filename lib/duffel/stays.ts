import "server-only"
import { cacheLife } from "next/cache"
import type { Guest, StaysSearchResult } from "@duffel/api/types"
import { CITIES } from "@/components/trip/trips"
import { type SearchOutcome, describeError, getDuffel, isNotEnabled, isTestMode, validationMessage } from "@/lib/duffel/client"
import { type NgnRate, ngnRate, toNaira } from "@/lib/fx"

export type StaySearchInput = {
  /** Free text from the search form, e.g. "Accra, Ghana". */
  city: string
  checkIn: string
  checkOut: string
  rooms: number
  adults: number
  children: number
}

/** Plain, serialisable view of a Duffel Stays result. */
export type StayResult = {
  id: string
  name: string
  photo: string | null
  stars: number | null
  reviewScore: number | null
  reviewCount: number | null
  address: string
  amenities: string[]
  totalAmount: number
  currency: string
  /** Part of the total paid at the property, if any (supplier currency). */
  dueAtProperty: number | null
  /** Naira total we show and sort by; null when no rate is available. */
  ngn: { amount: number; rate: NgnRate } | null
}

export type StaySearchData = { place: string; results: StayResult[] }

const SEARCH_RADIUS_KM = 10
const CHILD_AGE = 8
const MAX_RESULTS = 60

export async function searchStays(input: StaySearchInput): Promise<SearchOutcome<StaySearchData>> {
  if (!getDuffel()) return { status: "not-configured" }
  if (!input.checkIn || !input.checkOut) {
    return { status: "invalid", message: "Choose check-in and check-out dates to see live prices." }
  }
  if (input.checkOut <= input.checkIn) {
    return { status: "invalid", message: "Check-out must be after check-in." }
  }
  try {
    const where = await locate(input.city)
    if (!where) return { status: "invalid", message: `We couldn't find "${input.city}". Try a city name like Lagos or London.` }
    const result = await fetchStays({ ...input, lat: where.lat, lon: where.lon })
    if ("notEnabled" in result) return { status: "not-configured", reason: "not-enabled" }
    if ("invalid" in result) return { status: "invalid", message: result.invalid }
    return { status: "ok", data: { place: where.name, results: await withNaira(result.results) }, testMode: isTestMode() }
  } catch (err) {
    return { status: "error", message: describeError(err) }
  }
}

/** Our own city list first (no API call), then Duffel's place suggestions. */
async function locate(city: string): Promise<{ name: string; lat: number; lon: number } | null> {
  const wanted = city.split(",")[0].trim().toLowerCase()
  const known = CITIES.find((c) => c.name.toLowerCase() === wanted || c.id === wanted || c.code.toLowerCase() === wanted)
  if (known) return { name: `${known.name}, ${known.country}`, lat: known.lat, lon: known.lon }
  return suggestPlace(city)
}

async function suggestPlace(query: string) {
  "use cache"
  cacheLife("days")
  const duffel = getDuffel()
  if (!duffel) return null
  const res = await duffel.suggestions.list({ query })
  const hit = res.data.find((p) => p.latitude != null && p.longitude != null)
  return hit ? { name: [hit.city_name ?? hit.name, hit.country_name].filter(Boolean).join(", "), lat: hit.latitude!, lon: hit.longitude! } : null
}

/** Same caching rules as flights: validation problems are returned, transient failures thrown. */
async function fetchStays(
  input: StaySearchInput & { lat: number; lon: number }
): Promise<{ results: StayResult[] } | { invalid: string } | { notEnabled: true }> {
  "use cache"
  cacheLife({ stale: 60, revalidate: 300, expire: 600 })

  const duffel = getDuffel()
  if (!duffel) throw new Error("Duffel is not configured")

  const guests: Guest[] = [
    ...Array.from({ length: input.adults }, () => ({ type: "adult" as const })),
    ...Array.from({ length: input.children }, () => ({ type: "child" as const, age: CHILD_AGE })),
  ]
  let res
  try {
    res = await duffel.stays.search({
      location: { radius: SEARCH_RADIUS_KM, geographic_coordinates: { latitude: input.lat, longitude: input.lon } },
      check_in_date: input.checkIn,
      check_out_date: input.checkOut,
      rooms: input.rooms,
      guests,
    })
  } catch (err) {
    // Stays has to be switched on per Duffel account; until then every search is a 403.
    if (isNotEnabled(err)) return { notEnabled: true }
    const invalid = validationMessage(err)
    if (invalid) return { invalid }
    throw err
  }
  return {
    results: res.data.results
      .map(toStay)
      .sort((a, b) => a.totalAmount - b.totalAmount)
      .slice(0, MAX_RESULTS),
  }
}

async function withNaira(results: StayResult[]): Promise<StayResult[]> {
  const rates = new Map<string, NgnRate | null>()
  for (const c of new Set(results.map((r) => r.currency))) rates.set(c, await ngnRate(c))
  return results
    .map((r) => {
      const rate = rates.get(r.currency)
      return { ...r, ngn: rate ? { amount: toNaira(r.totalAmount, rate.rate), rate } : null }
    })
    .sort((a, b) => (a.ngn?.amount ?? a.totalAmount) - (b.ngn?.amount ?? b.totalAmount))
}

function toStay(r: StaysSearchResult): StayResult {
  const a = r.accommodation
  const addr = a.location.address
  return {
    id: r.id,
    name: a.name,
    photo: a.photos?.[0]?.url ?? null,
    stars: a.rating,
    reviewScore: a.review_score,
    reviewCount: a.review_count,
    address: [addr.line_one, addr.city_name].filter(Boolean).join(", "),
    amenities: (a.amenities ?? []).slice(0, 4).map((x) => x.description),
    totalAmount: Number(r.cheapest_rate_total_amount),
    currency: r.cheapest_rate_currency,
    dueAtProperty: r.cheapest_rate_due_at_accommodation_amount ? Number(r.cheapest_rate_due_at_accommodation_amount) : null,
    ngn: null,
  }
}
