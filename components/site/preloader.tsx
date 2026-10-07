"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/site/logo"
import { PlaneShape } from "@/components/site/plane-shape"

const MIN_VISIBLE_MS = 1800
const MAX_VISIBLE_MS = 4500
const FADE_MS = 500

type Phase = "visible" | "leaving" | "gone"

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("visible")

  useEffect(() => {
    const root = document.documentElement
    // Already played this session: CSS keeps it hidden, nothing to schedule.
    if (root.hasAttribute("data-preloaded")) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const minDelay = reduceMotion ? 400 : MIN_VISIBLE_MS
    const start = performance.now()
    const timers: number[] = []
    let done = false

    root.style.overflow = "hidden"

    const finish = () => {
      if (done) return
      done = true
      try {
        sessionStorage.setItem("tb-preloaded", "1")
      } catch {}
      root.style.overflow = ""
      setPhase("leaving")
      timers.push(window.setTimeout(() => setPhase("gone"), FADE_MS))
    }

    const onLoaded = () => {
      const remaining = Math.max(0, minDelay - (performance.now() - start))
      timers.push(window.setTimeout(finish, remaining))
    }

    if (document.readyState === "complete") onLoaded()
    else window.addEventListener("load", onLoaded, { once: true })
    timers.push(window.setTimeout(finish, MAX_VISIBLE_MS))

    return () => {
      window.removeEventListener("load", onLoaded)
      timers.forEach(clearTimeout)
      root.style.overflow = ""
    }
  }, [])

  if (phase === "gone") return null

  return (
    <div
      className="tb-preloader fixed inset-0 z-100 grid place-items-center bg-brand-navy-deep text-white"
      data-state={phase}
      role="status"
      aria-live="polite"
      aria-label="Loading TravelBeta"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(61,145,255,0.35),transparent_70%)]"
      />
      <div className="relative flex w-[min(360px,86vw)] flex-col items-center gap-6">
        <svg viewBox="0 0 320 150" className="w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="pl-trail" x1="0" x2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* origin + destination pins */}
          <circle cx={24} cy={124} r={5} fill="var(--brand-amber)" />
          <circle cx={296} cy={124} r={5} fill="var(--brand-blue)" />
          <circle cx={296} cy={124} r={5} fill="none" stroke="var(--brand-blue)" strokeWidth={2}>
            <animate attributeName="r" values="5;14" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <path
            id="pl-route"
            d="M24 124 Q160 -20 296 124"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth={2}
            strokeDasharray="2 7"
            strokeLinecap="round"
          />
          {/* contrail that draws in behind the plane */}
          <path
            d="M24 124 Q160 -20 296 124"
            fill="none"
            stroke="url(#pl-trail)"
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
          >
            <animate attributeName="stroke-dashoffset" values="1;0" dur="1.8s" repeatCount="indefinite" />
          </path>
          {/* hidden until the SMIL timeline starts, otherwise it sits at (0,0) */}
          <g visibility="hidden">
            <set attributeName="visibility" to="visible" begin="0s" />
            <PlaneShape scale={0.42} />
            <animateMotion dur="1.8s" repeatCount="indefinite" rotate="auto" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1" keyPoints="0;1">
              <mpath href="#pl-route" />
            </animateMotion>
          </g>
        </svg>

        <Logo tone="light" className="scale-125" />

        <div className="w-40">
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="tb-motion h-full origin-left rounded-full bg-brand-amber"
              style={{ animation: `tb-progress ${MIN_VISIBLE_MS}ms cubic-bezier(.45,0,.2,1) forwards` }}
            />
          </div>
          <p className="mt-3 text-center text-xs font-medium tracking-wide text-white/70">
            Preparing your journey…
          </p>
        </div>
      </div>
    </div>
  )
}
