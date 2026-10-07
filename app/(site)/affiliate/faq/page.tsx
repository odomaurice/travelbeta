import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { AffiliateHelpCard, FaqAnswer, GuaranteeCard } from "@/components/affiliate/affiliate-bits"
import { Icon } from "@/components/icons"
import { PageHero } from "@/components/site/page-hero"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { AFFILIATE_FAQ } from "@/lib/data/affiliate-faq"

export const metadata: Metadata = {
  title: "Affiliate FAQs — TravelBeta",
  description: "Answers about joining the TravelBeta affiliate programme: fees, tools, white labels and how you get paid.",
}

export default function AffiliateFaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Affiliate FAQs"
        title="Frequently asked questions"
        description="Everything you need to know about becoming a TravelBeta affiliate — from joining and tools to getting paid."
        crumbs={[{ label: "Affiliates", href: "/affiliate" }, { label: "FAQs" }]}
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div>
            <Accordion multiple defaultValue={[0]} className="gap-3">
              {AFFILIATE_FAQ.map((item, i) => (
                <AccordionItem key={item.question} value={i} className="rounded-2xl border bg-card px-5 not-last:border-b sm:px-6">
                  <AccordionTrigger className="gap-4 py-5 text-base font-bold text-brand-navy hover:no-underline">
                    <span className="flex gap-3">
                      <span className="mt-px text-sm font-extrabold text-brand-blue-strong tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-8 text-[15px] leading-relaxed text-muted-foreground">
                    <FaqAnswer answer={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 flex flex-col items-start gap-4 rounded-3xl bg-brand-mist p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-lg font-bold text-brand-navy">Ready to join?</p>
                <p className="mt-1 text-sm text-muted-foreground">It&apos;s free to join, with no start-up fees.</p>
              </div>
              <Button
                nativeButton={false}
                render={<Link href="/affiliate/register" />}
                className="h-12 shrink-0 rounded-full bg-brand-amber px-6 text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90"
              >
                Become an affiliate
                <Icon icon={ArrowRight01Icon} size={18} />
              </Button>
            </div>
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
