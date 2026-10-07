import type { Metadata } from "next"
import { AffiliateHelpCard, GuaranteeCard } from "@/components/affiliate/affiliate-bits"
import { PasswordField } from "@/components/auth/password-field"
import { ComboboxField, RequestForm, TextField } from "@/components/forms/form-kit"
import { PageHero } from "@/components/site/page-hero"
import { COUNTRIES } from "@/lib/data/lists"

export const metadata: Metadata = {
  title: "Affiliate registration — TravelBeta",
  description: "Register as a TravelBeta affiliate and get amazing rewards on flights, hotels, tours and visa processing.",
}

function FormSection({ step, title, body }: { step: number; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 sm:col-span-2 [&:not(:first-child)]:mt-4 [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-6">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-navy text-sm font-extrabold text-brand-amber">{step}</span>
      <div>
        <h3 className="font-bold text-brand-navy">{title}</h3>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

export default function AffiliateRegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Affiliates"
        title="New affiliate registration"
        description="Become an affiliate and get amazing rewards."
        crumbs={[{ label: "Affiliates", href: "/affiliate" }, { label: "Register" }]}
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <RequestForm
            title="Create your affiliate account"
            description="It's free to join. Your affiliate manager will email you once your application has been reviewed."
            submitLabel="Submit registration"
            successTitle="Application received"
            successMessage="Thanks for applying. Your personal affiliate manager will email you about your application and next steps."
          >
            <FormSection step={1} title="Affiliate's information" body="You'll use this email and password to log in." />
            <TextField label="First name" name="firstName" autoComplete="given-name" required />
            <TextField label="Last name" name="lastName" autoComplete="family-name" required />
            <TextField label="Email address" name="email" type="email" autoComplete="email" required full />
            <PasswordField autoComplete="new-password" minLength={8} showStrength full />

            <FormSection step={2} title="Other information" body="Tell us about your business so we can set up your account." />
            <TextField label="Company name" name="company" autoComplete="organization" required />
            <TextField label="Phone number" name="phone" type="tel" autoComplete="tel" required />
            <TextField label="Address" name="address" autoComplete="street-address" required full />
            <TextField label="City" name="city" autoComplete="address-level2" required />
            <TextField label="State" name="state" autoComplete="address-level1" required />
            <ComboboxField label="Country" name="country" options={COUNTRIES} placeholder="Search countries" required full />
          </RequestForm>

          <div className="grid gap-4 lg:sticky lg:top-28">
            <GuaranteeCard />
            <AffiliateHelpCard />
          </div>
        </div>
      </section>
    </>
  )
}
