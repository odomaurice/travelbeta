import { CheckmarkBadge01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { HelpCard } from "@/components/site/help-card"
import { CONTACT } from "@/lib/data/site"
import { cn } from "@/lib/utils"

/** "Satisfaction Guarantee" card from the original affiliate pages. */
export function GuaranteeCard({ className }: { className?: string }) {
  return (
    <aside className={cn("rounded-3xl border bg-card p-6", className)}>
      <span className="grid size-12 place-items-center rounded-2xl bg-brand-amber/15 text-[#9a6b00]">
        <Icon icon={CheckmarkBadge01Icon} size={26} />
      </span>
      <p className="mt-4 text-lg font-bold text-brand-navy">Satisfaction guarantee</p>
      <p className="mt-1 text-sm text-muted-foreground">Receive a refund on your travel insurance premium within 10 days of purchase.</p>
    </aside>
  )
}

/** Help card wired to the affiliates team. */
export function AffiliateHelpCard({ className }: { className?: string }) {
  return (
    <HelpCard
      title="Need TravelBeta help?"
      body="We would be more than happy to help you. Our team advisors are 24/7 at your service."
      phones={[CONTACT.affiliates]}
      email={CONTACT.affiliates.email}
      className={className}
    />
  )
}

const EMAIL = CONTACT.affiliates.email

/** Turns the affiliates email address inside an answer into a mailto link. */
function withEmailLinks(text: string) {
  const parts = text.split(EMAIL)
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <a key={i} href={`mailto:${EMAIL}`} className="font-semibold text-brand-blue-strong underline-offset-4 hover:underline">
            {EMAIL}
          </a>,
          part,
        ]
  )
}

/**
 * Renders an FAQ answer: paragraphs normally, or a checklist when the answer
 * is a list of short points (e.g. "What affiliate tools are provided?").
 */
export function FaqAnswer({ answer }: { answer: string[] }) {
  const isList = answer.length > 2 && answer.every((p) => p.length < 140)
  if (isList) {
    return (
      <ul className="space-y-2.5">
        {answer.map((p) => (
          <li key={p} className="flex gap-3">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-brand-navy">
              <Icon icon={Tick02Icon} size={13} />
            </span>
            <span>{withEmailLinks(p)}</span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="space-y-3">
      {answer.map((p) => (
        <p key={p}>{withEmailLinks(p)}</p>
      ))}
    </div>
  )
}
