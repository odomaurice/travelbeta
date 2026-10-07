import Image from "next/image"
import { PARTNERS } from "@/lib/data/site"

export function Partners() {
  return (
    <section aria-label="Accreditation and payment partners" className="border-y bg-background px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <p className="shrink-0 text-sm font-semibold text-muted-foreground">Accredited and trusted by</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {PARTNERS.map((p) => (
            <li key={p.name}>
              <Image
                src={p.src}
                alt={p.name}
                width={120}
                height={36}
                unoptimized
                className="h-7 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-8"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
