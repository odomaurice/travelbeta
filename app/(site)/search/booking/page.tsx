import { Suspense } from "react"
import type { Metadata } from "next"
import Form from "next/form"
import Link from "next/link"
import { Login03Icon, Mail01Icon, Search01Icon, Ticket01Icon } from "@hugeicons/core-free-icons"
import { TextField } from "@/components/forms/form-kit"
import { Icon } from "@/components/icons"
import { EmptyResults, ResultsSkeleton } from "@/components/search/empty-results"
import { param, type SearchParams } from "@/components/search/params"
import { ResultsReveal } from "@/components/search/results-state"
import { SearchBand, SearchSummary, SearchSummarySkeleton } from "@/components/search/search-summary"
import { HelpCard } from "@/components/site/help-card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Manage booking — TravelBeta",
  description: "Find your TravelBeta booking with your booking reference and email address.",
}

/** Params: `ref` (booking reference) and `email`. */
export default function ManageBookingPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense
      fallback={
        <>
          <SearchBand>
            <SearchSummarySkeleton />
          </SearchBand>
          <section className="px-4 py-12 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <ResultsSkeleton rows={1} />
            </div>
          </section>
        </>
      }
    >
      <ManageBooking searchParams={searchParams} />
    </Suspense>
  )
}

async function ManageBooking({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const ref = param(sp, "ref")?.toUpperCase()
  const email = param(sp, "email")

  if (!ref || !email) return <LookupForm defaultRef={ref} defaultEmail={email} />

  return (
    <>
      <SearchBand>
        <SearchSummary
          icon={Ticket01Icon}
          eyebrow="Manage booking"
          title={`Booking ${ref}`}
          subtitle={<span className="break-all">{email}</span>}
          details={[]}
          editHref="/search/booking"
          editLabel="Look up another"
        />
      </SearchBand>
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <ResultsReveal skeleton={<ResultsSkeleton rows={1} label="Finding your booking…" />}>
            {/* TODO: fetch the booking from the bookings API once it's connected. */}
            <EmptyResults
              icon={Ticket01Icon}
              badge="Online lookup coming soon"
              title="We couldn't load bookings online yet"
              body={
                <p>
                  Booking lookup isn&apos;t connected to the new TravelBeta yet. Log in to see your bookings, or contact support with your booking
                  reference <strong className="font-bold text-foreground">{ref}</strong> and we&apos;ll help right away.
                </p>
              }
              actions={
                <Button
                  nativeButton={false}
                  render={<Link href="/user/login" />}
                  className="h-11 rounded-full bg-brand-navy px-6 font-bold text-white hover:bg-brand-navy/90"
                >
                  <Icon icon={Login03Icon} size={18} />
                  Log in to your account
                </Button>
              }
            />
          </ResultsReveal>
        </div>
      </section>
    </>
  )
}

function LookupForm({ defaultRef, defaultEmail }: { defaultRef?: string; defaultEmail?: string }) {
  return (
    <>
      <SearchBand className="pb-16 sm:pb-20">
        <p className="text-xs font-bold tracking-widest text-brand-amber uppercase">Manage booking</p>
        <h1 className="mt-2 max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">Find your booking</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/75 text-pretty">
          Enter your booking reference and the email address you booked with to view or change your trip.
        </p>
      </SearchBand>
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <Form action="/search/booking" className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-extrabold text-brand-navy">Booking lookup</h2>
            <p className="mt-1 text-muted-foreground">You&apos;ll find your reference in your confirmation email.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <TextField label="Booking reference" name="ref" placeholder="e.g. TB12345" defaultValue={defaultRef} autoComplete="off" required />
              <TextField label="Email address" name="email" type="email" autoComplete="email" defaultValue={defaultEmail} required />
            </div>
            <Button
              type="submit"
              className="mt-6 h-12 w-full rounded-xl bg-brand-amber text-base font-bold text-brand-navy-deep hover:bg-brand-amber/90 sm:w-auto sm:px-10"
            >
              <Icon icon={Search01Icon} size={18} />
              Find booking
            </Button>
            <p className="mt-6 flex items-start gap-2 border-t pt-6 text-sm text-muted-foreground">
              <Icon icon={Mail01Icon} size={18} className="mt-0.5 shrink-0 text-brand-blue-strong" />
              <span>
                Have an account?{" "}
                <Link href="/user/login" className="font-semibold text-brand-blue-strong underline-offset-4 hover:underline">
                  Log in
                </Link>{" "}
                to see all your bookings in one place.
              </span>
            </p>
          </Form>
          <HelpCard title="Can't find your reference?" body="Our support team is available 24/7 and can find your booking for you." className="lg:sticky lg:top-28" />
        </div>
      </section>
    </>
  )
}
