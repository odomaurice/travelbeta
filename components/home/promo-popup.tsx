"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { PROMOS, type Promo, cld } from "@/lib/data/promos"
import { cn } from "@/lib/utils"

const ROTATE_MS = 4000
const DISMISS_KEY = "tb-promo-dismissed"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}
const useReducedMotion = () => useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED_MOTION).matches, () => false)

const iso = (daysAhead: number) => {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** Dates are relative to today, so they're built when the offer is clicked. */
function searchHref({ search }: Promo) {
  const q = new URLSearchParams({
    trip: search.returnInDays ? "round" : "oneway",
    from: search.from,
    to: search.to,
    mode: "flight",
    depart: iso(search.departInDays),
    adults: "1",
    cabin: "economy",
  })
  if (search.returnInDays) q.set("return", iso(search.returnInDays))
  return `/search?${q}`
}

/**
 * Rotating airline offers, bottom-left like travelbeta.com. Waits for the
 * preloader, pauses while hovered or focused, doesn't auto-rotate for
 * reduced-motion users, and stays closed for the session once dismissed.
 */
export function PromoPopup() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return
    } catch {}
    // Give the plane preloader time to finish on a first visit.
    const delay = document.documentElement.hasAttribute("data-preloaded") ? 800 : 2800
    const t = setTimeout(() => setOpen(true), delay)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open || paused || reduceMotion || PROMOS.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % PROMOS.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [open, paused, reduceMotion])

  const close = useCallback(() => {
    setOpen(false)
    try {
      sessionStorage.setItem(DISMISS_KEY, "1")
    } catch {}
  }, [])

  if (!open) return null

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !rootRef.current?.contains(e.relatedTarget) && setPaused(false)}
      onKeyDown={(e) => e.key === "Escape" && close()}
      className="fixed inset-x-4 bottom-24 z-40 animate-in fade-in slide-in-from-bottom-6 duration-500 sm:inset-x-auto sm:bottom-8 sm:left-8 sm:w-[504px]"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_3px_26px_-10px_rgba(81,81,81,0.35),0_16px_40px_-10px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
        <button
          type="button"
          onClick={close}
          aria-label="Close offers"
          className="absolute top-3 right-3 z-20 grid size-8 place-items-center rounded-full bg-white/90 text-foreground shadow-sm transition hover:bg-muted"
        >
          <Icon icon={Cancel01Icon} size={16} />
        </button>

        {PROMOS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${PROMOS.length}: ${p.alt}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            onClick={() => router.push(searchHref(p))}
            className={cn(
              "grid w-full grid-cols-[42%_1fr] text-left transition-opacity duration-500 outline-none focus-visible:ring-3 focus-visible:ring-brand-blue/40 sm:h-[300px]",
              i === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
            )}
          >
            <PromoImages promo={p} />
            <span className="flex flex-col justify-center gap-3 p-5 pr-10 sm:p-7">
              <PromoBrand promo={p} />
              <span>
                <span className="block text-sm font-semibold text-muted-foreground">{p.eyebrow}</span>
                <span className="mt-1 block text-xl leading-tight font-extrabold text-brand-navy sm:text-2xl">{p.heading}</span>
              </span>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-amber px-4 py-2 text-sm font-bold text-brand-navy-deep">
                Book now
                <Icon icon={ArrowRight01Icon} size={16} />
              </span>
            </span>
          </button>
        ))}

        {PROMOS.length > 1 && (
          <div className="absolute right-5 bottom-4 z-20 flex gap-1.5" role="group" aria-label="Choose offer">
            {PROMOS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-label={`Show offer ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-brand-navy" : "w-2 bg-brand-navy/25 hover:bg-brand-navy/50")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PromoImages({ promo }: { promo: Promo }) {
  if (promo.images.length === 1) {
    return (
      <span className="relative block min-h-44 overflow-hidden bg-brand-mist">
        {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary already serves a resized, optimised copy */}
        <img src={cld(promo.images[0], 440, 620)} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </span>
    )
  }
  // Stacked collage like the original: three overlapping photos.
  const layout = [
    { top: "0%", height: "48%" },
    { top: "36%", height: "28%" },
    { top: "60%", height: "40%" },
  ]
  return (
    <span className="relative block min-h-44 overflow-hidden bg-brand-mist">
      {promo.images.slice(0, 3).map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- Cloudinary already serves a resized, optimised copy
        <img
          key={src}
          src={cld(src, 440, 300)}
          alt=""
          className="absolute left-0 w-full object-cover ring-2 ring-white"
          style={{ top: layout[i].top, height: layout[i].height, zIndex: i === 1 ? 2 : 1 }}
        />
      ))}
    </span>
  )
}

function PromoBrand({ promo }: { promo: Promo }) {
  const { brand } = promo
  return (
    <span className="flex items-center gap-2">
      {brand.wordmark ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- small brand asset */}
          <img src={brand.wordmark} alt={brand.alt} width={brand.width} height={brand.height} className="h-6 w-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element -- small brand asset */}
          <img src={brand.logo} alt="" width={22} height={22} className="size-5" />
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- small brand asset
        <img src={brand.logo} alt={brand.alt} width={brand.width} height={brand.height} className="h-10 w-auto" />
      )}
    </span>
  )
}
