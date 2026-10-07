"use client"

import { useId } from "react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { DateField, RequestForm, TextField, type Option } from "@/components/forms/form-kit"
import { RENTAL_CATEGORIES, RENTAL_CITIES, RENTAL_MODELS } from "@/components/services/rental-options"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const control =
  "h-12 w-full rounded-xl border-input bg-background px-4 text-[15px] shadow-none focus-visible:border-brand-blue focus-visible:ring-brand-blue/20"

/**
 * Same look as form-kit's SelectField, but accepts a default value (for `?city=`).
 * `data-[size=default]:h-12` is needed because ui/select's own h-8 variant otherwise wins over h-12.
 */
function PresetSelect({
  label,
  name,
  options,
  placeholder,
  defaultValue,
}: {
  label: string
  name: string
  options: Option[]
  placeholder: string
  defaultValue?: string
}) {
  const id = useId()
  return (
    <Field className="relative gap-2">
      <FieldLabel htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
        <span className="text-destructive" aria-hidden> *</span>
      </FieldLabel>
      <Select name={name} required items={options} defaultValue={defaultValue ?? null}>
        <SelectTrigger id={id} className={cn(control, "justify-between pr-3 data-[size=default]:h-12")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}

export function RentalForm({ city }: { city?: string }) {
  return (
    <RequestForm
      title="Rent a vehicle"
      description="Fill out the form below and we'll reach out."
      submitLabel="Request vehicle"
      successTitle="Request received"
      successMessage="Form submitted successfully — we will get back to you as soon as possible."
    >
      <PresetSelect label="City" name="city" options={RENTAL_CITIES} placeholder="Select city" defaultValue={city} />
      <PresetSelect label="Car model" name="carModel" options={RENTAL_MODELS} placeholder="Select vehicle" />
      <PresetSelect label="Category" name="category" options={RENTAL_CATEGORIES} placeholder="Select category" />
      <DateField label="Pick-up date" name="pickupDate" required />
      <p className="flex items-start gap-3 rounded-xl bg-brand-sky/40 px-4 py-3 text-sm text-brand-navy sm:col-span-2">
        <Icon icon={InformationCircleIcon} size={18} className="mt-0.5 shrink-0 text-brand-blue-strong" />
        Pricing depends on the city, car model and category you choose. An agent will confirm the price with you before
        anything is booked.
      </p>
      <TextField label="First name" name="firstName" autoComplete="given-name" required />
      <TextField label="Last name" name="lastName" autoComplete="family-name" required />
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextField label="Phone" name="phone" type="tel" autoComplete="tel" required />
    </RequestForm>
  )
}
