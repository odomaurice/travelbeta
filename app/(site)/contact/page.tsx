import type { Metadata } from "next"
import {
  ArrowRight01Icon,
  Beach02Icon,
  Building03Icon,
  Call02Icon,
  Hotel01Icon,
  Location01Icon,
  Mail01Icon,
  PassportIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { RequestForm, TextAreaField, TextField } from "@/components/forms/form-kit"
import { HelpCard } from "@/components/site/help-card"
import { PageHero } from "@/components/site/page-hero"
import { CONTACT } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "Contact Us — TravelBeta",
  description:
    "Reach TravelBeta's Lagos head office or Abuja office by phone, email or in person, or leave us a message.",
}

const TEAMS = [
  { icon: PassportIcon, label: "Visa", body: "Visa applications & questions", email: CONTACT.visa.email },
  { icon: Beach02Icon, label: "Tours & packages", body: "Vacation packages and tours", email: CONTACT.emails.tours },
  { icon: Hotel01Icon, label: "Hotels", body: "Hotel bookings and changes", email: CONTACT.emails.hotels },
  { icon: UserGroupIcon, label: "Affiliates", body: "Partnerships and commissions", email: CONTACT.affiliates.email },
]

const mapSrc = (address: string) => `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="How can we help?"
        description="We are here to answer any questions you may have. Call, email, visit one of our offices or leave us a message."
        crumbs={[{ label: "Contact us" }]}
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          {CONTACT.offices.map((o) => {
            const address = o.lines.join(" ")
            return (
              <article key={o.name} className="flex flex-col overflow-hidden rounded-3xl border bg-card">
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-navy text-brand-amber">
                      <Icon icon={Building03Icon} size={24} />
                    </span>
                    <h2 className="text-xl font-extrabold text-brand-navy">{o.name}</h2>
                  </div>
                  <ul className="mt-6 grid gap-4 text-sm">
                    <li className="flex gap-3">
                      <Icon icon={Location01Icon} size={18} className="mt-0.5 shrink-0 text-brand-blue-strong" />
                      <address className="not-italic">
                        {o.lines.map((l) => (
                          <span key={l} className="block">
                            {l}
                          </span>
                        ))}
                      </address>
                    </li>
                    <li className="flex gap-3">
                      <Icon icon={Mail01Icon} size={18} className="mt-0.5 shrink-0 text-brand-blue-strong" />
                      <a href={`mailto:${o.email}`} className="font-semibold text-brand-blue-strong underline-offset-4 hover:underline">
                        {o.email}
                      </a>
                    </li>
                    <li className="flex gap-3">
                      <Icon icon={Call02Icon} size={18} className="mt-0.5 shrink-0 text-brand-blue-strong" />
                      <span className="flex flex-wrap gap-x-4 gap-y-1">
                        {o.phones.map((p) => (
                          <a key={p.tel} href={`tel:${p.tel}`} className="font-semibold text-brand-blue-strong underline-offset-4 hover:underline">
                            {p.display}
                          </a>
                        ))}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="px-3 pb-3">
                  <iframe
                    title={`Map showing the TravelBeta ${o.name}`}
                    src={mapSrc(address)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-64 w-full rounded-2xl border-0 bg-muted"
                  />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="bg-brand-mist px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Specialised teams</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">Email the right team directly</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAMS.map((t) => (
              <li key={t.label}>
                <a
                  href={`mailto:${t.email}`}
                  className="group flex h-full flex-col rounded-3xl border bg-card p-6 transition outline-none hover:border-brand-blue hover:shadow-md focus-visible:ring-3 focus-visible:ring-brand-blue/30"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent text-brand-navy">
                    <Icon icon={t.icon} size={24} />
                  </span>
                  <span className="mt-4 font-bold">{t.label}</span>
                  <span className="mt-1 text-sm text-muted-foreground">{t.body}</span>
                  <span className="mt-4 flex items-center gap-1 text-sm font-semibold break-all text-brand-blue-strong">
                    {t.email}
                    <Icon icon={ArrowRight01Icon} size={16} className="shrink-0 transition group-hover:translate-x-0.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="message" className="scroll-mt-28 px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <RequestForm
            title="Leave us a message"
            description="Send us a note and the right person on our team will get back to you."
            submitLabel="Send message"
            successTitle="Message sent"
            successMessage="Thanks for reaching out — we will get back to you as soon as possible."
            consent={false}
          >
            <TextField label="First name" name="firstName" autoComplete="given-name" required />
            <TextField label="Last name" name="lastName" autoComplete="family-name" required />
            <TextField label="Email" name="email" type="email" autoComplete="email" required />
            <TextField label="Phone" name="phone" type="tel" autoComplete="tel" required />
            <TextAreaField label="Message" name="message" placeholder="How can we help?" required />
          </RequestForm>
          <HelpCard
            title="Travel emergency?"
            body="For emergencies, call us and an immediate response is assured."
            className="lg:sticky lg:top-28"
          />
        </div>
      </section>
    </>
  )
}
