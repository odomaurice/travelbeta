"use client"

import { useEffect, useRef } from "react"

/**
 * Background video for the auth screens. It never autoplays from markup:
 * playback starts here only when the visitor hasn't asked for reduced motion,
 * otherwise the poster frame stays as a still image.
 */
export function AuthVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      if (query.matches) {
        video.pause()
      } else {
        video.muted = true
        video.play().catch(() => {
          // Autoplay can be blocked; the poster frame is a fine fallback.
        })
      }
    }
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      poster="/videos/hero-poster.jpg"
      aria-hidden
      tabIndex={-1}
      className={className}
    >
      <source src="/videos/hero-takeoff-landing.mp4" type="video/mp4" />
    </video>
  )
}
