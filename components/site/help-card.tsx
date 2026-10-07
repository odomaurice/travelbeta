import { Call02Icon, CustomerSupportIcon, Mail01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { CONTACT } from "@/lib/data/site"
import { cn } from "@/lib/utils"

/** Sidebar card with the right team's phone and email for a page. */
export function HelpCard({
  title = "Need help?",
  body = "Our travel experts are available 24/7 to help you.",
  phones = [CONTACT.emergency],
  email = CONTACT.emails.info,
  className,
}: {
  title?: string
  body?: string
  phones?: { display: string; tel: string }[]
  email?: string
  className?: string
}) {
  return (
    <aside className={cn("rounded-3xl bg-brand-navy p-6 text-white", className)}>
      <Icon icon={CustomerSupportIcon} size={30} className="text-brand-amber" />
      <p className="mt-4 text-lg font-bold">{title}</p>
      <p className="mt-1 text-sm text-white/70">{body}</p>
      <div className="mt-5 grid gap-2 text-sm font-semibold">
        {phones.map((p) => (
          <a key={p.tel} href={`tel:${p.tel}`} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
            <Icon icon={Call02Icon} size={18} className="text-brand-amber" />
            {p.display}
          </a>
        ))}
        <a href={`mailto:${email}`} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 break-all transition hover:bg-white/15">
          <Icon icon={Mail01Icon} size={18} className="shrink-0 text-brand-amber" />
          {email}
        </a>
      </div>
    </aside>
  )
}
