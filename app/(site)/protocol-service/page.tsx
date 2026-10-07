import type { Metadata } from "next"
import { AirplaneTakeOff01Icon, PassportValidIcon, SecurityCheckIcon, UserCheck01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { ComboboxField, DateField, RadioPills, RequestForm, TextField } from "@/components/forms/form-kit"
import { HelpCard } from "@/components/site/help-card"
import { PageHero } from "@/components/site/page-hero"
import { AIRLINES, AIRPORTS } from "@/lib/data/lists"

export const metadata: Metadata = {
  title: "Protocol Service — TravelBeta",
  description:
    "Airport protocol officers who handle immigration and airport security for smooth clearance, meet and greet, and speedy passage through immigration.",
}

const INCLUDED = [
  { icon: SecurityCheckIcon, title: "Smooth airport clearance", body: "We deal with airport security on your behalf so you clear the airport without hassle." },
  { icon: UserCheck01Icon, title: "Effective meet & greet", body: "A protocol officer meets you at the airport and stays with you through the process." },
  { icon: PassportValidIcon, title: "Stress-free immigration", body: "We liaise with the immigration authorities so the procedures are stress-free." },
  { icon: AirplaneTakeOff01Icon, title: "Speedy passage", body: "Move through immigration quickly and get on with your journey." },
]

export default function ProtocolServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Protocol service"
        title="Glide through the airport, we'll handle the formalities"
        description="Our protocol officers have strong relationships with government agencies at international and domestic airports around the world."
        crumbs={[{ label: "Protocol service" }]}
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">What&apos;s included</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">One of the best protocol services</h2>
            </div>
            <p className="text-muted-foreground">
              We take on the responsibility of dealing with immigration authorities and airport security, to ensure smooth
              airport clearance, effective meet and greet, stress-free immigration procedures and speedy passage through
              immigration for every client.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map((h) => (
              <li key={h.title} className="rounded-3xl border bg-card p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent text-brand-navy">
                  <Icon icon={h.icon} size={24} />
                </span>
                <h3 className="mt-4 font-bold">{h.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{h.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="request" className="scroll-mt-28 bg-brand-mist px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <RequestForm
            title="Request protocol service"
            description="Just fill out the form and we'll respond to you right away."
            submitLabel="Request protocol service"
            successTitle="Request received"
            successMessage="Form submitted successfully — we will get back to you as soon as possible."
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
          <HelpCard title="Questions about protocol service?" body="Our team is available around the clock to help you plan your arrival." className="lg:sticky lg:top-28" />
        </div>
      </section>
    </>
  )
}
