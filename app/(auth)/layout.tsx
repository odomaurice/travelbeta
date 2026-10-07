import Link from "next/link"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { AuthVideo } from "@/components/auth/auth-video"
import { Icon } from "@/components/icons"
import { Logo } from "@/components/site/logo"
import { CONTACT } from "@/lib/data/site"

const SERVICES = ["Flights", "Hotels", "Visas", "Holidays"]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Visual panel (desktop) */}
      <aside className="relative hidden overflow-hidden bg-brand-navy-deep lg:block">
        <div className="sticky top-0 h-dvh">
          <AuthVideo className="absolute inset-0 size-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-brand-navy-deep via-brand-navy/70 to-brand-navy/40" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_60%_at_0%_100%,rgba(251,184,31,0.18),transparent_70%)]" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white xl:p-14">
            <Link href="/" aria-label="TravelBeta home" className="w-fit rounded-lg focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none">
              <Logo tone="light" className="h-11" />
            </Link>
            <div className="max-w-md">
              <p className="text-xs font-bold tracking-widest text-brand-amber uppercase">Nigeria&apos;s leading online travel agency</p>
              <p className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance xl:text-4xl">
                Flights, hotels and visas in one place — book smarter, travel better.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <li key={s} className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/15 backdrop-blur-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex min-w-0 flex-col bg-background px-4 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="TravelBeta home" className="lg:hidden">
            <Logo compact className="h-8" />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-brand-navy"
          >
            <Icon icon={ArrowLeft01Icon} size={16} />
            Back to home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Need help? Call{" "}
          <a href={`tel:${CONTACT.main.tel}`} className="font-semibold text-brand-navy hover:underline">
            {CONTACT.main.display}
          </a>{" "}
          — we&apos;re available 24/7.
        </p>
      </main>
    </div>
  )
}
