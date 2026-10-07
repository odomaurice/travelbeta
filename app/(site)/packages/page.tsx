import type { Metadata } from "next"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { CustomisePackageDialog } from "@/components/packages/enquiry-forms"
import { PackageBrowser } from "@/components/packages/package-browser"
import { ReachOut } from "@/components/packages/reach-out"
import { PageHero } from "@/components/site/page-hero"
import { PACKAGES } from "@/lib/data/packages"

export const metadata: Metadata = {
  title: "Vacation Packages — TravelBeta",
  description:
    "Holiday packages, honeymoons and group trips in Nigeria and abroad — or customise your own package with TravelBeta.",
}

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Vacation packages"
        title="Holidays, honeymoons and group trips, all sorted"
        description="Accommodation, experiences and transfers bundled into one price. Pick a package below or let us customise one around you."
        crumbs={[{ label: "Packages" }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#browse"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-amber px-6 font-bold text-brand-navy-deep transition hover:bg-brand-amber/90"
          >
            Browse packages
            <Icon icon={ArrowRight01Icon} size={18} />
          </a>
          <CustomisePackageDialog
            trigger={
              <button
                type="button"
                className="inline-flex h-12 items-center rounded-xl border border-white/30 px-6 font-bold text-white transition hover:bg-white/10"
              >
                Customise your own package
              </button>
            }
          />
        </div>
      </PageHero>

      <section id="browse" className="scroll-mt-24 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <PackageBrowser packages={PACKAGES} />
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <ReachOut />
        </div>
      </section>
    </>
  )
}
