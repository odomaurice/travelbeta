// Formatting for live results. Duffel's departing_at/arriving_at are the local
// time at each airport with no offset, so we read the parts directly instead of
// going through Date (which would shift them into the viewer's timezone).

const DAY_MS = 86_400_000

export function localTime(iso: string) {
  return iso.slice(11, 16)
}

const dayFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })

export function localDay(iso: string) {
  return dayFmt.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`))
}

/** Calendar days between two local timestamps (for the "+1" next-day marker). */
export function dayDiff(fromIso: string, toIso: string) {
  const a = Date.parse(`${fromIso.slice(0, 10)}T00:00:00Z`)
  const b = Date.parse(`${toIso.slice(0, 10)}T00:00:00Z`)
  return Math.round((b - a) / DAY_MS)
}

export function formatMinutes(min: number | null) {
  if (min == null) return "—"
  const h = Math.floor(min / 60)
  const m = min % 60
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`
}

const moneyCache = new Map<string, Intl.NumberFormat>()

export function formatMoney(amount: number, currency: string) {
  let fmt = moneyCache.get(currency)
  if (!fmt) {
    fmt = new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: currency === "NGN" ? 0 : 2 })
    moneyCache.set(currency, fmt)
  }
  return fmt.format(amount)
}

export function stopsLabel(stops: number) {
  return stops === 0 ? "Direct" : stops === 1 ? "1 stop" : `${stops} stops`
}

/** UTC offset in minutes for a zone around a local timestamp (e.g. Africa/Lagos → 60). */
function offsetMinutes(timeZone: string, localIso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "longOffset" }).formatToParts(new Date(`${localIso.slice(0, 19)}Z`))
  const m = /GMT([+-])(\d{2}):?(\d{2})?/.exec(parts.find((p) => p.type === "timeZoneName")?.value ?? "")
  return m ? (m[1] === "-" ? -1 : 1) * (+m[2] * 60 + +(m[3] ?? 0)) : 0
}

/**
 * "London is 1 hour behind Lagos" — shown when a trip crosses time zones, so
 * the local departure/arrival times aren't misread. Null for same-zone trips.
 */
export function timeDifferenceNote(
  from: { city: string; timeZone: string | null },
  to: { city: string; timeZone: string | null },
  localIso: string
) {
  if (!from.timeZone || !to.timeZone) return null
  const diff = offsetMinutes(to.timeZone, localIso) - offsetMinutes(from.timeZone, localIso)
  if (diff === 0) return null
  const h = Math.abs(diff) / 60
  const amount = Number.isInteger(h) ? `${h} hour${h === 1 ? "" : "s"}` : `${h.toFixed(1)} hours`
  return `${to.city} is ${amount} ${diff > 0 ? "ahead of" : "behind"} ${from.city}`
}
