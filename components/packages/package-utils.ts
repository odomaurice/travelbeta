import type { VacationPackage } from "@/lib/data/packages"

export type PackageCategory = "all" | "nigeria" | "international" | "honeymoon" | "group"

export const PACKAGE_FILTERS: { value: PackageCategory; label: string }[] = [
  { value: "all", label: "All packages" },
  { value: "nigeria", label: "Nigeria getaways" },
  { value: "international", label: "International" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "group", label: "Group trips" },
]

// Derived from the package titles only — no extra data is invented.
const INTERNATIONAL = /mauritius|nairobi|kigali/i

export function packageCategories(p: VacationPackage): PackageCategory[] {
  const cats: PackageCategory[] = [INTERNATIONAL.test(p.title) ? "international" : "nigeria"]
  if (/honeymoon/i.test(p.title)) cats.push("honeymoon")
  if (/group trip/i.test(p.title)) cats.push("group")
  return cats
}

export function packageRegion(p: VacationPackage) {
  return INTERNATIONAL.test(p.title) ? "International" : "Nigeria"
}

const KEEP_UPPER = new Set(["MMA", "PS5"])
const SMALL = new Set(["and", "or", "of", "to", "in", "the", "with", "a", "at", "on", "for"])

/**
 * Some inclusions were entered in ALL CAPS on the original site. Render them in
 * title case so lists read consistently; mixed-case strings are left untouched.
 */
export function tidyInclusion(text: string) {
  if (text !== text.toUpperCase()) return text
  return text
    .toLowerCase()
    .split(" ")
    .map((word, i) => {
      const bare = word.replace(/[^a-z0-9]/gi, "").toUpperCase()
      if (KEEP_UPPER.has(bare)) return word.toUpperCase()
      if (i > 0 && SMALL.has(word)) return word
      return word.replace(/[a-z]/, (c) => c.toUpperCase())
    })
    .join(" ")
}
