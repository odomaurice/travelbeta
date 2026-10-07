import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { PromoPopup } from "@/components/home/promo-popup";
import { DestinationsMap } from "@/components/home/destinations-map";
import { TrendingRoutes } from "@/components/home/routes";
import { SearchHub } from "@/components/home/search-hub";
import { HowItWorks, PackagesPreview, RentVehicleBand, SignatureServices, WhyUs } from "@/components/home/sections";
import { TripProvider } from "@/components/trip/trip-context";

export default function Home() {
  return (
    <TripProvider>
      <Hero />
      <SearchHub />
      <SignatureServices />
      <PackagesPreview />
      <TrendingRoutes />
      <HowItWorks />
      <RentVehicleBand />
      <WhyUs />
      <DestinationsMap />
      <Faq />
      <PromoPopup />
    </TripProvider>
  );
}
