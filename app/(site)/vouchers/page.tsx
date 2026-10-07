import type { Metadata } from "next"
import {
  Coupon01Icon,
  Download04Icon,
  Login01Icon,
  MailValidation01Icon,
  QrCode01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { AppStoreButtons } from "@/components/content/app-store-buttons"
import { Icon } from "@/components/icons"
import { PageHero } from "@/components/site/page-hero"

export const metadata: Metadata = {
  title: "Vouchers: Scan QR Codes, Enjoy — TravelBeta",
  description: "Scan TravelBeta QR codes in the mobile app and apply the coupon code when you book.",
}

const STEPS = [
  { icon: Download04Icon, title: "Get the app", body: "Download or update the TravelBeta mobile app on the App Store or Google Play Store." },
  { icon: UserAdd01Icon, title: "Create an account", body: "Sign up in the app with your details." },
  { icon: MailValidation01Icon, title: "Verify your email", body: "Verify your account with your email address." },
  { icon: Login01Icon, title: "Log in", body: "Log into the mobile app with your credentials." },
  { icon: QrCode01Icon, title: "Scan the QR code", body: "Tap More, then Scan QR Code, and point your camera at the TravelBeta code." },
  { icon: Coupon01Icon, title: "Enjoy your discount", body: "Congratulations! Apply the coupon code when booking." },
]

export default function VouchersPage() {
  return (
    <>
      <PageHero
        eyebrow="Vouchers"
        title="Scan QR codes, enjoy"
        description="Spotted a TravelBeta QR code? Scan it in our mobile app to unlock a coupon code for your next booking."
        crumbs={[{ label: "Vouchers" }]}
      >
        <AppStoreButtons tone="light" className="mt-8" />
      </PageHero>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-widest text-brand-blue-strong uppercase">Six quick steps</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">How to scan a TravelBeta QR code</h2>
          </div>

          <ol className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex gap-4 rounded-3xl border bg-card p-6">
                <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-brand-navy">
                  <Icon icon={s.icon} size={24} />
                  <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-brand-navy text-xs font-extrabold text-brand-amber">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="font-bold">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-20">
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 overflow-hidden rounded-3xl bg-brand-navy p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,rgba(61,145,255,0.45),transparent_60%)]"
          />
          <div className="relative flex items-center gap-5">
            <span className="hidden size-20 shrink-0 place-items-center rounded-3xl bg-white text-brand-navy sm:grid">
              <Icon icon={QrCode01Icon} size={44} />
            </span>
            <div>
              <h2 className="text-2xl font-extrabold">Ready to scan?</h2>
              <p className="mt-1 text-white/75">Download the TravelBeta app to get started.</p>
            </div>
          </div>
          <AppStoreButtons tone="light" className="relative" />
        </div>
      </section>
    </>
  )
}
