import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Airplane01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  MoneyExchange01Icon,
  PassportIcon,
  Route01Icon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DestinationRoute, HotelsButton } from "@/components/destinations/destination-actions"
import { PackageCard } from "@/components/packages/package-card"
import { PageHero } from "@/components/site/page-hero"
import { MODE_LABEL, cityById, distanceKm, formatDuration, getModeOptions, recommendMode } from "@/components/trip/trips"
import { DESTINATIONS, HOME_CITY_ID, currencyLabel, destinationBySlug, timeVsHome } from "@/lib/data/destinations"
import { PACKAGES } from "@/lib/data/packages"

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ cityCode: d.slug }))
}

export async function generateMetadata({ params }: PageProps<"/destinations/flights/[cityCode]">): Promise<Metadata> {
  const d = destinationBySlug((await params).cityCode)
  if (!d) return { title: "Destination not found — TravelBeta" }
  return {
    title: `Flights and hotels in ${d.name}, ${d.country} — TravelBeta`,
    description: `Book cheap flights to ${d.name} (${d.code}) and hotels in ${d.name}. See flight times from Lagos, the time difference and local currency.`,
  }
}

export default async function DestinationPage({ params }: PageProps<"/destinations/flights/[cityCode]">) {
  const dest = destinationBySlug((await params).cityCode)
  if (!dest) notFound()

  // Flights are mapped from Lagos; for Lagos itself, from Abuja.
  const home = destinationBySlug(dest.id === HOME_CITY_ID ? "abuja" : HOME_CITY_ID)!
  const from = cityById(home.id)!
  const to = cityById(dest.id)!
  const options = getModeOptions(from, to)
  const best = recommendMode(from, to, options)
  const bestTime = options.find((o) => o.mode === best)?.minutes
  const abroad = dest.country !== "Nigeria"
  const packages = PACKAGES.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(dest.name.toLowerCase())).slice(0, 3)
  const nearby = DESTINATIONS.filter((d) => d.id !== dest.id && d.roads === dest.roads).slice(0, 6)

  const facts = [
    { icon: Ticket01Icon, label: "Main airport", value: dest.code },
    { icon: Route01Icon, label: `Distance from ${home.name}`, value: `${Math.round(distanceKm(from, to)).toLocaleString("en-GB")} km` },
    {
      icon: Clock01Icon,
      label: `Travel time from ${home.name}`,
      value: bestTime ? `About ${formatDuration(bestTime)} by ${MODE_LABEL[best].toLowerCase()}` : "—",
    },
    { icon: Clock01Icon, label: "Local time", value: timeVsHome(dest, home) },
    { icon: MoneyExchange01Icon, label: "Currency", value: currencyLabel(dest.currency) },
  ]

  return (
    <>
      <PageHero
        eyebrow={dest.country}
        title={`Flights and hotels in ${dest.name}`}
        description={`Everything you need to get your trip to ${dest.name} started — the best way to get there from ${home.name}, local time and currency, and places to stay.`}
        crumbs={[{ label: "Destinations", href: "/#explore" }, { label: dest.name }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            render={<Link href={`/?from=${home.id}&to=${dest.id}#plan`} />}
            className="h-12 rounded-full bg-brand-amber px-6 text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90"
          >
            <Icon icon={Airplane01Icon} size={18} />
            {options.some((o) => o.mode === "flight") ? `Flights to ${dest.name}` : `Plan a trip to ${dest.name}`}
          </Button>
          <HotelsButton city={dest.name} country={dest.country} />
        </div>
      </PageHero>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy">
              {home.name} to {dest.name}
            </h2>
            <p className="mt-1 text-muted-foreground">
              Best by {MODE_LABEL[best].toLowerCase()}
              {options.length > 1 && ` — or go by ${options.filter((o) => o.mode !== best).map((o) => MODE_LABEL[o.mode].toLowerCase()).join(" or ")}`}.
            </p>
            <div className="mt-5">
              <DestinationRoute fromId={home.id} toId={dest.id} />
            </div>
          </div>

          <dl className="grid gap-3">
            {facts.map((f) => (
              <div key={f.label} className="flex gap-4 rounded-2xl border bg-card p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-brand-navy">
                  <Icon icon={f.icon} size={20} />
                </span>
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">{f.label}</dt>
                  <dd className="font-bold">{f.value}</dd>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Travel times are estimates. Live schedules and fares show when you search.</p>
          </dl>
        </div>
      </section>

      {abroad && (
        <section className="px-4 pb-16">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 rounded-3xl bg-brand-mist p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-navy text-brand-amber">
              <Icon icon={PassportIcon} size={28} />
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-bold">Travelling to {dest.country}?</h2>
              <p className="text-sm text-muted-foreground">
                Our visa team can check what you need, prepare your application and book your appointment. Issuance is always at the
                embassy&apos;s discretion.
              </p>
            </div>
            <Button nativeButton={false} render={<Link href="/visa" />} className="h-11 rounded-full bg-brand-navy px-5 font-semibold">
              Visa assistance
              <Icon icon={ArrowRight01Icon} size={16} />
            </Button>
          </div>
        </section>
      )}

      {packages.length > 0 && (
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-extrabold text-brand-navy">Holiday packages in {dest.name}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((p) => (
                <PackageCard key={p.slug} pkg={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-bold">More destinations nearby</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {nearby.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/destinations/flights/${d.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold transition hover:border-brand-blue hover:bg-accent"
                  >
                    {d.name}
                    <span className="text-xs font-bold text-muted-foreground">{d.code}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
