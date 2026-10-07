import { redirect } from "next/navigation"
import { DESTINATIONS } from "@/lib/data/destinations"

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ cityCode: d.slug }))
}

// travelbeta.com also had /destinations/hotels/<code>; one destination page now covers both.
export default async function DestinationHotelsPage({ params }: PageProps<"/destinations/hotels/[cityCode]">) {
  redirect(`/destinations/flights/${(await params).cityCode}`)
}
