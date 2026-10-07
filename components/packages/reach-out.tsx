import { Call02Icon, Mail01Icon, NewTwitterIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { CONTACT } from "@/lib/data/site"

const CHANNELS = [
  { icon: Mail01Icon, label: "Tours & packages", value: CONTACT.emails.tours, href: `mailto:${CONTACT.emails.tours}` },
  { icon: Mail01Icon, label: "Hotel bookings", value: CONTACT.emails.hotels, href: `mailto:${CONTACT.emails.hotels}` },
  { icon: Call02Icon, label: "Call us", value: CONTACT.main.display, href: `tel:${CONTACT.main.tel}` },
  { icon: NewTwitterIcon, label: "Tweet at us", value: "@travelbeta", href: "https://www.twitter.com/travelbeta" },
]

/** "Reach out to us" block from the original packages pages. */
export function ReachOut({ children }: { children?: React.ReactNode }) {
  return (
    <div className="grid gap-8 rounded-3xl bg-brand-mist p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
      <div>
        <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Talk to a travel expert</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">Reach out to us</h2>
        <p className="mt-3 text-muted-foreground">
          We are very approachable and would love to speak to you. Feel free to call, send us an email, tweet at us or simply complete the enquiry form.
        </p>
        {children}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {CHANNELS.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex h-full items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-border transition outline-none hover:ring-brand-blue/50 focus-visible:ring-3 focus-visible:ring-brand-blue/40"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-brand-navy">
                <Icon icon={c.icon} size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-muted-foreground">{c.label}</span>
                <span className="block truncate font-bold text-brand-navy">{c.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
