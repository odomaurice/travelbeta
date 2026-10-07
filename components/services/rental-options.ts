import type { Option } from "@/components/forms/form-kit"

// TODO: load from the car-rental API. These are placeholder options until the
// cities, models and categories endpoints are connected.
export const RENTAL_CITIES: Option[] = [
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "port-harcourt", label: "Port Harcourt" },
]
export const RENTAL_CATEGORIES: Option[] = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "bus", label: "Bus / Coaster" },
]
export const RENTAL_MODELS: Option[] = [
  { value: "toyota-corolla", label: "Toyota Corolla" },
  { value: "toyota-camry", label: "Toyota Camry" },
  { value: "toyota-prado", label: "Toyota Prado" },
  { value: "lexus-gx", label: "Lexus GX" },
  { value: "toyota-hiace", label: "Toyota Hiace" },
  { value: "toyota-coaster", label: "Toyota Coaster" },
]

/** Matches `?city=` values like "lagos", "Lagos" or "port harcourt" to an option. */
export function matchCity(raw?: string | null) {
  if (!raw) return undefined
  const label = raw.trim().toLowerCase()
  const key = label.replace(/[\s_]+/g, "-")
  return RENTAL_CITIES.find((c) => c.value === key || c.label.toLowerCase() === label)?.value
}
