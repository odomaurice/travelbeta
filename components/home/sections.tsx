import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
  CreditCardIcon,
  CustomerSupportIcon,
  Hotel01Icon,
  Luggage01Icon,
  PassportIcon,
  Route01Icon,
  Search01Icon,
  ShieldUserIcon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/site/section-heading"
import { PACKAGES, formatNaira } from "@/lib/data/packages"

/** The three signature services from the original homepage strip. */
const SIGNATURE = [
  { icon: Luggage01Icon, title: "Blue Ribbon", body: "Global baggage protection on all flights.", href: "/baggages" },
  { icon: ShieldUserIcon, title: "Protocol Service", body: "Expedited, smooth passage through airport immigration.", href: "/protocol-service" },
  { icon: PassportIcon, title: "Visa Assistance", body: "All-inclusive visa assistance, timely and secure.", href: "/visa" },
]

export function SignatureServices() {
  return (
    <section aria-label="Signature services" className="px-4 pt-10">
      <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-3">
        {SIGNATURE.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-navy text-brand-amber">
              <Icon icon={s.icon} size={24} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{s.title}</span>
              <span className="block text-sm text-muted-foreground">{s.body}</span>
            </span>
            <Icon icon={ArrowRight01Icon} size={18} className="shrink-0 text-brand-blue-strong transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  )
}

export function PackagesPreview() {
  const picks = PACKAGES.slice(0, 4)
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Vacation packages"
            title="Holidays, sorted from start to finish"
            description="Hotel, activities and extras bundled into one price. Just pick your dates."
          />
          <Button nativeButton={false} render={<Link href="/packages" />} variant="outline" className="h-11 rounded-full px-5 font-semibold">
            See all packages
            <Icon icon={ArrowRight01Icon} size={16} />
          </Button>
        </div>
        {/* Swipeable row on phones, grid from tablet up. */}
        <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {picks.map((p) => (
            <Link key={p.slug} href={`/packages/${p.slug}`} className="group w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl border bg-card transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(1,0,128,0.35)] sm:w-auto">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={p.images[0]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-navy backdrop-blur">{p.unit}</span>
              </div>
              <div className="p-5">
                <h3 className="line-clamp-2 font-bold leading-snug">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  From <span className="text-lg font-extrabold text-brand-navy">{formatNaira(p.price)}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function RentVehicleBand() {
  return (
    <section className="px-4 pb-20 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[32px] bg-brand-mist p-8 sm:p-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Car rental"
            title="Rent a vehicle with ease"
            description="Enhance your driving experience with the right rental for your transport needs. With a wide range of models and sizes, our vehicles are reliable and in good condition."
          />
          <Button nativeButton={false} render={<Link href="/rent-vehicles" />} className="mt-8 h-12 rounded-full bg-brand-navy px-6 text-base font-bold">
            Rent a vehicle
            <Icon icon={ArrowRight01Icon} size={18} />
          </Button>
        </div>
        <div className="relative aspect-[16/10]">
          <Image
            src="https://res.cloudinary.com/diapyzzws/image/upload/v1741360717/rent-vehicle_1_mhkisc.png"
            alt="Rental cars available from TravelBeta"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { icon: Search01Icon, title: "Tell us the cities", body: "Choose where you're leaving from and where you're headed." },
  { icon: Route01Icon, title: "See the best way there", body: "We map the route and suggest flight, train, bus or car with time estimates." },
  { icon: Ticket01Icon, title: "Book and go", body: "Pay securely and get your tickets and receipts by email." },
]

export function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="How it works" title="From idea to boarding pass in three steps" />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div aria-hidden className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-brand-sky md:block" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative text-center">
              <span className="relative mx-auto grid size-14 place-items-center rounded-full bg-brand-navy text-brand-amber ring-8 ring-background">
                <Icon icon={s.icon} size={24} />
                <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-brand-amber text-xs font-extrabold text-brand-navy-deep">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const PROMISES = [
  { icon: CustomerSupportIcon, title: "Real people, any hour", body: "Our emergency line is open 24/7, with an immediate response assured." },
  { icon: CheckmarkBadge01Icon, title: "IATA accredited", body: "Fares sourced through Amadeus and issued by an accredited agency." },
  { icon: CreditCardIcon, title: "Pay your way", body: "Cards via Paystack, Flutterwave and Interswitch, or bank transfer." },
  { icon: Hotel01Icon, title: "508,000+ hotels", body: "Rooms worldwide, plus shortlets, packages and airport transfers." },
]

export function WhyUs() {
  return (
    <section className="bg-brand-mist px-4 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          align="left"
          eyebrow="Why TravelBeta"
          title="Nigeria's leading online travel company"
          description="Built by people from hospitality, finance, logistics and communications who share a genuine love for travel — and who stay with you from search to landing."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {PROMISES.map((p, i) => (
            <div key={p.title} className={`rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border ${i % 2 === 1 ? "sm:translate-y-8" : ""}`}>
              <Icon icon={p.icon} size={28} className="text-brand-blue-strong" />
              <h3 className="mt-4 font-bold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
