import type { Metadata } from "next"
import Link from "next/link"
import {
  AirplaneTakeOff01Icon,
  ArrowRight01Icon,
  Car01Icon,
  DiscountTag01Icon,
  GlobalIcon,
  Hotel01Icon,
  Invoice01Icon,
  Megaphone01Icon,
  PercentCircleIcon,
  Ticket01Icon,
  UserAdd01Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { AffiliateHelpCard, FaqAnswer, GuaranteeCard } from "@/components/affiliate/affiliate-bits"
import { Icon } from "@/components/icons"
import { PageHero } from "@/components/site/page-hero"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { AFFILIATE_FAQ } from "@/lib/data/affiliate-faq"

export const metadata: Metadata = {
  title: "Become an affiliate — TravelBeta",
  description:
    "Get fantastic profit as a TravelBeta affiliate. Unbeatable discounts on flights, hotels, tours and visa processing, and the power to set your own prices.",
}

const PILLARS = [
  {
    icon: UserGroupIcon,
    title: "Who we are",
    body: "We are Nigeria's leading online travel agency, offering you the best prices for travel products and technology to enable you to grow your travel business.",
  },
  {
    icon: Megaphone01Icon,
    title: "Why become an affiliate",
    body: "We put the power of pricing in your hands by giving you the ability to adjust pricing for flights and hotels at great discounts.",
  },
  {
    icon: DiscountTag01Icon,
    title: "What we offer",
    body: "Discounted domestic and international flights, over 508,000 hotels worldwide, airport transfers, visa services and travel packages.",
  },
]

const OFFER = [
  { icon: AirplaneTakeOff01Icon, label: "Domestic & international flights" },
  { icon: Hotel01Icon, label: "508,000+ hotels worldwide" },
  { icon: Car01Icon, label: "Airport transfers" },
  { icon: Ticket01Icon, label: "Visa services" },
  { icon: GlobalIcon, label: "Travel packages" },
]

// Derived from the affiliate FAQ answers.
const STEPS = [
  {
    icon: UserAdd01Icon,
    title: "Apply for free",
    body: "Complete the affiliate registration form. There are no start-up fees — the partnership holds no cost or risk to you.",
  },
  {
    icon: UserIcon,
    title: "Get approved",
    body: "Your personal affiliate manager emails you back about your application and gives you a step-by-step introduction.",
  },
  {
    icon: Invoice01Icon,
    title: "Share, invoice, get paid",
    body: "Share banners, text links or XML feeds on your site, newsletter or blog — or by email. Invoice us monthly from your reports; we aim to pay on the 10th.",
  },
]

const HIGHLIGHTS = ["Free to join", "Your own affiliate manager", "Paid monthly to your bank"]

const FAQ_PREVIEW = [0, 3, 5, 7].map((i) => AFFILIATE_FAQ[i])

export default function AffiliatePage() {
  return (
    <>
      <PageHero
        eyebrow="TravelBeta affiliates"
        title="Get fantastic profit as a TravelBeta affiliate"
        description="Enjoy unbeatable discounts on flights, hotels, tours and visa processing, all around the world — far better than what you get with any other online travel company."
        crumbs={[{ label: "Affiliates" }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/affiliate/register" />}
            className="h-12 rounded-full bg-brand-amber px-6 text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90"
          >
            Get started
            <Icon icon={ArrowRight01Icon} size={18} />
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/affiliate/faq" />}
            className="h-12 rounded-full border-white/30 bg-white/5 px-6 text-base font-bold text-white hover:bg-white/15 hover:text-white"
          >
            Read the FAQs
          </Button>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/80">
          {HIGHLIGHTS.map((h) => (
            <li key={h} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-amber" />
              {h}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Why */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Why partner with us</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">Why become a TravelBeta affiliate?</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="rounded-3xl border bg-card p-6 sm:p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent text-brand-navy">
                  <Icon icon={p.icon} size={24} />
                </span>
                <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-1.5 text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-brand-navy p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex items-center gap-4 lg:w-64 lg:shrink-0">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-brand-amber">
                  <Icon icon={PercentCircleIcon} size={26} />
                </span>
                <p className="font-bold">Discounted products you can sell</p>
              </div>
              <ul className="flex flex-1 flex-wrap gap-2">
                {OFFER.map((o) => (
                  <li key={o.label} className="flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold">
                    <Icon icon={o.icon} size={18} className="shrink-0 text-brand-amber" />
                    {o.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-mist px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">How it works</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">Start earning in three steps</h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-3xl bg-card p-6 ring-1 ring-border sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-brand-navy font-extrabold text-brand-amber">{i + 1}</span>
                  <Icon icon={s.icon} size={26} className="text-brand-blue-strong" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              nativeButton={false}
              render={<Link href="/affiliate/register" />}
              className="h-12 rounded-full bg-brand-amber px-6 text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90"
            >
              Become an affiliate
              <Icon icon={ArrowRight01Icon} size={18} />
            </Button>
            <p className="text-sm text-muted-foreground">No website? You can still join by sharing your links via email.</p>
          </div>
        </div>
      </section>

      {/* FAQ preview + help */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">FAQs</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">Questions affiliates ask</h2>
            <Accordion className="mt-8 gap-3">
              {FAQ_PREVIEW.map((item) => (
                <AccordionItem key={item.question} value={item.question} className="rounded-2xl border bg-card px-5 not-last:border-b sm:px-6">
                  <AccordionTrigger className="py-5 text-base font-bold text-brand-navy hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                    <FaqAnswer answer={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Link
              href="/affiliate/faq"
              className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-blue-strong underline-offset-4 hover:underline"
            >
              See all {AFFILIATE_FAQ.length} FAQs
              <Icon icon={ArrowRight01Icon} size={16} />
            </Link>
          </div>
          <div className="grid gap-4 lg:sticky lg:top-28">
            <GuaranteeCard />
            <AffiliateHelpCard />
          </div>
        </div>
      </section>
    </>
  )
}
