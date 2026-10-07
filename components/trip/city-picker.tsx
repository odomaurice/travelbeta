"use client"

import { useState } from "react"
import { Location01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CITIES, type City, cityById } from "@/components/trip/trips"
import { cn } from "@/lib/utils"

const GROUPS: { heading: string; match: (c: City) => boolean }[] = [
  { heading: "Nigeria", match: (c) => c.country === "Nigeria" },
  { heading: "Africa", match: (c) => c.country !== "Nigeria" && c.roads.endsWith("africa") },
  { heading: "Worldwide", match: (c) => !c.roads.endsWith("africa") },
]

type CityPickerProps = {
  label: string
  placeholder: string
  value: string | null
  onChange: (id: string) => void
  /** City chosen on the other side, hidden from this list. */
  exclude?: string | null
  /** Restrict the list to these city ids. */
  only?: string[]
  className?: string
}

export function CityPicker({ label, placeholder, value, onChange, exclude, only, className }: CityPickerProps) {
  const [open, setOpen] = useState(false)
  const city = value ? cityById(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "group flex min-w-0 flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 data-popup-open:bg-muted",
          className
        )}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-brand-navy">
          <Icon icon={Location01Icon} size={18} />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-medium text-muted-foreground">{label}</span>
          {city ? (
            <span className="block truncate font-bold text-foreground">
              {city.name} <span className="font-semibold text-muted-foreground">{city.code}</span>
            </span>
          ) : (
            <span className="block truncate font-semibold text-muted-foreground/80">{placeholder}</span>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <Command>
          <CommandInput placeholder="City, country or airport code" />
          <CommandList className="max-h-80">
            <CommandEmpty>No matching cities yet.</CommandEmpty>
            {GROUPS.map((group) => {
              const items = CITIES.filter((c) => group.match(c) && c.id !== exclude && (!only || only.includes(c.id)))
              if (items.length === 0) return null
              return (
                <CommandGroup key={group.heading} heading={group.heading}>
                  {items.map((c) => (
                    <CommandItem
                      key={c.id}
                      value={`${c.name} ${c.country} ${c.code}`}
                      data-checked={c.id === value}
                      onSelect={() => {
                        onChange(c.id)
                        setOpen(false)
                      }}
                      className="py-2"
                    >
                      <span className="grid h-7 w-11 place-items-center rounded-md bg-muted text-xs font-bold text-brand-navy">
                        {c.code}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{c.name}</span>
                        <span className="block text-xs text-muted-foreground">{c.country}</span>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
