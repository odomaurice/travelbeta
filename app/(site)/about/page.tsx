import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Airplane01Icon,
  ArrowRight01Icon,
  Call02Icon,
  Car01Icon,
  Hotel01Icon,
  Location01Icon,
  Luggage01Icon,
  Mail01Icon,
  Passport01Icon,
  ShieldUserIcon,
  BeachIcon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { PageHero } from "@/components/site/page-hero"
import { CONTACT } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "About Us — TravelBeta",
  description:
    "Travelbeta.com is a leading online travel company offering flight booking, hotel reservation, visa assistance, tour packages, protocol services and more.",
}

// Images from travelbeta.com/about (hosted on a Cloudinary account outside next.config's allow-list, so served unoptimized).
const IMG = "https://res.cloudinary.com/crendytech/image/upload"
const PHOTOS = [
  { src: `${IMG}/v1654023830/travelbeta/Rectangle_591_zyj9li.png`, alt: "Image of tower bridge, London" },
  { src: `${IMG}/v1654023830/travelbeta/Rectangle_592_fnanyh.png`, alt: "Dubai skyline" },
]

const SERVICES = [
  { icon: Airplane01Icon, title: "Flight booking", body: "Local and international flights at great fares.", href: "/#plan" },
  { icon: Hotel01Icon, title: "Hotel reservation", body: "Hotels and shortlets for every budget.", href: "/?tab=hotels#plan" },
  { icon: Passport01Icon, title: "Visa assistance", body: "Expert help with your visa application.", href: "/visa" },
  { icon: BeachIcon, title: "Tour packages", body: "Holidays, honeymoons and group trips.", href: "/packages" },
  { icon: ShieldUserIcon, title: "Protocol services", body: "Fast-track through airport formalities.", href: "/protocol-service" },
  { icon: Luggage01Icon, title: "Blue Ribbon baggage", body: "Delayed-bag tracking and payout.", href: "/baggages" },
  { icon: Car01Icon, title: "Airport pickups & car rental", body: "Self-drive and chauffeur-driven vehicles.", href: "/rent-vehicles" },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Going somewhere? Go with Travelbeta"
        description="Travelbeta.com is a leading online travel company that offers flight booking, hotel reservation, visa assistance, tour packages, travel financing, protocol services, airport pickups, blue ribbon and other travel needs."
        crumbs={[{ label: "About us" }]}
      />

      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Who we are</p>
            <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance text-brand-navy sm:text-4xl">
              We are Nigeria&apos;s leading online travel company and we are truly dedicated to make your travel experience as fun and memorable as possible!
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Travelbeta is the brainchild of a group of passionate professionals with backgrounds in the Hospitality, Business Services, Logistics, Finance, and Communications industries who all possess a genuine love for travel.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-brand-amber px-6 font-bold text-brand-navy-deep transition hover:bg-brand-amber/90"
            >
              Get in touch
              <Icon icon={ArrowRight01Icon} size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {PHOTOS.map((p, i) => (
              <div key={p.src} className={"relative aspect-[3/4] overflow-hidden rounded-3xl bg-brand-mist " + (i === 1 ? "mt-12" : "")}>
                <Image src={p.src} alt={p.alt} fill unoptimized className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-mist px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">What we do</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">Everything your trip needs, in one place</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <li key={s.title}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col rounded-3xl bg-card p-6 ring-1 ring-border transition outline-none hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-navy/5 focus-visible:ring-3 focus-visible:ring-brand-blue/40"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent text-brand-navy">
                    <Icon icon={s.icon} size={24} />
                  </span>
                  <h3 className="mt-4 font-bold">{s.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{s.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue-strong">
                    Learn more
                    <Icon icon={ArrowRight01Icon} size={16} className="transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Visit us</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">Our offices</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {CONTACT.offices.map((o) => (
              <div key={o.name} className="rounded-3xl border bg-card p-6 sm:p-8">
                <h3 className="text-lg font-bold text-brand-navy">{o.name}</h3>
                <p className="mt-3 flex gap-3 text-muted-foreground">
                  <Icon icon={Location01Icon} size={20} className="mt-0.5 shrink-0 text-brand-amber" />
                  <span>
                    {o.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </span>
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
                  {o.phones.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="inline-flex items-center gap-2 rounded-full bg-brand-mist px-4 py-2 text-brand-navy transition hover:bg-brand-sky">
                      <Icon icon={Call02Icon} size={16} />
                      {p.display}
                    </a>
                  ))}
                  <a href={`mailto:${o.email}`} className="inline-flex items-center gap-2 rounded-full bg-brand-mist px-4 py-2 text-brand-navy transition hover:bg-brand-sky">
                    <Icon icon={Mail01Icon} size={16} />
                    {o.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
