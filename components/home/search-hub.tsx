"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Airplane01Icon, Building03Icon, Car01Icon, Hotel01Icon, Ticket01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlightSearch } from "@/components/home/flight-search"
import { CarSearch, ManageBooking, StaySearch } from "@/components/home/other-searches"
import { PLANNER_ID, useTrip } from "@/components/trip/trip-context"
import { cityById } from "@/components/trip/trips"

const TABS = [
  { value: "flights", label: "Flights", icon: Airplane01Icon },
  { value: "hotels", label: "Hotels", icon: Hotel01Icon },
  { value: "shortlets", label: "Shortlets", icon: Building03Icon },
  { value: "cars", label: "Car rental", icon: Car01Icon },
  { value: "manage", label: "Manage booking", icon: Ticket01Icon },
] as const

type Tab = (typeof TABS)[number]["value"]
const isTab = (v: string | null): v is Tab => TABS.some((t) => t.value === v)

/**
 * Follows the URL: ?tab= opens a tab (header links like "Hotels"), and
 * ?from=&to= (city ids, e.g. from destination pages) pre-fills the flight planner.
 */
function SyncFromUrl({ onTab }: { onTab: (t: Tab) => void }) {
  const params = useSearchParams()
  const { planRoute } = useTrip()
  const tab = params.get("tab")
  const from = params.get("from")
  const to = params.get("to")
  useEffect(() => {
    if (isTab(tab)) onTab(tab)
  }, [tab, onTab])
  useEffect(() => {
    if (from && to && cityById(from) && cityById(to) && from !== to) {
      onTab("flights")
      planRoute(from, to)
    }
  }, [from, to, onTab, planRoute])
  return null
}

export function SearchHub() {
  const [tab, setTab] = useState<Tab>("flights")

  return (
    <section id={PLANNER_ID} className="relative z-10 -mt-28 scroll-mt-24 px-4 sm:-mt-36">
      <Suspense fallback={null}>
        <SyncFromUrl onTab={setTab} />
      </Suspense>
      <Tabs
        value={tab}
        onValueChange={(v) => isTab(v) && setTab(v)}
        className="mx-auto max-w-6xl gap-0"
      >
        <TabsList
          variant="line"
          aria-label="What are you booking?"
          className="relative z-10 h-auto! w-full justify-start gap-1 overflow-x-auto rounded-t-3xl rounded-b-none bg-brand-navy-deep/70 p-1.5 backdrop-blur-md [scrollbar-width:none] sm:w-fit"
        >
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="h-11 flex-none gap-2 rounded-2xl px-4 text-sm font-bold text-white/80 after:hidden hover:text-white data-active:bg-white! data-active:text-brand-navy!"
            >
              <Icon icon={t.icon} size={18} />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="overflow-hidden rounded-3xl rounded-tl-none border bg-card shadow-[0_30px_80px_-30px_rgba(1,0,128,0.35)] sm:rounded-tl-none">
          <TabsContent value="flights">
            <FlightSearch />
          </TabsContent>
          <TabsContent value="hotels">
            <StaySearch kind="hotel" />
          </TabsContent>
          <TabsContent value="shortlets">
            <StaySearch kind="shortlet" />
          </TabsContent>
          <TabsContent value="cars">
            <CarSearch />
          </TabsContent>
          <TabsContent value="manage">
            <ManageBooking />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  )
}
