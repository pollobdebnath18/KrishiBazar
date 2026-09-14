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
      {/* 
      extensions : 
      1/ prisma
      2/ auto import
      3/ auto rename
      4/ auto remove
      5/ code runner
      6/ dart
      7/  es7 react/redux /graphql/react-native snippets
      8/ ESLint
      9/ javascript code snippets
      10/ Live Server
      11/ material icon theme
      12/ npm intellisense
      13/ one dark theme
      14/ opencode
      15/ path intellisense
      16/ prettier - code formatter
      17/ react extension pack
      18/ reactjs code snippets
      19/ search node modules
      20/ supermaven
      21/ tailwind css intellisense
      22/ thunder clientS
    
      */}
    </>
  );
}
