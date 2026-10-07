import { CITIES, type City } from "@/components/trip/trips"

/**
 * Facts for destination pages that we can state with confidence: time zone and
 * currency. Editorial guides (things to do, visa rules) live in TravelBeta's
 * CMS — wire them in here when that API is available.
 */
const EXTRA: Record<string, { timeZone: string; currency: string }> = {
  lagos: { timeZone: "Africa/Lagos", currency: "NGN" },
  abuja: { timeZone: "Africa/Lagos", currency: "NGN" },
  "port-harcourt": { timeZone: "Africa/Lagos", currency: "NGN" },
  ibadan: { timeZone: "Africa/Lagos", currency: "NGN" },
  kano: { timeZone: "Africa/Lagos", currency: "NGN" },
  kaduna: { timeZone: "Africa/Lagos", currency: "NGN" },
  enugu: { timeZone: "Africa/Lagos", currency: "NGN" },
  "benin-city": { timeZone: "Africa/Lagos", currency: "NGN" },
  owerri: { timeZone: "Africa/Lagos", currency: "NGN" },
  calabar: { timeZone: "Africa/Lagos", currency: "NGN" },
  accra: { timeZone: "Africa/Accra", currency: "GHS" },
  lome: { timeZone: "Africa/Lome", currency: "XOF" },
  cotonou: { timeZone: "Africa/Porto-Novo", currency: "XOF" },
  nairobi: { timeZone: "Africa/Nairobi", currency: "KES" },
  johannesburg: { timeZone: "Africa/Johannesburg", currency: "ZAR" },
  cairo: { timeZone: "Africa/Cairo", currency: "EGP" },
  dubai: { timeZone: "Asia/Dubai", currency: "AED" },
  london: { timeZone: "Europe/London", currency: "GBP" },
  manchester: { timeZone: "Europe/London", currency: "GBP" },
  paris: { timeZone: "Europe/Paris", currency: "EUR" },
  amsterdam: { timeZone: "Europe/Amsterdam", currency: "EUR" },
  istanbul: { timeZone: "Europe/Istanbul", currency: "TRY" },
  "new-york": { timeZone: "America/New_York", currency: "USD" },
  houston: { timeZone: "America/Chicago", currency: "USD" },
  toronto: { timeZone: "America/Toronto", currency: "CAD" },
}

export type Destination = City & { timeZone: string; currency: string; slug: string }

export const DESTINATIONS: Destination[] = CITIES.map((c) => ({ ...c, ...EXTRA[c.id], slug: c.code }))

/** Accepts an airport code (LHR) or our city id (london), any case. */
export function destinationBySlug(slug: string) {
  const s = decodeURIComponent(slug).toLowerCase()
  return DESTINATIONS.find((d) => d.code.toLowerCase() === s || d.id === s)
}

/** Where flights are mapped from on destination pages. */
export const HOME_CITY_ID = "lagos"

// Fixed reference dates (northern winter / summer) keep the page static and
// still capture daylight-saving changes in either hemisphere.
const SEASONS = [
  { label: "Nov–Mar", iso: "2026-01-15T12:00:00Z" },
  { label: "Apr–Oct", iso: "2026-07-15T12:00:00Z" },
]

function offsetMinutes(timeZone: string, iso: string) {
  const name =
    new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "longOffset" })
      .formatToParts(new Date(iso))
      .find((p) => p.type === "timeZoneName")?.value ?? ""
  const m = /GMT([+-])(\d{2}):?(\d{2})?/.exec(name)
  return m ? (m[1] === "-" ? -1 : 1) * (+m[2] * 60 + +(m[3] ?? 0)) : 0
}

function describeDiff(min: number, home: string) {
  if (min === 0) return `Same time as ${home}`
  const h = Math.abs(min) / 60
  return `${Number.isInteger(h) ? h : h.toFixed(1)} hour${h === 1 ? "" : "s"} ${min > 0 ? "ahead of" : "behind"} ${home}`
}

/** e.g. "1 hour behind Lagos (Nov–Mar) · Same time as Lagos (Apr–Oct)". */
export function timeVsHome(dest: Destination, home: Destination) {
  const diffs = SEASONS.map((s) => offsetMinutes(dest.timeZone, s.iso) - offsetMinutes(home.timeZone, s.iso))
  if (diffs[0] === diffs[1]) return describeDiff(diffs[0], home.name)
  return SEASONS.map((s, i) => `${describeDiff(diffs[i], home.name)} (${s.label})`).join(" · ")
}

const currencyNames = new Intl.DisplayNames(["en"], { type: "currency" })
export const currencyLabel = (code: string) => `${currencyNames.of(code) ?? code} (${code})`
