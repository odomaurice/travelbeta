import { HugeiconsIcon, type HugeiconsProps, type IconSvgElement } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

export type IconProps = Omit<HugeiconsProps, "icon">

/** Thin wrapper so every icon in the app shares the same stroke weight. */
export function Icon({ icon, ...props }: IconProps & { icon: IconSvgElement }) {
  return <HugeiconsIcon icon={icon} strokeWidth={1.8} {...props} />
}

function named(icon: IconSvgElement) {
  return function NamedIcon(props: IconProps) {
    return <Icon icon={icon} {...props} />
  }
}

// Names mirror the ones shadcn generates so ui/* components work unchanged.
export const ChevronDownIcon = named(ArrowDown01Icon)
export const ChevronUpIcon = named(ArrowUp01Icon)
export const ChevronLeftIcon = named(ArrowLeft01Icon)
export const ChevronRightIcon = named(ArrowRight01Icon)
export const SearchIcon = named(Search01Icon)
export const CheckIcon = named(Tick02Icon)
export const XIcon = named(Cancel01Icon)
