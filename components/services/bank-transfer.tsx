"use client"

import { useState } from "react"
import { BankIcon, CheckmarkCircle02Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { DateField, FileField, RequestForm, TextField } from "@/components/forms/form-kit"
import { BANK_ACCOUNTS } from "@/lib/data/site"
import { cn } from "@/lib/utils"

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for browsers/contexts without the async clipboard API.
    const ta = document.createElement("textarea")
    ta.value = text
    ta.setAttribute("readonly", "")
    ta.style.position = "fixed"
    ta.style.opacity = "0"
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand("copy")
    ta.remove()
    return ok
  }
}

function CopyButton({ value, bank }: { value: string; bank: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(value)) {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      }}
      aria-label={copied ? `${bank} account number copied` : `Copy ${bank} account number`}
      className={cn(
        "relative z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold transition outline-none focus-visible:ring-3 focus-visible:ring-brand-blue/30",
        copied ? "border-[#3d8a26]/30 bg-[#5fb042]/15 text-[#3d8a26]" : "bg-background text-brand-navy hover:bg-accent"
      )}
    >
      <Icon icon={copied ? Tick02Icon : Copy01Icon} size={15} />
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

/** Bank account picker + payment confirmation form. `aside` renders beside the form on large screens. */
export function BankTransfer({ aside }: { aside?: React.ReactNode }) {
  const [bank, setBank] = useState<string>(BANK_ACCOUNTS[0].bank)

  return (
    <div className="grid gap-10">
      <fieldset>
        <legend className="text-xl font-extrabold text-brand-navy">1. Select the account you paid into</legend>
        <p className="mt-1 text-sm text-muted-foreground">This will make the confirmation process faster.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {BANK_ACCOUNTS.map((a) => {
            const id = `bank-${a.number}`
            return (
              <div
                key={a.number}
                className="group relative flex flex-col rounded-3xl border-2 bg-card p-5 transition has-checked:border-brand-navy has-checked:shadow-md has-focus-visible:ring-3 has-focus-visible:ring-brand-blue/30"
              >
                <input
                  id={id}
                  type="radio"
                  name="bankChoice"
                  value={a.bank}
                  checked={bank === a.bank}
                  onChange={() => setBank(a.bank)}
                  className="sr-only"
                />
                {/* Stretched label makes the whole card selectable; the copy button sits above it. */}
                <label htmlFor={id} className="absolute inset-0 cursor-pointer rounded-3xl">
                  <span className="sr-only">{a.bank}</span>
                </label>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-accent text-brand-navy">
                      <Icon icon={BankIcon} size={22} />
                    </span>
                    <span className="font-bold">{a.bank}</span>
                  </span>
                  <span
                    aria-hidden
                    className="grid size-6 place-items-center rounded-full border-2 text-transparent group-has-checked:border-brand-navy group-has-checked:bg-brand-navy group-has-checked:text-brand-amber"
                  >
                    <Icon icon={CheckmarkCircle02Icon} size={14} />
                  </span>
                </div>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Account name</dt>
                    <dd className="mt-0.5 font-semibold">{a.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Account number</dt>
                    <dd className="mt-0.5 flex items-center justify-between gap-3">
                      <span className="font-mono text-xl font-bold tracking-wider text-brand-navy">{a.number}</span>
                      <CopyButton value={a.number} bank={a.bank} />
                    </dd>
                  </div>
                </dl>
              </div>
            )
          })}
        </div>
      </fieldset>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <RequestForm
          title="2. Confirm your payment"
          description={`Paid into ${bank}. Tell us about the transfer and attach your receipt.`}
          submitLabel="Confirm payment"
          successTitle="Payment details received"
          successMessage="Thank you for making payment. Our payment department will confirm the payment and an agent will reach out to you."
          consent={false}
        >
          <input type="hidden" name="bank" value={bank} />
          <TextField label="Full name" name="name" autoComplete="name" required />
          <TextField label="Email" name="email" type="email" autoComplete="email" required />
          <TextField label="Phone" name="phone" type="tel" autoComplete="tel" required />
          <TextField label="Booking reference" name="bookingReference" hint="Optional" />
          <TextField label="Amount paid (₦)" name="amount" type="number" placeholder="e.g. 250000" required />
          <DateField label="Payment date" name="paymentDate" allowPast required />
          <FileField label="Upload receipt" name="receipt" required />
        </RequestForm>
        {aside}
      </div>
    </div>
  )
}
