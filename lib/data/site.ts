// Contact details and navigation, taken from travelbeta.com (Oct 2026).

export const CONTACT = {
  emergency: { display: "0703 774 4475", tel: "+2347037744475" },
  main: { display: "0700 111 0111", tel: "+2347001110111" },
  alt: { display: "0817 000 3419", tel: "+2348170003419" },
  visa: { display: "0817 970 4269", tel: "+2348179704269", email: "visa@travelbeta.com" },
  affiliates: { display: "0817 204 3470", tel: "+2348172043470", email: "affiliates@travelbeta.com" },
  emails: {
    info: "info@travelbeta.com",
    abuja: "abuja@travelbeta.com",
    tours: "tours@travelbeta.com",
    hotels: "hotels@travelbeta.com",
    app: "app@travelbeta.com",
  },
  offices: [
    {
      name: "Head Office",
      lines: ["13a Eletu Ogabi Street, off Adeola Odeku Street,", "Victoria Island, Lagos."],
      email: "info@travelbeta.com",
      phones: [
        { display: "0700 111 0111", tel: "+2347001110111" },
        { display: "0817 000 3419", tel: "+2348170003419" },
      ],
    },
    {
      name: "Abuja Office",
      lines: ["Transcorp Hilton Abuja, 1st Floor, Maitama.", "Muhammadu Buhari Way, Central Business District, Abuja 900001."],
      email: "abuja@travelbeta.com",
      phones: [{ display: "0703 774 4475", tel: "+2347037744475" }],
    },
  ],
}

export const BANK_ACCOUNTS = [
  { bank: "Zenith Bank", name: "Travelbeta.com Limited", number: "1014499389" },
  { bank: "Globus Bank", name: "Travelbeta.com Limited", number: "1000036785" },
  { bank: "Guaranty Trust Bank", name: "Travelbeta.com Limited", number: "0225873859" },
]

export type NavLink = { label: string; href: string; description?: string }

export const PRIMARY_NAV: NavLink[] = [
  { label: "Flights", href: "/#plan" },
  { label: "Hotels", href: "/?tab=hotels#plan" },
  { label: "Visa", href: "/visa" },
  { label: "Packages", href: "/packages" },
  { label: "Deals", href: "/deals" },
]

export const MORE_NAV: NavLink[] = [
  { label: "Car rental", href: "/rent-vehicles", description: "Self-drive and chauffeur-driven vehicles" },
  { label: "Blue Ribbon baggage", href: "/baggages", description: "Delayed-bag tracking and payout" },
  { label: "Protocol service", href: "/protocol-service", description: "Fast-track through airport immigration" },
  { label: "Pay by bank transfer", href: "/reservation", description: "Our accounts and payment confirmation" },
  { label: "Vouchers", href: "/vouchers", description: "Scan QR codes in the app for discounts" },
  { label: "Become an affiliate", href: "/affiliate", description: "Sell travel and earn commission" },
]

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Flights", href: "/#plan" },
      { label: "Hotels", href: "/?tab=hotels#plan" },
      { label: "Shortlets", href: "/?tab=shortlets#plan" },
      { label: "Visa assistance", href: "/visa" },
      { label: "Vacation packages", href: "/packages" },
      { label: "Car rental", href: "/rent-vehicles" },
    ],
  },
  {
    title: "Travel extras",
    links: [
      { label: "Deals", href: "/deals" },
      { label: "Blue Ribbon baggage", href: "/baggages" },
      { label: "Protocol service", href: "/protocol-service" },
      { label: "Vouchers", href: "/vouchers" },
      { label: "Pay by bank transfer", href: "/reservation" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/user/login" },
      { label: "Create account", href: "/user/signup" },
      { label: "Manage booking", href: "/?tab=manage#plan" },
      { label: "Affiliates", href: "/affiliate" },
      { label: "Affiliate FAQs", href: "/affiliate/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "Feedback", href: "/feedback" },
      { label: "Terms and conditions", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
]

const LOGO_BASE = "https://res.cloudinary.com/diapyzzws/image/upload/v1682565809/Website%20Images"
export const PARTNERS = [
  { name: "IATA", src: `${LOGO_BASE}/iataLogoColoured.svg` },
  { name: "Amadeus", src: `${LOGO_BASE}/amadeusLogoColoured.svg` },
  { name: "Paystack", src: `${LOGO_BASE}/paystackLogoColoured.svg` },
  { name: "Flutterwave", src: `${LOGO_BASE}/flutterwaveLogoColoured.svg` },
  { name: "Interswitch", src: `${LOGO_BASE}/InterswitchLogoColoured.svg` },
]

export const OFFICIAL_LOGO = "https://res.cloudinary.com/diapyzzws/image/upload/v1570181505/new_logos/SVGs/Website_2.svg"

/** TravelBeta's Tawk.to live chat (property / widget ids from travelbeta.com). */
export const TAWK = { propertyId: "578e0dbee7623dae37bd7a41", widgetId: "default" }
