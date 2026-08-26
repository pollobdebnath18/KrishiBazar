import Banner from "@/components/Banner";
import CTASection from "@/components/CTASection";
import FarmerProducts from "@/components/FarmerProducts";
import TodayMarketPrices from "@/components/TodayMarketPrices";
import WhyKrishiBazar from "@/components/WhyKrishiBazar";
import PopularCategories from "@/components/PopularCategories";

export default function Home() {
  return (
    <>
      <Banner />
      <PopularCategories />
      <FarmerProducts />
      <TodayMarketPrices />

      <WhyKrishiBazar />
      <CTASection />
    </>
  );
}
