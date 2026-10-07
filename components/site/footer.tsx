"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Call02Icon,
  Facebook01Icon,
  InstagramIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  NewTwitterIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CONTACT, FOOTER_COLUMNS } from "@/lib/data/site"

// TODO: confirm the official social handles.
const SOCIALS = [
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "X", icon: NewTwitterIcon, href: "#" },
  { label: "Facebook", icon: Facebook01Icon, href: "#" },
  { label: "LinkedIn", icon: Linkedin01Icon, href: "#" },
]

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)

  return (
    <section className="px-4 py-20 sm:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-brand-blue-strong px-6 py-12 text-white sm:px-12 sm:py-14">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full border-40 border-white/10" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-balance">Want the latest travel news and deals?</h2>
            <p className="mt-2 text-white/80">Enter your email and we&apos;ll send fare drops, visa updates and package offers your way.</p>
          </div>
          {joined ? (
            <p className="flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-4 font-semibold animate-in fade-in" role="status">
              <Icon icon={Tick02Icon} size={22} className="text-brand-amber" />
              You&apos;re subscribed. Watch your inbox for the next deal.
            </p>
          ) : (
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                // TODO: post to the newsletter provider
                setJoined(true)
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-13 rounded-2xl border-0 bg-white px-5 text-base text-foreground"
              />
              <Button type="submit" className="h-13 rounded-2xl bg-brand-amber px-7 text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-brand-navy-deep px-4 pt-16 pb-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Logo tone="light" className="h-12" />
            <p className="mt-5 max-w-sm text-sm text-white/65">
              Nigeria&apos;s leading online travel company — flights, hotels, visa assistance, tour packages, protocol services,
              airport pickups and Blue Ribbon baggage protection in one place.
            </p>
            <div className="mt-6 grid gap-4 text-sm">
              {CONTACT.offices.map((o) => (
                <div key={o.name} className="flex gap-3">
                  <Icon icon={Location01Icon} size={18} className="mt-0.5 shrink-0 text-brand-amber" />
                  <div className="text-white/75">
                    <p className="font-semibold text-white">{o.name}</p>
                    {o.lines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                </div>
              ))}
              <a href={`tel:${CONTACT.emergency.tel}`} className="flex items-center gap-3 text-white/80 hover:text-white">
                <Icon icon={Call02Icon} size={18} className="text-brand-amber" />
                24/7 emergency: {CONTACT.emergency.display}
              </a>
              <a href={`mailto:${CONTACT.emails.info}`} className="flex items-center gap-3 text-white/80 hover:text-white">
                <Icon icon={Mail01Icon} size={18} className="text-brand-amber" />
                {CONTACT.emails.info}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-bold">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-white/65">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row">
          <p>© Travelbeta.com Limited. All rights reserved.</p>
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid size-9 place-items-center rounded-full bg-white/5 text-white/75 transition hover:bg-white/15 hover:text-white"
              >
                <Icon icon={s.icon} size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
