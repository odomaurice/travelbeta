import type { Metadata } from "next"
import Link from "next/link"
import { AirplaneTakeOff01Icon, ArrowRight01Icon, CustomerSupportIcon, Ticket01Icon } from "@hugeicons/core-free-icons"
import { DealAlertsForm } from "@/components/content/deal-alerts-form"
import { Icon } from "@/components/icons"
import { PackageCard } from "@/components/packages/package-card"
import { PageHero } from "@/components/site/page-hero"
import { PACKAGES } from "@/lib/data/packages"

export const metadata: Metadata = {
  title: "Trending Flight Deals — TravelBeta",
  description: "Get the best flight deals, airline specials and promotions from TravelBeta.",
}

export default function DealsPage() {
  // TODO: load live deals from the deals API; the original site currently lists none.
  const offers = PACKAGES.slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow="Deals"
        title="Trending Flight Deals"
        description="Get the best flight deals, airline specials and promotions."
        crumbs={[{ label: "Deals" }]}
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-12 text-center sm:px-12 sm:py-16">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-sky/50 to-transparent" />
            <span className="relative mx-auto grid size-20 place-items-center rounded-full bg-brand-sky text-brand-navy">
              <Icon icon={Ticket01Icon} size={38} />
            </span>
            <h2 className="relative mt-6 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">No flight deals live right now</h2>
            <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
              Airline specials come and go quickly. Leave your email and we&apos;ll let you know as soon as new promotions land, or search for flights at today&apos;s fares.
            </p>
            <div className="relative mx-auto mt-8 max-w-xl rounded-2xl bg-brand-navy p-4 text-left sm:p-5">
              <DealAlertsForm />
            </div>
            <div className="relative mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold">
              <Link href="/#plan" className="inline-flex items-center gap-2 text-brand-blue-strong hover:underline">
                <Icon icon={AirplaneTakeOff01Icon} size={18} />
                Search flights
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 text-brand-blue-strong hover:underline">
                <Icon icon={CustomerSupportIcon} size={18} />
                Need help? Click to get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-mist px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">While you wait</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">Holiday packages on offer</h2>
            </div>
            <Link href="/packages" className="inline-flex items-center gap-1 font-semibold text-brand-blue-strong hover:underline">
              View all packages
              <Icon icon={ArrowRight01Icon} size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((p) => (
              <PackageCard key={p.slug} pkg={p} chips={2} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
