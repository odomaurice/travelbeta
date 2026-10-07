"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { CheckmarkBadge01Icon, CustomerSupportIcon, PassportIcon, PauseIcon, PlayIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"

const PERKS = [
  { icon: CustomerSupportIcon, label: "24/7 emergency support" },
  { icon: CheckmarkBadge01Icon, label: "IATA accredited" },
  { icon: PassportIcon, label: "Visa assistance" },
]

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}
const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED_MOTION).matches, () => false)

/**
 * Full-bleed hero with a looping take-off → landing clip (Mixkit free licence,
 * clips 27989 + 7144) under a navy wash so the brand colours carry through.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  // null = follow the system setting until the visitor presses play/pause.
  const [userPaused, setUserPaused] = useState<boolean | null>(null)
  const paused = userPaused ?? reduceMotion

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (paused) v.pause()
    else v.play().catch(() => {})
  }, [paused])

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy-deep text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src="/videos/hero-takeoff-landing.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
      {/* Navy wash: strong behind the copy, lighter where the plane is. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,77,0.92)_0%,rgba(1,0,128,0.72)_45%,rgba(1,0,128,0.25)_100%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-brand-navy-deep to-transparent" />

      <div className="mx-auto max-w-6xl px-4 pt-40 pb-44 sm:pt-48 sm:pb-56">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide ring-1 ring-white/20 backdrop-blur">
            <span className="size-1.5 rounded-full bg-brand-amber" />
            Flights · Hotels · Shortlets · Visas · Holidays
          </p>
          <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
            Going somewhere? <span className="text-brand-amber">We&apos;ll show you how to get there.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80 text-pretty">
            Search flights, hotels and more, see your route mapped out — by air, rail or road — and book it all with
            Nigeria&apos;s leading online travel company.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/90">
            {PERKS.map((p) => (
              <li key={p.label} className="flex items-center gap-2">
                <Icon icon={p.icon} size={18} className="text-brand-amber" />
                {p.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setUserPaused(!paused)}
        aria-label={paused ? "Play background video" : "Pause background video"}
        className="absolute right-4 bottom-36 grid size-10 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/25 sm:bottom-44"
      >
        <Icon icon={paused ? PlayIcon : PauseIcon} size={16} />
      </button>
    </section>
  )
}
