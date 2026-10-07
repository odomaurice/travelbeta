import type { Metadata } from "next"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { BankTransfer } from "@/components/services/bank-transfer"
import { HelpCard } from "@/components/site/help-card"
import { PageHero } from "@/components/site/page-hero"
import { CONTACT } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "Pay by Bank Transfer — TravelBeta",
  description:
    "TravelBeta's bank accounts for transfers, and a payment confirmation form so our payment department can confirm your payment faster.",
}

export default function ReservationPage() {
  return (
    <>
      <PageHero
        eyebrow="Payment confirmation"
        title="Pay by bank transfer"
        description="Thank you for making payment. Our payment department will confirm the payment and an agent will reach out to you."
        crumbs={[{ label: "Pay by bank transfer" }]}
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex gap-3 rounded-3xl border border-brand-amber/40 bg-brand-amber/10 p-5 text-sm sm:p-6">
            <Icon icon={InformationCircleIcon} size={20} className="mt-0.5 shrink-0 text-brand-navy" />
            <p className="text-brand-navy">
              <span className="font-bold">Before you pay: </span>
              for all non-card transactions, please contact us at{" "}
              <a href={`tel:${CONTACT.main.tel}`} className="font-semibold underline underline-offset-4">
                {CONTACT.main.display}
              </a>{" "}
              or{" "}
              <a href={`mailto:${CONTACT.emails.info}`} className="font-semibold underline underline-offset-4">
                {CONTACT.emails.info}
              </a>{" "}
              to confirm booking details, travel dates and requirements.
            </p>
          </div>

          <BankTransfer
            aside={
              <HelpCard
                title="Questions about a payment?"
                body="Call or email us and we'll help you confirm your transfer."
                phones={[CONTACT.main, CONTACT.alt]}
                className="lg:sticky lg:top-28"
              />
            }
          />
        </div>
      </section>
    </>
  )
}
