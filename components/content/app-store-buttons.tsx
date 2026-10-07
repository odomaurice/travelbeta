import { AppleIcon, PlayStoreIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { cn } from "@/lib/utils"

// TODO: replace "#" with the real App Store and Google Play listing URLs.
const STORES = [
  { icon: AppleIcon, small: "Download on the", label: "App Store", href: "#" },
  { icon: PlayStoreIcon, small: "Get it on", label: "Google Play", href: "#" },
]

export function AppStoreButtons({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {STORES.map((s) => (
        <a
          key={s.label}
          href={s.href}
          className={cn(
            "inline-flex h-14 items-center gap-3 rounded-xl px-5 transition outline-none focus-visible:ring-3 focus-visible:ring-brand-amber",
            tone === "dark" ? "bg-brand-navy-deep text-white hover:bg-black" : "bg-white text-brand-navy-deep hover:bg-white/90"
          )}
        >
          <Icon icon={s.icon} size={26} />
          <span className="text-left leading-tight">
            <span className="block text-[11px] opacity-75">{s.small}</span>
            <span className="block text-base font-bold">{s.label}</span>
          </span>
        </a>
      ))}
    </div>
  )
}
