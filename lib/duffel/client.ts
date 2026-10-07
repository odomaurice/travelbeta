import "server-only"
import { Duffel, DuffelError } from "@duffel/api"

/**
 * Duffel client, or null when DUFFEL_ACCESS_TOKEN isn't set (the results pages
 * then explain that live search isn't configured instead of failing).
 * Use a `duffel_test_…` token for development; it returns Duffel's test airline.
 */
export function getDuffel(): Duffel | null {
  const token = process.env.DUFFEL_ACCESS_TOKEN
  if (!token) return null
  // DUFFEL_API_URL is optional — only for pointing at a proxy or a local mock.
  return new Duffel({ token, ...(process.env.DUFFEL_API_URL ? { basePath: process.env.DUFFEL_API_URL } : {}) })
}

export const isDuffelConfigured = () => Boolean(process.env.DUFFEL_ACCESS_TOKEN)

export const isTestMode = () => process.env.DUFFEL_ACCESS_TOKEN?.startsWith("duffel_test_") ?? false

/** Outcome of a search, shaped so pages can render every case without try/catch. */
export type SearchOutcome<T> =
  | { status: "ok"; data: T; testMode: boolean }
  | { status: "not-configured"; reason?: "no-token" | "not-enabled" }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string }

/** 403: the product (e.g. Stays) isn't enabled on this Duffel account. */
export function isNotEnabled(err: unknown) {
  return err instanceof DuffelError && err.status === 403
}

/**
 * A request problem that won't change on retry (bad airport, past date…).
 * Safe to cache and to show to the traveller as-is.
 */
export function validationMessage(err: unknown): string | null {
  if (!(err instanceof DuffelError)) return null
  const status = err.status ?? 0
  if (status < 400 || status >= 500 || status === 401 || status === 403 || status === 429) return null
  return err.errors?.[0]?.message ?? null
}

/** Turns a Duffel API error into something safe and useful to show a traveller. */
export function describeError(err: unknown): string {
  if (err instanceof DuffelError) {
    const first = err.errors?.[0]
    // Validation messages (bad dates, unknown airport) are written for end users.
    if (first?.type === "validation_error" && first.message) return first.message
    if (err.status === 401) return "The flight search service rejected our credentials."
    if (err.status === 429) return "We're getting a lot of searches right now. Please try again in a minute."
    return first?.message ?? "The search service returned an error."
  }
  return "We couldn't reach the search service."
}

/** Parses ISO 8601 durations like "PT2H25M" or "P1DT3H" into minutes. */
export function durationMinutes(iso?: string | null): number | null {
  if (!iso) return null
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(iso)
  if (!m) return null
  return (+(m[1] ?? 0) * 24 + +(m[2] ?? 0)) * 60 + +(m[3] ?? 0)
}
