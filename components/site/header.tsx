"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowDown01Icon, Call02Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CONTACT, MORE_NAV, PRIMARY_NAV } from "@/lib/data/site"
import { cn } from "@/lib/utils"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) => {
    const path = href.split(/[?#]/)[0]
    return path !== "/" && pathname.startsWith(path)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Emergency line, as on travelbeta.com. Collapses once the page scrolls. */}
      <div
        className={cn(
          "overflow-hidden bg-brand-navy-deep text-white transition-[height] duration-300",
          scrolled ? "h-0" : "h-9"
        )}
      >
        <p className="mx-auto flex h-9 max-w-6xl items-center justify-center gap-2 px-4 text-xs font-medium sm:justify-between">
          <span className="hidden text-white/70 sm:inline">Flights · Hotels · Visas · Holidays — book smarter, travel better.</span>
          <a href={`tel:${CONTACT.emergency.tel}`} className="inline-flex items-center gap-1.5 hover:text-brand-amber">
            <Icon icon={Call02Icon} size={14} className="text-brand-amber" />
            <span>
              Emergency? Call <strong>{CONTACT.emergency.display}</strong>
              <span className="hidden sm:inline"> — immediate response assured</span>
            </span>
          </a>
        </p>
      </div>

      <div
        className={cn(
          "transition-[background-color,box-shadow,color] duration-300",
          scrolled ? "bg-white/90 text-foreground shadow-[0_1px_0_var(--border)] backdrop-blur-lg" : "text-white"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-18">
          <Link href="/" aria-label="TravelBeta home" className="shrink-0">
            <Logo tone={scrolled ? "dark" : "light"} compact className="h-8 sm:h-9" />
          </Link>

          <nav aria-label="Main" className="ml-4 hidden items-center gap-0.5 lg:flex">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  scrolled
                    ? "text-foreground/80 hover:bg-muted hover:text-foreground aria-[current=page]:text-brand-blue-strong"
                    : "text-white/85 hover:bg-white/10 hover:text-white aria-[current=page]:text-brand-amber"
                )}
              >
                {item.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40",
                  scrolled ? "text-foreground/80 hover:bg-muted data-popup-open:bg-muted" : "text-white/85 hover:bg-white/10 data-popup-open:bg-white/10"
                )}
              >
                More
                <Icon icon={ArrowDown01Icon} size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2">
                {MORE_NAV.map((item) => (
                  <DropdownMenuItem key={item.href} render={<Link href={item.href} />} className="flex-col items-start gap-0.5 rounded-lg px-3 py-2.5">
                    <span className="font-semibold text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <Button
              variant="ghost"
              nativeButton={false} render={<Link href="/user/login" />}
              className={cn("h-10 rounded-full px-4 font-semibold", !scrolled && "text-white hover:bg-white/10 hover:text-white")}
            >
              Log in
            </Button>
            <Button
              nativeButton={false} render={<Link href="/user/signup" />}
              className="h-10 rounded-full bg-brand-amber px-5 font-bold text-brand-navy-deep hover:bg-brand-amber/90"
            >
              Create account
            </Button>
          </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Open menu"
                  className={cn("ml-auto rounded-full sm:ml-0 lg:hidden", !scrolled && "text-white hover:bg-white/10 hover:text-white")}
                />
              }
            >
              <Icon icon={Menu01Icon} size={22} />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,88vw)] overflow-y-auto p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo compact className="h-8" />
              <nav aria-label="Mobile" className="mt-6 flex flex-col">
                {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
                  <SheetClose
                    key={item.label}
                    nativeButton={false}
                    render={<Link href={item.href} />}
                    className="rounded-xl px-3 py-2.5 text-[15px] font-semibold hover:bg-muted"
                  >
                    {item.label}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6 grid gap-2">
                <Button variant="outline" nativeButton={false} render={<Link href="/user/login" />} className="h-11 rounded-full font-semibold">
                  Log in
                </Button>
                <Button nativeButton={false} render={<Link href="/user/signup" />} className="h-11 rounded-full bg-brand-amber font-bold text-brand-navy-deep hover:bg-brand-amber/90">
                  Create account
                </Button>
                <a href={`tel:${CONTACT.emergency.tel}`} className="mt-2 text-center text-sm text-muted-foreground">
                  Emergency line: <strong className="text-foreground">{CONTACT.emergency.display}</strong>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
