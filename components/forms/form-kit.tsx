"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { Calendar03Icon, CheckmarkCircle02Icon, CloudUploadIcon, Loading03Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const control =
  "h-12 w-full rounded-xl border-input bg-background px-4 text-[15px] shadow-none focus-visible:border-brand-blue focus-visible:ring-brand-blue/20"

/* ------------------------------------------------------------------ */
/* Form shell                                                          */
/* ------------------------------------------------------------------ */

type RequestFormProps = {
  title?: string
  description?: string
  submitLabel?: string
  successTitle?: string
  successMessage?: string
  /** Show the "I agree to the terms" checkbox before submit. */
  consent?: boolean
  /**
   * Called with the form data. Until the backend is connected this resolves
   * after a short delay so the success state can be reviewed.
   */
  onSubmit?: (data: FormData) => Promise<void>
  /** Replaces the default "Send another / Back to home" buttons, e.g. a Close button in a dialog. */
  successAction?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function RequestForm({
  title,
  description,
  submitLabel = "Submit",
  successTitle = "Request received",
  successMessage = "Thanks — our team will get back to you shortly.",
  consent = true,
  onSubmit,
  successAction,
  className,
  children,
}: RequestFormProps) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)

  if (state === "sent") {
    return (
      <div className={cn("rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-12", className)} role="status">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#5fb042]/15 text-[#3d8a26]">
          <Icon icon={CheckmarkCircle02Icon} size={34} />
        </span>
        <h3 className="mt-5 text-2xl font-extrabold text-brand-navy">{successTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">{successMessage}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {successAction ?? (
            <>
              <Button variant="outline" className="h-11 rounded-full px-5 font-semibold" onClick={() => setState("idle")}>
                Send another
              </Button>
              <Button nativeButton={false} render={<Link href="/" />} className="h-11 rounded-full bg-brand-navy px-5 font-semibold">
                Back to home
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <form
      className={cn("rounded-3xl border bg-card p-6 shadow-sm sm:p-8", className)}
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        setState("sending")
        try {
          const data = new FormData(e.currentTarget)
          // TODO: replace the fallback with the real API call for each form.
          await (onSubmit ? onSubmit(data) : new Promise((r) => setTimeout(r, 900)))
          setState("sent")
        } catch {
          setError("Something went wrong sending this. Please try again or call us.")
          setState("idle")
        }
      }}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-extrabold text-brand-navy">{title}</h2>}
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>

      {consent && (
        <label className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
          <Checkbox name="consent" required className="mt-0.5" />
          <span>
            I have read and agree to TravelBeta&apos;s{" "}
            <Link href="/terms" className="font-semibold text-brand-blue-strong underline-offset-4 hover:underline">
              terms &amp; conditions
            </Link>
            .
          </span>
        </label>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 h-12 w-full rounded-xl bg-brand-amber text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90 sm:w-auto sm:px-10"
      >
        {state === "sending" && <Icon icon={Loading03Icon} size={18} className="animate-spin" />}
        {state === "sending" ? "Sending…" : submitLabel}
      </Button>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/* Fields                                                              */
/* ------------------------------------------------------------------ */

type BaseFieldProps = {
  label: string
  name: string
  required?: boolean
  hint?: string
  /** Span both columns of the RequestForm grid. */
  full?: boolean
  className?: string
}

function FieldWrap({
  label,
  hint,
  full,
  className,
  htmlFor,
  required,
  children,
}: BaseFieldProps & { htmlFor: string; children: React.ReactNode }) {
  return (
    <Field className={cn("relative gap-2", full && "sm:col-span-2", className)}>
      <FieldLabel htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
        {required && (
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        )}
      </FieldLabel>
      {children}
      {hint && <FieldDescription className="text-xs">{hint}</FieldDescription>}
    </Field>
  )
}

export function TextField({
  type = "text",
  placeholder,
  autoComplete,
  defaultValue,
  minLength,
  ...base
}: BaseFieldProps & {
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  autoComplete?: string
  defaultValue?: string
  minLength?: number
}) {
  const id = useId()
  return (
    <FieldWrap {...base} htmlFor={id}>
      <Input
        id={id}
        name={base.name}
        type={type}
        required={base.required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        minLength={minLength}
        className={control}
      />
    </FieldWrap>
  )
}

export function TextAreaField({ placeholder, rows = 5, ...base }: BaseFieldProps & { placeholder?: string; rows?: number }) {
  const id = useId()
  return (
    <FieldWrap {...base} full={base.full ?? true} htmlFor={id}>
      <Textarea
        id={id}
        name={base.name}
        required={base.required}
        placeholder={placeholder}
        rows={rows}
        className="min-h-32 rounded-xl px-4 py-3 text-[15px] focus-visible:border-brand-blue focus-visible:ring-brand-blue/20"
      />
    </FieldWrap>
  )
}

export type Option = { value: string; label: string; hint?: string }

export function SelectField({
  options,
  placeholder = "Select…",
  defaultValue,
  ...base
}: BaseFieldProps & {
  options: Option[]
  placeholder?: string
  defaultValue?: string
}) {
  const id = useId()
  return (
    <FieldWrap {...base} htmlFor={id}>
      <Select name={base.name} required={base.required} items={options} defaultValue={defaultValue}>
        {/* The size variant sets its own height, so override it to match the inputs. */}
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
    </FieldWrap>
  )
}

/** Searchable single-select for long lists (airports, airlines, countries). */
export function ComboboxField({
  options,
  placeholder = "Search…",
  emptyText = "No matches",
  ...base
}: BaseFieldProps & {
  options: Option[]
  placeholder?: string
  emptyText?: string
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const selected = options.find((o) => o.value === value)
  return (
    <FieldWrap {...base} htmlFor={id}>
      {/* Visually hidden but focusable-free input keeps native `required` validation working. */}
      <input
        tabIndex={-1}
        aria-hidden
        name={base.name}
        value={value}
        required={base.required}
        onChange={() => {}}
        className="pointer-events-none absolute bottom-0 left-4 size-px opacity-0"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          className={cn(
            control,
            "flex items-center justify-between border text-left outline-none focus-visible:ring-3",
            !selected && "text-muted-foreground",
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          {selected?.hint && <span className="ml-2 shrink-0 text-xs font-bold text-muted-foreground">{selected.hint}</span>}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-(--anchor-width) min-w-64 p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList className="max-h-72">
              <CommandEmpty>{emptyText}</CommandEmpty>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={`${o.label} ${o.hint ?? ""}`}
                  data-checked={o.value === value}
                  onSelect={() => {
                    setValue(o.value)
                    setOpen(false)
                  }}
                >
                  <span className="truncate">{o.label}</span>
                  {o.hint && <span className="ml-auto text-xs font-bold text-muted-foreground">{o.hint}</span>}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FieldWrap>
  )
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
})
const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

export function DateField({ allowPast = false, ...base }: BaseFieldProps & { allowPast?: boolean }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  return (
    <FieldWrap {...base} htmlFor={id}>
      <input
        tabIndex={-1}
        aria-hidden
        name={base.name}
        value={value ? toISO(value) : ""}
        required={base.required}
        onChange={() => {}}
        className="pointer-events-none absolute bottom-0 left-4 size-px opacity-0"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          className={cn(
            control,
            "flex items-center gap-3 border text-left outline-none focus-visible:ring-3",
            !value && "text-muted-foreground",
          )}
        >
          <Icon icon={Calendar03Icon} size={18} className="shrink-0 text-brand-navy" />
          {value ? dateFmt.format(value) : "Choose a date"}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            captionLayout={allowPast ? "dropdown" : "label"}
            onSelect={(d) => {
              setValue(d)
              setOpen(false)
            }}
            disabled={
              allowPast
                ? undefined
                : (d) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return d < today
                  }
            }
          />
        </PopoverContent>
      </Popover>
    </FieldWrap>
  )
}

export function FileField({ accept = "image/*,.pdf", ...base }: BaseFieldProps & { accept?: string }) {
  const id = useId()
  const [fileName, setFileName] = useState<string | null>(null)
  return (
    <FieldWrap {...base} full={base.full ?? true} htmlFor={id}>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-input bg-muted/40 px-4 py-5 transition hover:border-brand-blue hover:bg-accent has-focus-visible:ring-3 has-focus-visible:ring-brand-blue/30"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-brand-navy">
          <Icon icon={CloudUploadIcon} size={22} />
        </span>
        <span className="min-w-0 text-sm">
          <span className="block truncate font-semibold">{fileName ?? "Click to upload"}</span>
          <span className="text-muted-foreground">{fileName ? "Click to replace" : "JPG, PNG or PDF, up to 5MB"}</span>
        </span>
        <input
          id={id}
          type="file"
          name={base.name}
          accept={accept}
          required={base.required}
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>
    </FieldWrap>
  )
}

export function RadioPills({
  label,
  name,
  options,
  defaultValue,
  full,
}: {
  label: string
  name: string
  options: Option[]
  defaultValue?: string
  full?: boolean
}) {
  return (
    <fieldset className={cn("grid gap-2", full && "sm:col-span-2")}>
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition has-checked:border-brand-navy has-checked:bg-brand-navy has-checked:text-white has-focus-visible:ring-3 has-focus-visible:ring-brand-blue/30"
          >
            <input type="radio" name={name} value={o.value} defaultChecked={o.value === defaultValue} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
