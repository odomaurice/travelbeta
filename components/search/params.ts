import { CITIES, MODE_LABEL, type TravelMode } from "@/components/trip/trips"
import { AIRPORTS } from "@/lib/data/lists"

export type SearchParams = Record<string, string | string[] | undefined>

/** First value of a query param, trimmed; undefined when missing or blank. */
export function param(sp: SearchParams, key: string): string | undefined {
  const v = sp[key]
  const s = (Array.isArray(v) ? v[0] : v)?.trim()
  return s ? s : undefined
}

/** Every value of a (possibly repeated) query param. */
export function params(sp: SearchParams, key: string): string[] {
  const v = sp[key]
  return (Array.isArray(v) ? v : v ? [v] : []).map((s) => s.trim()).filter(Boolean)
}

/** Non-negative integer param, clamped to a sensible range. */
export function count(sp: SearchParams, key: string, fallback = 0, max = 20): number {
  const n = Number.parseInt(param(sp, key) ?? "", 10)
  return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : fallback
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/** Parse YYYY-MM-DD as a calendar date (UTC midnight, so it never shifts a day). */
export function parseISODate(value?: string): Date | undefined {
  const m = value ? ISO_DATE.exec(value) : null
  if (!m) return undefined
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
  return Number.isNaN(d.getTime()) || d.getUTCDate() !== +m[3] ? undefined : d
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
const shortFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })

export function formatDate(value?: string, short = false): string | undefined {
  const d = parseISODate(value)
  return d ? (short ? shortFmt : dateFmt).format(d) : undefined
}

export function nightsBetween(a?: string, b?: string): number | undefined {
  const from = parseISODate(a)
  const to = parseISODate(b)
  if (!from || !to) return undefined
  const n = Math.round((to.getTime() - from.getTime()) / 86_400_000)
  return n > 0 ? n : undefined
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

export type Place = { code: string; name: string; detail?: string }

/** Resolve an IATA code to a readable place, using our city list then the airport list. */
export function placeFromCode(raw: string): Place {
  const code = raw.toUpperCase()
  const city = CITIES.find((c) => c.code === code)
  if (city) return { code, name: city.name, detail: city.country }
  const airport = AIRPORTS.find((a) => a.value === code)
  if (airport) {
    const [name, rest] = airport.label.split(" — ")
    return { code, name, detail: rest }
  }
  return { code, name: code }
}

/** Resolve a free-text or id/code city param (hotel and shortlet search). */
export function placeFromCity(raw: string): string {
  const lower = raw.toLowerCase()
  const city = CITIES.find((c) => c.id === lower || c.code.toLowerCase() === lower || c.name.toLowerCase() === lower)
  if (city) return `${city.name}, ${city.country}`
  return raw.replace(/[-_]+/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
}

export function modeFrom(value?: string): TravelMode {
  return value && value in MODE_LABEL ? (value as TravelMode) : "flight"
}

export function cabinLabel(value?: string): string | undefined {
  if (!value) return undefined
  const s = value.replace(/[-_]+/g, " ").toLowerCase()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export type Leg = { from: Place; to: Place; depart?: string }

/**
 * Multi-city legs. Accepts `legs` as JSON (an array of {from,to,depart} or a
 * single object, possibly repeated) or repeated `from`/`to`/`depart` params.
 * Anything unparseable is ignored.
 */
export function readLegs(sp: SearchParams): Leg[] {
  const raw: { from?: unknown; to?: unknown; depart?: unknown; date?: unknown }[] = []
  for (const value of params(sp, "legs")) {
    try {
      const parsed: unknown = JSON.parse(value)
      for (const item of Array.isArray(parsed) ? parsed : [parsed]) {
        if (item && typeof item === "object") raw.push(item as (typeof raw)[number])
      }
    } catch {
      // Not JSON — skip it rather than failing the page.
    }
  }
  if (raw.length === 0) {
    const froms = params(sp, "from")
    const tos = params(sp, "to")
    const departs = params(sp, "depart")
    if (froms.length > 1) froms.forEach((from, i) => raw.push({ from, to: tos[i], depart: departs[i] }))
  }
  return raw.flatMap((l) => {
    const from = typeof l.from === "string" ? l.from.trim() : ""
    const to = typeof l.to === "string" ? l.to.trim() : ""
    const depart = typeof l.depart === "string" ? l.depart : typeof l.date === "string" ? l.date : undefined
    return from && to ? [{ from: placeFromCode(from), to: placeFromCode(to), depart }] : []
  })
}
