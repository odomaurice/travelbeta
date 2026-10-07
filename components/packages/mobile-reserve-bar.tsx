"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Fixed bottom bar for small screens. Hidden while the in-page booking card
 * (#reserve-card) or the site footer is on screen so it never covers either.
 */
export function MobileReserveBar({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const targets = [document.getElementById("reserve-card"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => !!el
    )
    const visible = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      setHidden(visible.size > 0)
    })
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,77,0.08)] backdrop-blur transition-transform duration-300 lg:hidden",
        hidden && "pointer-events-none translate-y-full"
      )}
      aria-hidden={hidden}
      inert={hidden}
    >
      {children}
    </div>
  )
}
