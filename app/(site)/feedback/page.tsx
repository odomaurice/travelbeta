import type { Metadata } from "next"
import { BubbleChatIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { RadioPills, RequestForm, TextAreaField, TextField } from "@/components/forms/form-kit"
import { HelpCard } from "@/components/site/help-card"
import { PageHero } from "@/components/site/page-hero"

export const metadata: Metadata = {
  title: "Feedback & Complaints — TravelBeta",
  description: "Share feedback, a complaint or a compliment with TravelBeta. Every message is read and responded to.",
}

const PROMISES = [
  "Every message is read by a member of our team.",
  "We respond to every message we receive.",
  "Your feedback helps us improve the way we serve you.",
]

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        eyebrow="Feedback / complaints"
        title="We'd love to hear from you"
        description="Good or bad, tell us about your experience. Just fill out the form and we'll respond to you right away."
        crumbs={[{ label: "Feedback" }]}
      />

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <RequestForm
            title="For your feedback or complaints"
            description="Share your contact details and your message below."
            submitLabel="Send message"
            successTitle="Message received"
            successMessage="Form submitted successfully — we will get back to you as soon as possible."
          >
            <RadioPills
              label="Type"
              name="type"
              defaultValue="feedback"
              full
              options={[
                { value: "feedback", label: "Feedback" },
                { value: "complaint", label: "Complaint" },
                { value: "compliment", label: "Compliment" },
              ]}
            />
            <TextField label="First name" name="firstName" autoComplete="given-name" required />
            <TextField label="Last name" name="lastName" autoComplete="family-name" required />
            <TextField label="Email" name="email" type="email" autoComplete="email" required />
            <TextField label="Phone" name="phone" type="tel" autoComplete="tel" required />
            <TextAreaField label="Message" name="message" placeholder="Tell us what happened, including any booking reference" required />
          </RequestForm>

          <div className="grid gap-6 lg:sticky lg:top-28">
            <div className="rounded-3xl bg-brand-mist p-6 sm:p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-navy text-brand-amber">
                <Icon icon={BubbleChatIcon} size={24} />
              </span>
              <h2 className="mt-4 text-xl font-extrabold text-brand-navy">Your voice matters</h2>
              <ul className="mt-4 grid gap-3">
                {PROMISES.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-muted-foreground">
                    <Icon icon={CheckmarkCircle02Icon} size={18} className="shrink-0 text-brand-blue-strong" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <HelpCard title="Need an urgent answer?" body="For emergencies, call us and an immediate response is assured." />
          </div>
        </div>
      </section>
    </>
  )
}
