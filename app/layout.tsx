import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Preloader } from "@/components/site/preloader";
import { TawkChat } from "@/components/site/tawk-chat";
import "./globals.css";

// Metropolis (the font on travelbeta.com) isn't on Google Fonts; Plus Jakarta
// Sans is the closest geometric match that next/font can self-host.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelBeta — Flights, Hotels, Visas & Holidays",
  description:
    "Book cheap flights, hotels, vacation packages and visa assistance. See exactly how you'll get there — by air, rail or road — before you book.",
};

export const viewport: Viewport = {
  themeColor: "#010080",
};

// Runs before first paint: skip the preloader if it already played this session.
const preloaderGate = `try{if(sessionStorage.getItem("tb-preloaded"))document.documentElement.setAttribute("data-preloaded","")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="preloader-gate" strategy="beforeInteractive">
          {preloaderGate}
        </Script>
        <Preloader />
        {children}
        <TawkChat />
      </body>
    </html>
  );
}
