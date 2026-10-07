"use client"

import { useEffect, useState } from "react"

/**
 * Shows the loading skeleton briefly, then the real state. Until a live
 * inventory API is connected the "real state" is always the empty state —
 * the pause just keeps the transition from feeling abrupt.
 * TODO: replace with the live results request once the inventory API exists.
 */
export function ResultsReveal({
  skeleton,
  children,
  delay = 900,
}: {
  skeleton: React.ReactNode
  children: React.ReactNode
  delay?: number
}) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return <div aria-live="polite" aria-busy={!ready}>{ready ? children : skeleton}</div>
}
