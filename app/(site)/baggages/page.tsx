import type { Metadata } from "next"
import {
  Airplane01Icon,
  Clock01Icon,
  GlobalIcon,
  Mail01Icon,
  MoneyReceive02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { ComboboxField, DateField, RadioPills, RequestForm, TextField } from "@/components/forms/form-kit"
import { HelpCard } from "@/components/site/help-card"
import { PageHero } from "@/components/site/page-hero"
import { AIRLINES, AIRPORTS } from "@/lib/data/lists"

export const metadata: Metadata = {
  title: "Blue Ribbon Delayed Baggage Service — TravelBeta",
  description:
    "Track checked bags and get your delayed baggage returned faster, on every flight and every airline worldwide.",
}

const HIGHLIGHTS = [
  { icon: GlobalIcon, title: "Every flight, every airline", body: "Covers every flight on every airline, anywhere in the world." },
  { icon: Mail01Icon, title: "Live email updates", body: "Get an email each time the status of your mishandled bag changes." },
  { icon: Clock01Icon, title: "Expedited return", body: "If your bag is delayed, its return is fast-tracked for 96 hours after you land." },
  { icon: MoneyReceive02Icon, title: "Guaranteed payment", body: "If the bag isn't found within 96 hours (4 days) of arrival, you get paid." },
]

const RULES = [
  "One service agreement covers all bags checked at the airport, including last-minute gate check-ins.",
  "Each purchase is per person, per airline confirmation number, no matter how many connections.",
  "Buy any time up until your flight departs.",
  "It must be bought before all flights in an inbound or outbound itinerary — it can't be added mid-connection.",
  "Blue Ribbon is a service on top of any insurance you have, not a replacement for it.",
]

const STEPS = [
  { title: "File with your airline", body: "Report the missing bag at the airline's desk and keep the reference they give you." },
  { title: "Tell us within 24 hours", body: "Report the mishandled bag to us within 24 hours of your flight's arrival." },
  { title: "We track it for you", body: "We chase the bag and send you an email every time its status changes." },
  { title: "Get paid if it's lost", body: "No proof of contents needed. If it isn't found within 96 hours, you receive the guarantee payment." },
]

export default function BaggagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Blue Ribbon baggage service"
        title="Lost luggage shouldn't ruin your trip"
        description="We track your checked bags and, if one goes missing, we chase it down — and pay you if it isn't found within four days."
        crumbs={[{ label: "Blue Ribbon baggage" }]}
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="rounded-3xl border bg-card p-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent text-brand-navy">
                <Icon icon={h.icon} size={24} />
              </span>
              <h2 className="mt-4 font-bold">{h.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-mist px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">If your bag goes missing</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">What happens next</h2>
            <ol className="mt-8 space-y-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-navy font-extrabold text-brand-amber">{i + 1}</span>
                  <div>
                    <h3 className="font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl bg-card p-6 ring-1 ring-border sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Icon icon={Search01Icon} size={20} className="text-brand-blue-strong" />
              Good to know
            </h2>
            <ul className="mt-5 space-y-4">
              {RULES.map((r) => (
                <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                  <Icon icon={Airplane01Icon} size={16} className="mt-0.5 shrink-0 text-brand-amber" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="request" className="scroll-mt-28 px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <RequestForm
            title="Request Blue Ribbon baggage service"
            description="Fill in your trip details and we'll get back to you right away."
            submitLabel="Request baggage service"
            successTitle="Request received"
            successMessage="Thanks — our team will contact you shortly to complete your Blue Ribbon cover."
          >
            <ComboboxField label="Departure airport" name="departureAirport" options={AIRPORTS} placeholder="Search airports" required />
            <ComboboxField label="Arrival airport" name="arrivalAirport" options={AIRPORTS} placeholder="Search airports" required />
            <ComboboxField label="Airline" name="airline" options={AIRLINES} placeholder="Search airlines" required />
            <DateField label="Arrival date" name="arrivalDate" required />
            <TextField label="First name" name="firstName" autoComplete="given-name" required />
            <TextField label="Last name" name="lastName" autoComplete="family-name" required />
            <TextField label="Email" name="email" type="email" autoComplete="email" required />
            <TextField label="Phone" name="phone" type="tel" autoComplete="tel" required />
            <RadioPills
              label="Do you already have a ticket?"
              name="hasTicket"
              defaultValue="yes"
              full
              options={[
                { value: "yes", label: "Yes, I have a ticket" },
                { value: "no", label: "Not yet" },
              ]}
            />
          </RequestForm>
          <HelpCard title="Questions about Blue Ribbon?" body="Our team is available around the clock to help with delayed or lost bags." className="lg:sticky lg:top-28" />
        </div>
      </section>
    </>
  )
}
