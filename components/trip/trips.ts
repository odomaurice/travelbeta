export type TravelMode = "flight" | "train" | "bus" | "car"

/** Areas connected by road. Cities in the same area can be reached overland. */
type RoadNetwork = "west-africa" | "east-africa" | "southern-africa" | "north-africa" | "europe" | "north-america" | "gulf"

export type City = {
  id: string
  name: string
  country: string
  /** Airport IATA code shown in the UI. */
  code: string
  lat: number
  lon: number
  roads: RoadNetwork
}

export const CITIES: City[] = [
  { id: "lagos", name: "Lagos", country: "Nigeria", code: "LOS", lat: 6.5244, lon: 3.3792, roads: "west-africa" },
  { id: "abuja", name: "Abuja", country: "Nigeria", code: "ABV", lat: 9.0765, lon: 7.3986, roads: "west-africa" },
  { id: "port-harcourt", name: "Port Harcourt", country: "Nigeria", code: "PHC", lat: 4.8156, lon: 7.0498, roads: "west-africa" },
  { id: "ibadan", name: "Ibadan", country: "Nigeria", code: "IBA", lat: 7.3775, lon: 3.947, roads: "west-africa" },
  { id: "kano", name: "Kano", country: "Nigeria", code: "KAN", lat: 12.0022, lon: 8.592, roads: "west-africa" },
  { id: "kaduna", name: "Kaduna", country: "Nigeria", code: "KAD", lat: 10.5105, lon: 7.4165, roads: "west-africa" },
  { id: "enugu", name: "Enugu", country: "Nigeria", code: "ENU", lat: 6.4584, lon: 7.5464, roads: "west-africa" },
  { id: "benin-city", name: "Benin City", country: "Nigeria", code: "BNI", lat: 6.335, lon: 5.6037, roads: "west-africa" },
  { id: "owerri", name: "Owerri", country: "Nigeria", code: "QOW", lat: 5.4891, lon: 7.0176, roads: "west-africa" },
  { id: "calabar", name: "Calabar", country: "Nigeria", code: "CBQ", lat: 4.9757, lon: 8.3417, roads: "west-africa" },
  { id: "accra", name: "Accra", country: "Ghana", code: "ACC", lat: 5.6037, lon: -0.187, roads: "west-africa" },
  { id: "lome", name: "Lomé", country: "Togo", code: "LFW", lat: 6.1725, lon: 1.2314, roads: "west-africa" },
  { id: "cotonou", name: "Cotonou", country: "Benin", code: "COO", lat: 6.3703, lon: 2.3912, roads: "west-africa" },
  { id: "nairobi", name: "Nairobi", country: "Kenya", code: "NBO", lat: -1.2921, lon: 36.8219, roads: "east-africa" },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", code: "JNB", lat: -26.2041, lon: 28.0473, roads: "southern-africa" },
  { id: "cairo", name: "Cairo", country: "Egypt", code: "CAI", lat: 30.0444, lon: 31.2357, roads: "north-africa" },
  { id: "dubai", name: "Dubai", country: "UAE", code: "DXB", lat: 25.2048, lon: 55.2708, roads: "gulf" },
  { id: "london", name: "London", country: "United Kingdom", code: "LHR", lat: 51.5072, lon: -0.1276, roads: "europe" },
  { id: "manchester", name: "Manchester", country: "United Kingdom", code: "MAN", lat: 53.4808, lon: -2.2426, roads: "europe" },
  { id: "paris", name: "Paris", country: "France", code: "CDG", lat: 48.8566, lon: 2.3522, roads: "europe" },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", code: "AMS", lat: 52.3676, lon: 4.9041, roads: "europe" },
  { id: "istanbul", name: "Istanbul", country: "Türkiye", code: "IST", lat: 41.0082, lon: 28.9784, roads: "europe" },
  { id: "new-york", name: "New York", country: "United States", code: "JFK", lat: 40.7128, lon: -74.006, roads: "north-america" },
  { id: "houston", name: "Houston", country: "United States", code: "IAH", lat: 29.7604, lon: -95.3698, roads: "north-america" },
  { id: "toronto", name: "Toronto", country: "Canada", code: "YYZ", lat: 43.6532, lon: -79.3832, roads: "north-america" },
]

export const cityById = (id: string) => CITIES.find((c) => c.id === id)

/** Passenger rail links we can recommend. Order inside a pair doesn't matter. */
const RAIL_LINKS: [string, string][] = [
  ["lagos", "ibadan"], // Lagos–Ibadan standard gauge
  ["abuja", "kaduna"], // Abuja–Kaduna standard gauge
  ["london", "paris"], // Eurostar
  ["london", "amsterdam"], // Eurostar
  ["paris", "amsterdam"],
  ["london", "manchester"],
  ["new-york", "toronto"], // Maple Leaf
]

const hasRail = (a: City, b: City) =>
  RAIL_LINKS.some(([x, y]) => (x === a.id && y === b.id) || (x === b.id && y === a.id))

/** Great-circle distance in kilometres. */
export function distanceKm(a: City, b: City) {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export type ModeOption = {
  mode: TravelMode
  /** Door-to-door estimate in minutes. Indicative only, not a schedule. */
  minutes: number
}

// Average speeds and fixed overheads used for the rough estimates.
const ROAD_FACTOR = 1.3 // roads are longer than the straight line
const PROFILE: Record<TravelMode, { kmh: number; overhead: number; maxKm: number }> = {
  flight: { kmh: 780, overhead: 40, maxKm: Infinity },
  train: { kmh: 110, overhead: 15, maxKm: 1200 },
  bus: { kmh: 65, overhead: 20, maxKm: 1500 },
  car: { kmh: 80, overhead: 0, maxKm: 1500 },
}

export function getModeOptions(a: City, b: City): ModeOption[] {
  const km = distanceKm(a, b)
  const overland = a.roads === b.roads
  const options: ModeOption[] = []

  if (km > 150) {
    options.push({ mode: "flight", minutes: estimate("flight", km) })
  }
  if (hasRail(a, b) && km <= PROFILE.train.maxKm) {
    options.push({ mode: "train", minutes: estimate("train", km * 1.15) })
  }
  if (overland && km <= PROFILE.bus.maxKm) {
    options.push({ mode: "bus", minutes: estimate("bus", km * ROAD_FACTOR) })
    options.push({ mode: "car", minutes: estimate("car", km * ROAD_FACTOR) })
  }
  return options
}

function estimate(mode: TravelMode, km: number) {
  const { kmh, overhead } = PROFILE[mode]
  return Math.round((km / kmh) * 60 + overhead)
}

/**
 * The mode we lead with. Rail wins whenever it exists, short overland hops go
 * by bus, and everything else flies.
 */
export function recommendMode(a: City, b: City, options = getModeOptions(a, b)): TravelMode {
  const has = (m: TravelMode) => options.some((o) => o.mode === m)
  if (has("train")) return "train"
  if (has("bus") && distanceKm(a, b) <= 400) return "bus"
  if (has("flight")) return "flight"
  return options[0]?.mode ?? "car"
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export const MODE_LABEL: Record<TravelMode, string> = {
  flight: "Flight",
  train: "Train",
  bus: "Bus",
  car: "Car rental",
}

export const POPULAR_ROUTES: { from: string; to: string; tagline: string }[] = [
  { from: "lagos", to: "london", tagline: "Visit family & study abroad" },
  { from: "lagos", to: "abuja", tagline: "The capital in about an hour" },
  { from: "lagos", to: "ibadan", tagline: "Beat the traffic by rail" },
  { from: "lagos", to: "accra", tagline: "Weekend along the coast" },
  { from: "abuja", to: "dubai", tagline: "Shopping & sunshine" },
  { from: "lagos", to: "toronto", tagline: "Relocation made simple" },
]
