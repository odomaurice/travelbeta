import "server-only"
import { cacheLife } from "next/cache"

/**
 * Naira conversion for supplier prices (Duffel returns EUR/USD/GBP…).
 *
 * Rates come from ExchangeRate-API's open endpoint (daily, no key; their terms
 * ask for a visible credit, see lib/fx-credit.ts). TravelBeta can override any rate
 * with its own, and add a margin:
 *   NGN_RATES=EUR=1750,USD=1600,GBP=2100   naira per 1 unit of each currency
 *   FX_MARKUP_PERCENT=2                     added on top of every converted price
 */

export type NgnRate = {
  /** Naira per 1 unit of the source currency, markup included. */
  rate: number
  source: "override" | "market"
}


function overrides(): Record<string, number> {
  const out: Record<string, number> = {}
  for (const pair of (process.env.NGN_RATES ?? "").split(",")) {
    const [code, value] = pair.split("=").map((s) => s?.trim())
    const n = Number(value)
    if (code && Number.isFinite(n) && n > 0) out[code.toUpperCase()] = n
  }
  return out
}

function markup() {
  const pct = Number(process.env.FX_MARKUP_PERCENT ?? 0)
  return Number.isFinite(pct) && pct > 0 ? 1 + pct / 100 : 1
}

/** Market rates as "units of currency per 1 NGN", refreshed a few times a day. */
async function marketRates(): Promise<Record<string, number>> {
  "use cache"
  cacheLife("hours")
  const res = await fetch("https://open.er-api.com/v6/latest/NGN")
  if (!res.ok) throw new Error(`FX request failed: ${res.status}`)
  const body = (await res.json()) as { result?: string; rates?: Record<string, number> }
  if (body.result !== "success" || !body.rates) throw new Error("FX response was not successful")
  return body.rates
}

/**
 * Naira rate for one currency, or null if we can't get one (callers then show
 * the supplier's currency as-is rather than a wrong naira figure).
 */
export async function ngnRate(currency: string): Promise<NgnRate | null> {
  const code = currency.toUpperCase()
  if (code === "NGN") return { rate: 1, source: "market" }
  const own = overrides()[code]
  if (own) return { rate: own * markup(), source: "override" }
  try {
    const perNgn = (await marketRates())[code]
    return perNgn ? { rate: (1 / perNgn) * markup(), source: "market" } : null
  } catch {
    return null
  }
}

/** Converted totals are rounded up to the next ₦100 so we never under-quote. */
export const toNaira = (amount: number, rate: number) => Math.ceil((amount * rate) / 100) * 100
