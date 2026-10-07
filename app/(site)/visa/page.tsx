import type { Metadata } from "next"
import {
  Alert02Icon,
  Calendar03Icon,
  DocumentValidationIcon,
  File01Icon,
  InformationCircleIcon,
  UserAccountIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { ComboboxField, DateField, FileField, RequestForm, TextAreaField, TextField } from "@/components/forms/form-kit"
import { HelpCard } from "@/components/site/help-card"
import { PageHero } from "@/components/site/page-hero"
import { COUNTRIES } from "@/lib/data/lists"
import { CONTACT } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "Visa Assistance — TravelBeta",
  description:
    "TravelBeta's specialised visa team profiles you, completes your forms, vets your documents, books appointments and preps you for interviews.",
}

const STEPS = [
  { icon: UserAccountIcon, title: "Profiling", body: "We review your travel purpose and background to plan the strongest application." },
  { icon: File01Icon, title: "Application forms", body: "We help you complete your visa application forms correctly." },
  { icon: DocumentValidationIcon, title: "Document vetting", body: "Our experts check your supporting documents before submission." },
  { icon: Calendar03Icon, title: "Appointment dates", body: "We get you an appointment date at the embassy or visa centre." },
  { icon: UserMultipleIcon, title: "Pre-interview session", body: "Where applicable, we prepare you for your visa interview." },
]

export default function VisaPage() {
  return (
    <>
      <PageHero
        eyebrow="Travel visa assistance program"
        title="Expert help with your visa application"
        description="TravelBeta's visa team is made up of specialised, seasoned experts in visa processing — here to guide you from first questions to interview day."
        crumbs={[{ label: "Visa assistance" }]}
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Our process</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">Five steps to a stronger application</h2>
            <p className="mt-3 text-muted-foreground">
              Every step is aimed at one thing: increasing your chances of visa success.
            </p>
          </div>

          <ol className="relative mt-12 grid gap-8 lg:grid-cols-5 lg:gap-6">
            {/* connecting line: vertical on mobile, horizontal on desktop */}
            <span aria-hidden className="absolute top-2 bottom-2 left-6 w-px border-l-2 border-dashed border-brand-sky lg:hidden" />
            <span aria-hidden className="absolute top-6 right-[10%] left-[10%] hidden h-px border-t-2 border-dashed border-brand-sky lg:block" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-brand-navy text-brand-amber ring-8 ring-background">
                  <Icon icon={s.icon} size={22} />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Step {i + 1}</p>
                  <h3 className="mt-1 font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex gap-4 rounded-3xl border border-brand-amber/40 bg-brand-amber/10 p-6 sm:p-8">
            <Icon icon={Alert02Icon} size={24} className="mt-0.5 shrink-0 text-brand-navy" />
            <div>
              <h3 className="font-bold text-brand-navy">Please note</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We do not encourage immigration defaults, and the issuance of visas is at the discretion of the embassy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-28 bg-brand-mist px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <RequestForm
            title="Get visa assistance now"
            description="We're bringing you a new level of comfort. Share your traveller information and a visa consultant will take it from here."
            submitLabel="Submit application"
            successTitle="Thank you — order received"
            successMessage="Your order will be processed soon. An email has been sent to you as confirmation, and our agent will contact you as your application is being processed."
          >
            <p className="flex items-start gap-3 rounded-xl bg-brand-sky/40 px-4 py-3 text-sm text-brand-navy sm:col-span-2">
              <Icon icon={InformationCircleIcon} size={18} className="mt-0.5 shrink-0 text-brand-blue-strong" />
              Passenger details must be entered exactly as they appear on the passport.
            </p>
            <TextField label="First name" name="firstName" autoComplete="given-name" required />
            <TextField label="Last name" name="lastName" autoComplete="family-name" required />
            <TextField label="Email" name="email" type="email" autoComplete="email" required />
            <TextField label="Phone" name="phone" type="tel" autoComplete="tel" required />
            <DateField label="Departure date" name="departureDate" required />
            <DateField label="Return date" name="returnDate" required />
            <ComboboxField label="Destination country" name="destinationCountry" options={COUNTRIES} placeholder="Search countries" required />
            <ComboboxField label="Passport country" name="passportCountry" options={COUNTRIES} placeholder="Search countries" required />
            <TextField label="Passport number" name="passportNumber" autoComplete="off" required full />
            <FileField label="Upload passport" name="passport" hint="A clear scan or photo of your passport data page." required />
            <TextAreaField label="Message" name="message" placeholder="Tell us about your trip or any questions you have" />
          </RequestForm>
          <HelpCard
            title="Talk to a visa consultant"
            body="Contact our visa consultants for all your travel visa related questions."
            phones={[CONTACT.visa]}
            email={CONTACT.visa.email}
            className="lg:sticky lg:top-28"
          />
        </div>
      </section>
    </>
  )
}
