"use client"

import { RequestForm, TextAreaField, TextField } from "@/components/forms/form-kit"
import { FormDialog } from "@/components/packages/form-dialog"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"

/**
 * Until online checkout (passenger details + Paystack) is built, a traveller
 * can hold onto a live fare by sending it to an agent with its Duffel reference.
 */
export function ReserveWithAgent({
  trigger,
  kind,
  reference,
  summary,
}: {
  trigger: React.ReactElement
  kind: "flight" | "hotel"
  /** Duffel offer / search-result id, so the agent can retrieve the exact fare. */
  reference: string
  /** Human-readable line, e.g. "Lagos → London · Thu 18 Dec · ₦1,240,000". */
  summary: string
}) {
  return (
    <FormDialog
      trigger={trigger}
      title={kind === "flight" ? "Book this flight" : "Book this hotel"}
      description={`${summary}. Leave your details and a TravelBeta agent will confirm availability and complete the booking with you.`}
    >
      <RequestForm
        className="rounded-none border-0 shadow-none"
        submitLabel="Send to an agent"
        successTitle="We've got it"
        successMessage="An agent will contact you shortly to confirm the price and complete your booking. Live prices can change until the booking is paid."
        successAction={
          <DialogClose render={<Button className="h-11 rounded-full bg-brand-navy px-6 font-semibold" />}>Done</DialogClose>
        }
        // TODO: POST to the booking-request endpoint (include `reference`).
      >
        <input type="hidden" name="reference" value={reference} />
        <input type="hidden" name="summary" value={summary} />
        <TextField label="First name" name="firstName" autoComplete="given-name" required />
        <TextField label="Last name" name="lastName" autoComplete="family-name" required />
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
        <TextField label="Phone" name="phone" type="tel" autoComplete="tel" required />
        <TextAreaField label="Anything we should know?" name="notes" rows={3} placeholder="Names as on passports, special assistance, flexible dates…" />
      </RequestForm>
    </FormDialog>
  )
}
