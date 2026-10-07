"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Call02Icon, HelpCircleIcon, Mail01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { SectionHeading } from "@/components/site/section-heading"
import { CONTACT } from "@/lib/data/site"
import { cn } from "@/lib/utils"

type Faq = { topic: Topic; q: string; a: React.ReactNode; text: string }
type Topic = "Booking" | "Payments & changes" | "Before you fly" | "Visas & extras"

const TOPICS: Topic[] = ["Booking", "Payments & changes", "Before you fly", "Visas & extras"]

// Answers follow travelbeta.com's booking terms, Blue Ribbon and visa pages.
// `text` is the plain-text version used for search.
function faq(topic: Topic, q: string, a: React.ReactNode, text: string): Faq {
  return { topic, q, a, text }
}

const FAQS: Faq[] = [
  faq(
    "Booking",
    "How do I book a flight on TravelBeta?",
    <>Pick where you&apos;re leaving from and where you&apos;re going, choose your dates, travellers and cabin, then search. Choose a flight, enter each passenger&apos;s details exactly as they appear on their passport or ID, and pay. Your e-ticket is emailed once payment is confirmed.</>,
    "pick from to dates travellers cabin search choose flight passenger details passport id pay e-ticket emailed"
  ),
  faq(
    "Booking",
    "How does the route map decide between flight, train, bus or car?",
    <>It looks at the distance between your cities and the connections that actually exist — like the Lagos–Ibadan and Abuja–Kaduna rail lines, or road links across West Africa. Short trips with rail lead with the train, short road trips suggest a bus, and longer journeys suggest flying. You can switch to any other option shown. Times are planning estimates, not schedules.</>,
    "route map decide flight train bus car distance rail road estimate"
  ),
  faq(
    "Booking",
    "How long is my booking held before I pay?",
    <>Local bookings depend on airline availability and are held for between five minutes and one hour until payment is confirmed. Once you pay online and get a confirmation message, local tickets are issued automatically. All fares are subject to availability and can change until you pay.</>,
    "held hold how long pay five minutes one hour local auto ticketing fares availability"
  ),
  faq(
    "Booking",
    "Can I book for someone else?",
    <>Yes — enter the traveller&apos;s details instead of your own, exactly as they appear on their passport. The person who books is responsible for the accuracy of names and travel details, so double-check before paying.</>,
    "book for someone else another person details passport accuracy"
  ),
  faq(
    "Booking",
    "I didn't get my e-ticket. What should I do?",
    <>Check your spam or promotions folder first. If it&apos;s not there, use <Link href="/?tab=manage#plan">Manage booking</Link> or call our 24/7 line on {CONTACT.emergency.display} with your booking reference and we&apos;ll resend it.</>,
    "e-ticket ticket not received email spam resend manage booking"
  ),
  faq(
    "Payments & changes",
    "What payment methods do you accept?",
    <>You can pay by card through Paystack, Flutterwave or Interswitch, or by bank transfer to our Zenith, Globus or GTBank accounts — see <Link href="/reservation">Pay by bank transfer</Link>. For any non-card payment, please call {CONTACT.main.display} or email {CONTACT.emails.info} first to confirm your booking details and travel dates.</>,
    "payment methods card paystack flutterwave interswitch bank transfer zenith globus gtbank"
  ),
  faq(
    "Payments & changes",
    "Can I change or cancel my booking?",
    <>Where the airline allows it, yes. Changes, cancellations and refunds follow the operating airline&apos;s rules, plus a TravelBeta service charge of 10% of the refunded value. Some tickets are non-refundable or non-changeable, so check your fare rules before booking.</>,
    "change cancel booking airline rules service charge 10% non-refundable"
  ),
  faq(
    "Payments & changes",
    "How long do refunds take?",
    <>Refunds are paid out as the airline releases the funds and take a minimum of six to eight weeks. Once auto-ticketing has started on a local booking, the payment is final and can&apos;t be refunded.</>,
    "refund how long six eight weeks airline final auto-ticketing"
  ),
  faq(
    "Payments & changes",
    "Can I transfer my ticket to someone else?",
    <>No. Tickets are non-transferable at any time, so make sure each name matches the traveller&apos;s passport.</>,
    "transfer ticket someone else non-transferable name"
  ),
  faq(
    "Before you fly",
    "How early should I get to the airport?",
    <>We advise arriving 3–5 hours before your flight departs, especially for international flights.</>,
    "how early airport arrive hours before departure"
  ),
  faq(
    "Before you fly",
    "How long must my passport be valid?",
    <>Your international passport should have at least six months of validity left. TravelBeta can&apos;t be held liable if a passport doesn&apos;t meet this requirement.</>,
    "passport valid validity six months"
  ),
  faq(
    "Before you fly",
    "I'm travelling abroad for the first time. What do I need?",
    <>First-time travellers are encouraged to carry a return ticket, confirmed hotel accommodation, and at least $1,000 for Personal or Business Travel Allowance (PTA/BTA).</>,
    "first time abroad return ticket hotel pta bta $1000 allowance"
  ),
  faq(
    "Before you fly",
    "What documents do children need?",
    <>Minors must present an original birth certificate and a consent letter from their parents at the airport check-in counter. Some airlines also ask pregnant passengers for medical reports — check with us before you fly.</>,
    "children minors birth certificate consent letter parents pregnant medical"
  ),
  faq(
    "Visas & extras",
    "Can TravelBeta help with my visa?",
    <>Yes. Our visa team handles profiling, filling in application forms, vetting documents, getting appointment dates and pre-interview sessions where needed, to improve your chances. Issuing a visa is always at the embassy&apos;s discretion. <Link href="/visa">Start a visa application</Link>.</>,
    "visa help assistance profiling forms documents appointment interview embassy"
  ),
  faq(
    "Visas & extras",
    "What is Blue Ribbon baggage protection?",
    <>A service that tracks your checked bags on any airline. If a bag is delayed, its return is expedited, you get email updates on every status change, and if it isn&apos;t found within 96 hours of arrival you receive a guaranteed payment — no proof of contents needed. <Link href="/baggages">Learn more</Link>.</>,
    "blue ribbon baggage luggage lost delayed 96 hours payment"
  ),
  faq(
    "Visas & extras",
    "What is the protocol service?",
    <>Our protocol officers meet you at the airport and handle immigration and security formalities for a smooth, speedy passage — at international and domestic airports. <Link href="/protocol-service">Request protocol service</Link>.</>,
    "protocol service airport meet greet immigration fast track"
  ),
  faq(
    "Visas & extras",
    "How do I become a TravelBeta affiliate?",
    <>It&apos;s free to join. <Link href="/affiliate/register">Register as an affiliate</Link> and your affiliate manager will be in touch with tools and links to start earning on flights, hotels, car rentals and packages.</>,
    "affiliate partner join register commission"
  ),
]

export function Faq() {
  const [topic, setTopic] = useState<Topic | "All">("All")
  const [query, setQuery] = useState("")

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter(
      (f) => (topic === "All" || f.topic === topic) && (!q || f.q.toLowerCase().includes(q) || f.text.includes(q))
    )
  }, [topic, query])

  return (
    <section id="faq" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="FAQs"
            title="Questions travellers ask us most"
            description="Booking, payments, refunds, documents and visas — answered. Can't find yours? We're a call away."
          />
          <div className="mt-8 rounded-3xl bg-brand-navy p-6 text-white">
            <Icon icon={HelpCircleIcon} size={28} className="text-brand-amber" />
            <p className="mt-4 text-lg font-bold">Still need help?</p>
            <p className="mt-1 text-sm text-white/70">Call our emergency line for an immediate response, any time.</p>
            <div className="mt-5 grid gap-2 text-sm font-semibold">
              <a href={`tel:${CONTACT.emergency.tel}`} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
                <Icon icon={Call02Icon} size={18} className="text-brand-amber" />
                {CONTACT.emergency.display}
                <span className="ml-auto text-xs font-medium text-white/60">24/7</span>
              </a>
              <a href={`mailto:${CONTACT.emails.info}`} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
                <Icon icon={Mail01Icon} size={18} className="text-brand-amber" />
                {CONTACT.emails.info}
              </a>
            </div>
          </div>
        </div>

        <div>
          <label className="relative block">
            <span className="sr-only">Search questions</span>
            <Icon icon={Search01Icon} size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. refund, passport, baggage"
              className="h-12 rounded-2xl pl-11 text-[15px]"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
            {(["All", ...TOPICS] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={topic === t}
                onClick={() => setTopic(t)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
                  topic === t ? "border-brand-navy bg-brand-navy text-white" : "bg-card hover:border-brand-blue hover:bg-accent"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {visible.length > 0 ? (
            <Accordion className="mt-6 rounded-3xl border bg-card px-5 sm:px-6">
              {visible.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="py-5 text-base font-bold hover:text-brand-blue-strong hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-brand-blue-strong">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="mt-6 rounded-3xl border border-dashed p-8 text-center text-muted-foreground" role="status">
              No questions match &ldquo;{query}&rdquo;. Try another word, or call us on {CONTACT.emergency.display}.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
