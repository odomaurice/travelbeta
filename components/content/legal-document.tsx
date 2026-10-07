import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"

export type LegalSection = { id: string; title: string; body: React.ReactNode }

/** Long-form layout for policies: sticky contents on desktop, numbered sections. */
export function LegalDocument({
  intro,
  sections,
  footer,
}: {
  intro?: React.ReactNode
  sections: LegalSection[]
  footer?: React.ReactNode
}) {
  const toc = (
    <ol className="space-y-1 text-sm">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex gap-3 rounded-lg px-3 py-2 text-muted-foreground transition outline-none hover:bg-brand-mist hover:text-brand-navy focus-visible:ring-3 focus-visible:ring-brand-blue/40"
          >
            <span className="w-5 shrink-0 font-bold text-brand-blue-strong tabular-nums">{i + 1}.</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto">
          <details className="group rounded-2xl border bg-card p-2 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 font-bold text-brand-navy [&::-webkit-details-marker]:hidden">
              On this page
              <Icon icon={ArrowDown01Icon} size={18} className="transition group-open:rotate-180" />
            </summary>
            <nav aria-label="Table of contents" className="mt-1">
              {toc}
            </nav>
          </details>
          <nav aria-label="Table of contents" className="hidden lg:block">
            <p className="mb-3 px-3 text-xs font-bold tracking-widest text-brand-blue-strong uppercase">On this page</p>
            {toc}
          </nav>
        </aside>

        <article className="max-w-prose min-w-0 text-[17px] leading-relaxed text-foreground/85">
          {intro && <div className="space-y-4 rounded-3xl bg-brand-mist p-6 sm:p-8">{intro}</div>}
          {sections.map((s, i) => (
            <div key={s.id} id={s.id} className="scroll-mt-28 border-b py-8 last:border-b-0">
              <h2 className="flex gap-3 text-xl font-extrabold tracking-tight text-brand-navy sm:text-2xl">
                <span className="text-brand-blue-strong tabular-nums">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="mt-4 space-y-4 [&_a]:font-semibold [&_a]:text-brand-blue-strong [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-brand-amber">
                {s.body}
              </div>
            </div>
          ))}
          {footer}
        </article>
      </div>
    </section>
  )
}
