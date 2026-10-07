"use client"

import { useRouter } from "next/navigation"
import { Hotel01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { TripAnim } from "@/components/trip/trip-anim"
import { cityById, getModeOptions, recommendMode } from "@/components/trip/trips"
import { cn } from "@/lib/utils"

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

// Same default as travelbeta.com: check in today, stay five nights. Dates are
// worked out on click so the page itself stays static.
const DEFAULT_NIGHTS = 5

export function HotelsButton({ city, country, className }: { city: string; country: string; className?: string }) {
  const router = useRouter()
  return (
    <Button
      onClick={() => {
        const checkIn = new Date()
        const checkOut = new Date()
        checkOut.setDate(checkOut.getDate() + DEFAULT_NIGHTS)
        const q = new URLSearchParams({ city: `${city}, ${country}`, checkin: iso(checkIn), checkout: iso(checkOut), rooms: "1", adults: "1" })
        router.push(`/search/hotel?${q}`)
      }}
      className={cn("h-12 rounded-full bg-white px-6 text-base font-bold text-brand-navy hover:bg-white/90", className)}
    >
      <Icon icon={Hotel01Icon} size={18} />
      Hotels in {city}
    </Button>
  )
}

/** The TripAnim route from our home city to this destination. */
export function DestinationRoute({ fromId, toId }: { fromId: string; toId: string }) {
  const from = cityById(fromId)!
  const to = cityById(toId)!
  const mode = recommendMode(from, to, getModeOptions(from, to))
  return (
    <div className="relative aspect-[800/440] overflow-hidden rounded-3xl bg-brand-navy-deep">
      <div className="absolute inset-0">
        <TripAnim legs={[{ from, to, mode }]} />
      </div>
    </div>
  )
}
