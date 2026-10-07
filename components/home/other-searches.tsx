"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Car01Icon, Mail01Icon, Search01Icon, Ticket01Icon, UserGroupIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CityPicker } from "@/components/trip/city-picker"
import { cityById } from "@/components/trip/trips"
import { CountersPopover, DateField, DateRangeField, toISODate } from "@/components/home/search-fields"

const submitClass = "h-14 rounded-2xl bg-brand-amber px-7 text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90"

/** Hotels and shortlets share a form; only the target page and guest model differ. */
export function StaySearch({ kind }: { kind: "hotel" | "shortlet" }) {
  const [cityId, setCityId] = useState<string | null>(null)
  const [range, setRange] = useState<DateRange>()
  const [rooms, setRooms] = useState(1)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const city = cityId ? cityById(cityId) : undefined
  const guests = adults + children

  return (
    <form action={kind === "hotel" ? "/search/hotel" : "/shortlet/search"}>
      <input type="hidden" name="city" value={city ? `${city.name}, ${city.country}` : ""} />
      <input type="hidden" name="checkin" value={range?.from ? toISODate(range.from) : ""} />
      <input type="hidden" name="checkout" value={range?.to ? toISODate(range.to) : ""} />
      {kind === "hotel" ? (
        <>
          <input type="hidden" name="rooms" value={rooms} />
          <input type="hidden" name="adults" value={adults} />
          <input type="hidden" name="children" value={children} />
        </>
      ) : (
        <input type="hidden" name="guests" value={guests} />
      )}

      <div className="flex flex-wrap items-center gap-2 px-4 pt-4 pb-3 sm:px-6">
        <CountersPopover
          icon={UserGroupIcon}
          summary={kind === "hotel" ? `${rooms} room${rooms > 1 ? "s" : ""} · ${guests} guest${guests > 1 ? "s" : ""}` : `${guests} guest${guests > 1 ? "s" : ""}`}
          counters={[
            ...(kind === "hotel" ? [{ label: "Rooms", hint: "Up to 5 per booking", value: rooms, min: 1, max: 5, onChange: setRooms }] : []),
            { label: "Adults", hint: "12 years and over", value: adults, min: 1, max: 16, onChange: setAdults },
            { label: "Children", hint: "Under 12", value: children, min: 0, max: 8, onChange: setChildren },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          {kind === "hotel" ? "Over 508,000 hotels worldwide." : "Serviced apartments with the space hotels lack."}
        </p>
      </div>
      <div className="grid gap-2 border-t p-3 sm:p-4 lg:grid-cols-[1fr_1.2fr_auto] lg:items-center">
        <div className="flex rounded-2xl border">
          <CityPicker label={kind === "hotel" ? "Destination" : "City"} placeholder="Where are you staying?" value={cityId} onChange={setCityId} />
        </div>
        <div className="flex rounded-2xl border">
          <DateRangeField labels={["Check-in", "Check-out"]} value={range} onChange={setRange} />
        </div>
        <Button type="submit" size="lg" disabled={!city} className={submitClass}>
          <Icon icon={Search01Icon} size={18} strokeWidth={2.2} />
          {kind === "hotel" ? "Search hotels" : "Search shortlets"}
        </Button>
      </div>
    </form>
  )
}

const RENTAL_CITIES = ["lagos", "abuja", "port-harcourt"]

export function CarSearch() {
  const [cityId, setCityId] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()
  const city = cityId ? cityById(cityId) : undefined
  return (
    <form action="/rent-vehicles">
      <input type="hidden" name="city" value={city?.name ?? ""} />
      <input type="hidden" name="date" value={date ? toISODate(date) : ""} />
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4 pb-3 text-sm text-muted-foreground sm:px-6">
        <Icon icon={Car01Icon} size={16} className="text-brand-navy" />
        Reliable vehicles in good condition — self-drive or with a driver.
      </div>
      <div className="grid gap-2 border-t p-3 sm:p-4 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
        <div className="flex rounded-2xl border">
          <CityPicker
            label="Pick-up city"
            placeholder="Where do you need a car?"
            value={cityId}
            onChange={setCityId}
            only={RENTAL_CITIES}
          />
        </div>
        <div className="flex rounded-2xl border">
          <DateField label="Pick-up date" value={date} onChange={setDate} />
        </div>
        <Button type="submit" size="lg" disabled={!city} className={submitClass}>
          <Icon icon={Search01Icon} size={18} strokeWidth={2.2} />
          Find a vehicle
        </Button>
      </div>
    </form>
  )
}

export function ManageBooking() {
  return (
    <form action="/search/booking">
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4 pb-3 text-sm text-muted-foreground sm:px-6">
        View, change or cancel a booking. You&apos;ll find your reference in your confirmation email.
      </div>
      <div className="grid gap-2 border-t p-3 sm:p-4 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
        <label className="flex items-center gap-3 rounded-2xl border px-4 py-2 focus-within:ring-3 focus-within:ring-ring/40">
          <Icon icon={Ticket01Icon} size={18} className="shrink-0 text-brand-navy" />
          <span className="flex-1">
            <span className="block text-xs font-medium text-muted-foreground">Booking reference</span>
            <Input name="ref" required placeholder="e.g. TB4K29X" autoComplete="off" className="h-7 border-0 p-0 font-bold uppercase shadow-none focus-visible:ring-0" />
          </span>
        </label>
        <label className="flex items-center gap-3 rounded-2xl border px-4 py-2 focus-within:ring-3 focus-within:ring-ring/40">
          <Icon icon={Mail01Icon} size={18} className="shrink-0 text-brand-navy" />
          <span className="flex-1">
            <span className="block text-xs font-medium text-muted-foreground">Email used to book</span>
            <Input name="email" type="email" required placeholder="you@example.com" autoComplete="email" className="h-7 border-0 p-0 font-bold shadow-none focus-visible:ring-0" />
          </span>
        </label>
        <Button type="submit" size="lg" className={submitClass}>
          <Icon icon={Search01Icon} size={18} strokeWidth={2.2} />
          Find booking
        </Button>
      </div>
    </form>
  )
}
