import type { Metadata } from "next"
import { LegalDocument, type LegalSection } from "@/components/content/legal-document"
import { PageHero } from "@/components/site/page-hero"
import { CONTACT } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "Booking Terms and Conditions — TravelBeta",
  description: "Travelbeta.com booking terms and conditions for flights and other reservations.",
}

const SECTIONS: LegalSection[] = [
  {
    id: "local-bookings",
    title: "Local Bookings",
    body: (
      <p>
        All local bookings are contingent upon airline availability and are valid for five minutes to one hour from the time of booking until payment confirmation and ticket issuance. Once the customer completes payment online and receives a payment confirmation message from the system, the system automatically issues the flight ticket based on the information provided during the booking process. (Auto ticketing is only available on local bookings.)
      </p>
    ),
  },
  {
    id: "fares-and-availability",
    title: "Fares and Availability",
    body: <p>All fares quoted on www.travelbeta.com are subject to availability and may change at any time based on the third-party airline operators.</p>,
  },
  {
    id: "passenger-responsibility",
    title: "Passenger Responsibility",
    body: (
      <p>
        Passengers are responsible for all card transactions (whether successful or unsuccessful), ensuring the accuracy of travel details, compliance with visa requirements, and the adequacy of travel itineraries and names as they appear on passports. The company is not liable for any inconvenience, denied boarding, or additional costs caused by inaccurate or incomplete information entered by the customer during the booking process.
      </p>
    ),
  },
  {
    id: "ticket-issuance",
    title: "Ticket Issuance",
    body: (
      <p>
        Ticket issuance is contingent upon payment confirmation by Travelbeta. Payments are considered final and non-refundable once the auto-ticketing process is initiated. (Auto ticketing is only available on local bookings.)
      </p>
    ),
  },
  {
    id: "passport-validity",
    title: "Passport Validity",
    body: (
      <p>
        It is imperative that your international passport has at least six months of validity remaining prior to its expiration date, as Travelbeta will not be liable for any defaults regarding this requirement.
      </p>
    ),
  },
  {
    id: "non-card-transactions",
    title: "Non-Card Transactions",
    body: (
      <p>
        For all non-card transactions, please contact us at <a href={`tel:${CONTACT.main.tel}`}>07001110111</a> or send an email to{" "}
        <a href={`mailto:${CONTACT.emails.info}`}>{CONTACT.emails.info}</a> to confirm booking details, travel dates, and requirements before proceeding with payment.
      </p>
    ),
  },
  {
    id: "refunds-cancellations-changes",
    title: "Refunds, Cancellations, and Changes",
    body: (
      <p>
        Refunds, cancellations, and change requests, where applicable, are subject to the policies of the third-party operating airlines, plus a service charge of 10% of the refunded value. Refund settlements will be processed in accordance with funds remitted by the operating airline and will take a minimum of six to eight weeks.
      </p>
    ),
  },
  {
    id: "airport-arrival-time",
    title: "Airport Arrival Time",
    body: <p>Passengers are advised to arrive at the airport at least 3-5 hours prior to flight departure.</p>,
  },
  {
    id: "first-time-travelers",
    title: "First-Time Travelers",
    body: (
      <p>
        First-time travelers are encouraged to have a return flight ticket, confirmed hotel accommodation, and a minimum of $1000 for Personal Travel Allowance (PTA) or Business Travel Allowance (BTA).
      </p>
    ),
  },
  {
    id: "documents-for-minors",
    title: "Required Documents for Minors",
    body: <p>An original child&apos;s birth certificate and a consent letter from parents must be presented at the check-in counter at the airport.</p>,
  },
  {
    id: "ticket-restrictions",
    title: "Ticket Restrictions",
    body: (
      <p>
        All tickets are non-transferable at any time. Some tickets may also be non-refundable or non-changeable. Additionally, certain airlines may require additional medical reports or documents in the case of pregnant passengers.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms and conditions"
        title="Travelbeta.com Booking Terms and Conditions"
        description="Please read these terms carefully before making a booking."
        crumbs={[{ label: "Terms and conditions" }]}
      />
      <LegalDocument
        intro={
          <>
            <h2 className="text-lg font-extrabold text-brand-navy">Terms and Condition</h2>
            <p>
              All bookings and reservations made on Travelbeta.com are subject to the rules and terms of carriage set forth by the third-party operating airlines. Travelbeta acts solely as a travel agent for these airlines and shall not be held responsible for any additional costs incurred by passengers due to delays, losses, cancellations, changes, or inaccuracies arising during the booking process or after ticket issuance.
            </p>
          </>
        }
        sections={SECTIONS}
        footer={
          <p className="mt-4 rounded-3xl border-l-4 border-brand-amber bg-card p-6 font-medium text-brand-navy ring-1 ring-border">
            By making a booking through Travelbeta, you confirm that you have read and understood this booking information notice and agree to waive all rights by law to hold Travelbeta harmless from any liabilities that may arise thereof.
          </p>
        }
      />
    </>
  )
}
