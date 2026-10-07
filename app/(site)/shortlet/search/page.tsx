import type { Metadata } from "next"
import { Home03Icon } from "@hugeicons/core-free-icons"
import type { SearchParams } from "@/components/search/params"
import { StayResultsPage } from "@/components/search/stay-results"

export const metadata: Metadata = {
  title: "Shortlet search — TravelBeta",
  description: "Shortlet apartments for your dates, or let the TravelBeta team book one for you.",
}

export default function ShortletSearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <StayResultsPage kind="shortlet" icon={Home03Icon} searchParams={searchParams} />
}
