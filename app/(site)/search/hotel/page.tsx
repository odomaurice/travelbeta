import type { Metadata } from "next"
import { Hotel01Icon } from "@hugeicons/core-free-icons"
import type { SearchParams } from "@/components/search/params"
import { StayResultsPage } from "@/components/search/stay-results"

export const metadata: Metadata = {
  title: "Hotel search — TravelBeta",
  description: "Hotels worldwide for your dates, or let the TravelBeta hotels desk book one for you.",
}

export default function HotelSearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <StayResultsPage kind="hotel" icon={Hotel01Icon} searchParams={searchParams} />
}
