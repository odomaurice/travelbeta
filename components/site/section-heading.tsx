import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  align?: "center" | "left"
  tone?: "dark" | "light"
  className?: string
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl", className)}>
      <p className={cn("text-xs font-bold tracking-widest uppercase", tone === "dark" ? "text-brand-blue-strong" : "text-brand-amber")}>{eyebrow}</p>
      <h2 className={cn("mt-2 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl", tone === "dark" ? "text-brand-navy" : "text-white")}>
        {title}
      </h2>
      {description && <p className={cn("mt-3 text-pretty", tone === "dark" ? "text-muted-foreground" : "text-white/70")}>{description}</p>}
    </div>
  )
}
