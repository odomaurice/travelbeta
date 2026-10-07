"use client"

import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/site/section-heading"
import { MODE_STYLE } from "@/components/trip/trip-anim"
import { useTrip } from "@/components/trip/trip-context"
import { MODE_LABEL, POPULAR_ROUTES, cityById, formatDuration, getModeOptions, recommendMode } from "@/components/trip/trips"

export function TrendingRoutes() {
  const { planRoute } = useTrip()

  return (
    <section id="routes" className="scroll-mt-24 bg-brand-navy px-4 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            tone="light"
            eyebrow="Trending flight deals"
            title="Where TravelBeta travellers are heading"
            description="Get the best flight deals, airline specials and promotions. Tap a route to see it mapped out."
          />
          <div className="flex flex-wrap gap-2">
            <Button nativeButton={false} render={<Link href="/deals" />} className="h-11 rounded-full bg-brand-amber px-5 font-bold text-brand-navy-deep hover:bg-brand-amber/90">
              View more deals
            </Button>
            <Button nativeButton={false} render={<Link href="/contact" />} variant="ghost" className="h-11 rounded-full px-5 font-semibold text-white hover:bg-white/10 hover:text-white">
              Need help? Get in touch
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ROUTES.map((r) => {
            const from = cityById(r.from)!
            const to = cityById(r.to)!
            const options = getModeOptions(from, to)
            const mode = recommendMode(from, to, options)
            const minutes = options.find((o) => o.mode === mode)!.minutes
            const style = MODE_STYLE[mode]
            return (
              <button
                key={`${r.from}-${r.to}`}
                type="button"
                onClick={() => planRoute(r.from, r.to)}
                className="group rounded-3xl bg-white/[0.06] p-6 text-left ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:ring-white/25"
              >
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>{from.code}</span>
                  <span className="relative mx-3 h-px flex-1 border-t-2 border-dotted border-white/30">
                    <span
                      className="absolute top-1/2 left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-brand-navy-deep transition-[left] duration-500 group-hover:left-[80%]"
                      style={{ background: style.color }}
                    >
                      <Icon icon={style.icon} size={16} strokeWidth={2} />
                    </span>
                  </span>
                  <span>{to.code}</span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold">
                  {from.name} → {to.name}
                </h3>
                <p className="mt-1 text-sm text-white/65">{r.tagline}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                  <span className="text-white/80">
                    {MODE_LABEL[mode]} · about {formatDuration(minutes)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-brand-amber">
                    Map it
                    <Icon icon={ArrowRight01Icon} size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
