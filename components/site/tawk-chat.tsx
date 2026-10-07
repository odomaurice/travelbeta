"use client"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"
import { TAWK } from "@/lib/data/site"

type TawkApi = {
  onLoad?: () => void
  hideWidget?: () => void
  showWidget?: () => void
  customStyle?: { zIndex?: number }
}

declare global {
  interface Window {
    Tawk_API?: TawkApi
    Tawk_LoadStart?: Date
  }
}

// Like travelbeta.com, keep the chat bubble off sign-in and payment screens.
const HIDDEN_ON = ["/user/", "/pay-online", "/reservation"]
const shouldHide = (path: string) => HIDDEN_ON.some((p) => path.startsWith(p))

/** Show or hide the bubble for a page, waiting for the widget if it hasn't loaded yet. */
function syncVisibility(path: string) {
  const api = window.Tawk_API
  if (!api) return
  const apply = () => (shouldHide(path) ? api.hideWidget?.() : api.showWidget?.())
  if (api.hideWidget) apply()
  else api.onLoad = apply
}

/** Tawk.to live chat, loaded after the page is idle so it never slows first paint. */
export function TawkChat() {
  const pathname = usePathname()

  // Apply visibility on every client-side navigation (the widget persists across pages).
  useEffect(() => syncVisibility(pathname), [pathname])

  return (
    <>
      <Script id="tawk-init" strategy="lazyOnload">
        {`window.Tawk_API=window.Tawk_API||{};window.Tawk_LoadStart=new Date();window.Tawk_API.customStyle={zIndex:45};`}
      </Script>
      <Script
        id="tawk-embed"
        strategy="lazyOnload"
        src={`https://embed.tawk.to/${TAWK.propertyId}/${TAWK.widgetId}`}
        onLoad={() => syncVisibility(window.location.pathname)}
      />
    </>
  )
}
