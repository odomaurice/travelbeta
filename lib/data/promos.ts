// Homepage promo popup slides, from travelbeta.com (Oct 2026). Edit this list to
// change the offers. Images are on TravelBeta's Cloudinary; `cld()` asks
// Cloudinary for a resized copy because the originals are 4096px / 10–15MB.

const CLD = "https://res.cloudinary.com/diapyzzws/image/upload"
export const cld = (path: string, w: number, h: number) => `${CLD}/c_fill,w_${w},h_${h},q_auto,f_auto/${path}`

export type PromoSearch = {
  from: string
  to: string
  /** Days from today for the suggested departure (and return, for round trips). */
  departInDays: number
  returnInDays?: number
}

export type Promo = {
  id: string
  eyebrow: string
  heading: string
  alt: string
  search: PromoSearch
  /** Airline branding shown above the heading. */
  brand: { logo: string; alt: string; wordmark?: string; width: number; height: number }
  /** One photo, or a three-photo collage. Cloudinary paths after /upload/. */
  images: string[]
}

export const PROMOS: Promo[] = [
  {
    id: "united",
    eyebrow: "Book the cheapest flights to",
    heading: "LaGuardia, Atlanta & Houston",
    alt: "Book cheapest flights to LaGuardia, Atlanta & Houston on United Airlines",
    search: { from: "LOS", to: "LGA", departInDays: 21 },
    brand: {
      wordmark: `${CLD}/v1781824983/travelbeta-v2-public-assets/popup/flying_united.png`,
      logo: `${CLD}/v1781825103/travelbeta-v2-public-assets/popup/flying_united_logo.png`,
      alt: "United Airlines",
      width: 150,
      height: 30,
    },
    images: [
      "v1781819631/travelbeta-v2-public-assets/popup/cityspace.jpg",
      "v1781819628/travelbeta-v2-public-assets/popup/city-park.jpg",
      "v1781819633/travelbeta-v2-public-assets/popup/archi-building.jpg",
    ],
  },
  {
    id: "rwandair",
    eyebrow: "Travel to",
    heading: "Beautiful destinations for less",
    alt: "Travel to beautiful destinations for less with RwandAir",
    search: { from: "LOS", to: "LHR", departInDays: 21, returnInDays: 33 },
    brand: {
      logo: `${CLD}/v1781819618/travelbeta-v2-public-assets/popup/rwandair_logo.png`,
      alt: "RwandAir",
      width: 96,
      height: 64,
    },
    images: ["v1781819640/travelbeta-v2-public-assets/popup/beautiful-luxury-outdoor.jpg"],
  },
]
