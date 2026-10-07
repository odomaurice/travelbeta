"use client"

import { RequestForm, SelectField, TextAreaField, TextField } from "@/components/forms/form-kit"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { FormDialog } from "./form-dialog"

// Destination list offered on travelbeta.com/packages (spelling corrected).
const DESTINATIONS = [
  "United Kingdom",
  "United States",
  "United Arab Emirates",
  "France",
  "Spain",
  "China",
  "Italy",
  "Germany",
  "Thailand",
  "Egypt",
  "Morocco",
  "Aruba",
  "Australia",
  "Nigeria",
  "South Africa",
].map((c) => ({ value: c, label: c }))

const closeAction = (
  <DialogClose render={<Button className="h-11 rounded-full bg-brand-navy px-6 font-semibold" />}>Done</DialogClose>
)

const BOOKING_CONFIRMATION =
  "Thank you, your booking order will be processed soon. An email has been sent to you as a confirmation of this order. You will be contacted soon by our agent as your booking is being processed."

function ContactFields() {
  return (
    <>
      <TextField label="Surname" name="surname" autoComplete="family-name" required />
      <TextField label="First name" name="firstName" autoComplete="given-name" required />
      <TextField label="Phone number" name="phone" type="tel" autoComplete="tel" required />
      <TextField label="Email address" name="email" type="email" autoComplete="email" required />
    </>
  )
}

/** "Customise your own package" enquiry, opened from any trigger element. */
export function CustomisePackageDialog({ trigger }: { trigger: React.ReactElement }) {
  return (
    <FormDialog
      trigger={trigger}
      title="Customise your own package"
      description="Provide your contact information. Kindly fill the enquiry form."
    >
      <RequestForm
        className="rounded-none border-0 shadow-none"
        submitLabel="Submit enquiry"
        successTitle="Booking confirmation"
        successMessage={BOOKING_CONFIRMATION}
        successAction={closeAction}
        // TODO: POST to the custom-package enquiry endpoint.
      >
        <ContactFields />
        <SelectField label="Destination country" name="destination" options={DESTINATIONS} placeholder="Choose a country" required />
        <TextField label="Budget amount (₦)" name="budget" type="number" placeholder="e.g. 1500000" required />
        <TextAreaField label="Message" name="message" placeholder="Tell us about your dream trip: dates, travellers, experiences…" />
      </RequestForm>
    </FormDialog>
  )
}

/** Reservation form for a single package. */
export function ReservePackageDialog({
  trigger,
  packageTitle,
  packageSlug,
}: {
  trigger: React.ReactElement
  packageTitle: string
  packageSlug: string
}) {
  return (
    <FormDialog trigger={trigger} title="Reserve package" description={`${packageTitle}. Provide your contact information and you will be contacted soon.`}>
      <RequestForm
        className="rounded-none border-0 shadow-none"
        submitLabel="Submit reservation"
        successTitle="Booking confirmation"
        successMessage={BOOKING_CONFIRMATION}
        successAction={closeAction}
        // TODO: POST to the package reservation endpoint.
      >
        <input type="hidden" name="package" value={packageSlug} />
        <ContactFields />
      </RequestForm>
    </FormDialog>
  )
}
