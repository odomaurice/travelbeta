import { Suspense } from "react"
import type { Metadata } from "next"
import { Car01Icon, Location01Icon, SteeringIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { HelpCard } from "@/components/site/help-card"
import { PageHero } from "@/components/site/page-hero"
import { RentalForm } from "@/components/services/rental-form"
import { matchCity } from "@/components/services/rental-options"

export const metadata: Metadata = {
  title: "Rent a Vehicle — TravelBeta",
  description:
    "Rent a reliable vehicle in good condition, from a wide range of models and sizes to suit your transportation needs.",
}

async function RentalFormWithCity({ searchParams }: { searchParams: Promise<{ city?: string | string[] }> }) {
  const { city } = await searchParams
  return <RentalForm city={matchCity(Array.isArray(city) ? city[0] : city)} />
}

export default function RentVehiclesPage({ searchParams }: PageProps<"/rent-vehicles">) {
  return (
    <>
      <PageHero
        eyebrow="Car rental"
        title="Rent a vehicle with ease"
        description="Enhance your driving experience with the right rental to suit your transportation needs."
        crumbs={[{ label: "Car rental" }]}
      />

      <section id="request" className="scroll-mt-28 px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <Suspense fallback={<RentalForm />}>
            <RentalFormWithCity searchParams={searchParams} />
          </Suspense>

          <div className="grid gap-6 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl bg-brand-mist p-6 sm:p-8">
              <div aria-hidden className="flex items-center gap-3 text-brand-navy">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-navy text-brand-amber">
                  <Icon icon={Car01Icon} size={24} />
                </span>
                <span className="h-px flex-1 border-t-2 border-dashed border-brand-sky" />
                <span className="grid size-12 place-items-center rounded-2xl bg-card text-brand-blue-strong ring-1 ring-border">
                  <Icon icon={Location01Icon} size={24} />
                </span>
              </div>
              <h2 className="mt-6 text-xl font-extrabold text-brand-navy">The right rental for your trip</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                With a wide range of vehicle models and sizes, our vehicles are reliable and in good condition.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-navy">
                <Icon icon={SteeringIcon} size={18} className="text-brand-blue-strong" />
                Pick a city, model and category to get started.
              </p>
            </div>
            <HelpCard title="Questions about car rental?" body="Our travel experts are available 24/7 to help you." />
          </div>
        </div>
      </section>
    </>
  )
}
