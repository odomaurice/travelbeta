import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Airplane01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Call02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Location01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { ReservePackageDialog } from "@/components/packages/enquiry-forms"
import { MobileReserveBar } from "@/components/packages/mobile-reserve-bar"
import { PackageCard } from "@/components/packages/package-card"
import { PackageGallery } from "@/components/packages/package-gallery"
import { packageRegion, tidyInclusion } from "@/components/packages/package-utils"
import { ReachOut } from "@/components/packages/reach-out"
import { PageHero } from "@/components/site/page-hero"
import { formatNaira, packageBySlug, PACKAGES } from "@/lib/data/packages"
import { CONTACT } from "@/lib/data/site"

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const pkg = packageBySlug(slug)
  if (!pkg) return { title: "Package not found — TravelBeta" }
  return {
    title: `${pkg.title} — Vacation Packages — TravelBeta`,
    description: pkg.description,
    openGraph: { images: [pkg.images[0]] },
  }
}

export default async function PackagePage({ params }: PageProps<"/packages/[slug]">) {
  const { slug } = await params
  const pkg = packageBySlug(slug)
  if (!pkg) notFound()

  // Pull the dates and flight terms forward so they're visible next to the price.
  const dateTerm = pkg.terms.find((t) => /travel dates|valid from/i.test(t))
  const flightTerm = pkg.terms.find((t) => /flight rates/i.test(t))
  const at = PACKAGES.indexOf(pkg)
  const more = [1, 2, 3].map((n) => PACKAGES[(at + n) % PACKAGES.length])

  return (
    <>
      <PageHero
        eyebrow={`${packageRegion(pkg)} package`}
        title={pkg.title}
        crumbs={[{ label: "Packages", href: "/packages" }, { label: pkg.title }]}
      >
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/80">
          <span className="inline-flex items-center gap-1.5">
            <Icon icon={Location01Icon} size={18} className="text-brand-amber" />
            {packageRegion(pkg)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon icon={CheckmarkCircle02Icon} size={18} className="text-brand-amber" />
            {pkg.inclusions.length} inclusions
          </span>
          <span>
            {pkg.unit} from <strong className="text-white">{formatNaira(pkg.price)}</strong>
          </span>
        </p>
      </PageHero>

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="min-w-0">
            <PackageGallery images={pkg.images} title={pkg.title} />

            <div className="mt-10">
              <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy">About this package</h2>
              <p className="mt-3 max-w-prose text-lg leading-relaxed text-muted-foreground">{pkg.description}</p>
            </div>

            <div className="mt-10 rounded-3xl border bg-card p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy">Package details</h2>
              <p className="mt-1 text-sm text-muted-foreground">What&apos;s included in the price</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {pkg.inclusions.map((inc) => (
                  <li key={inc} className="flex gap-3">
                    <Icon icon={CheckmarkCircle02Icon} size={20} className="mt-0.5 shrink-0 text-[#3d8a26]" />
                    <span className="font-medium">{tidyInclusion(inc)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-3xl bg-brand-mist p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-brand-navy">
                <Icon icon={InformationCircleIcon} size={22} className="text-brand-blue-strong" />
                Terms &amp; conditions
              </h2>
              <ul className="mt-5 space-y-3">
                {pkg.terms.map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-muted-foreground">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-amber" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div id="reserve-card" className="rounded-3xl border bg-card p-6 shadow-lg shadow-brand-navy/5">
              <p className="text-sm font-medium text-muted-foreground">{pkg.unit} from</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-brand-navy">{formatNaira(pkg.price)}</p>
              <ul className="mt-5 space-y-3 border-t pt-5 text-sm">
                {dateTerm && (
                  <li className="flex gap-3">
                    <Icon icon={Calendar03Icon} size={18} className="mt-0.5 shrink-0 text-brand-blue-strong" />
                    {dateTerm}
                  </li>
                )}
                {flightTerm && (
                  <li className="flex gap-3">
                    <Icon icon={Airplane01Icon} size={18} className="mt-0.5 shrink-0 text-brand-blue-strong" />
                    {flightTerm}
                  </li>
                )}
              </ul>
              <ReservePackageDialog
                packageTitle={pkg.title}
                packageSlug={pkg.slug}
                trigger={
                  <button
                    type="button"
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-amber px-6 text-base font-bold text-brand-navy-deep transition outline-none hover:bg-brand-amber/90 focus-visible:ring-3 focus-visible:ring-brand-blue/40"
                  >
                    Reserve package
                    <Icon icon={ArrowRight01Icon} size={18} />
                  </button>
                }
              />
              <p className="mt-3 text-center text-xs text-muted-foreground">Send your details and our agent will contact you to complete the booking.</p>
            </div>
            <div className="mt-4 rounded-3xl bg-brand-navy p-6 text-white">
              <p className="font-bold">Questions about this package?</p>
              <div className="mt-4 grid gap-2 text-sm font-semibold">
                <a href={`tel:${CONTACT.main.tel}`} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
                  <Icon icon={Call02Icon} size={18} className="text-brand-amber" />
                  {CONTACT.main.display}
                </a>
                <a href={`mailto:${CONTACT.emails.tours}`} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
                  <Icon icon={Mail01Icon} size={18} className="text-brand-amber" />
                  {CONTACT.emails.tours}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-brand-mist px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">More packages</h2>
            <Link href="/packages" className="inline-flex items-center gap-1 font-semibold text-brand-blue-strong hover:underline">
              View all packages
              <Icon icon={ArrowRight01Icon} size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <PackageCard key={p.slug} pkg={p} chips={2} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ReachOut />
        </div>
      </section>

      {/* Mobile: keep price and the reserve action in reach while scrolling. */}
      <MobileReserveBar>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{pkg.unit} from</p>
          <p className="text-xl font-extrabold text-brand-navy">{formatNaira(pkg.price)}</p>
        </div>
        <ReservePackageDialog
          packageTitle={pkg.title}
          packageSlug={pkg.slug}
          trigger={
            <button
              type="button"
              className="inline-flex h-12 shrink-0 items-center rounded-xl bg-brand-amber px-5 font-bold text-brand-navy-deep transition outline-none hover:bg-brand-amber/90 focus-visible:ring-3 focus-visible:ring-brand-blue/40"
            >
              Reserve package
            </button>
          }
        />
      </MobileReserveBar>
    </>
  )
}
