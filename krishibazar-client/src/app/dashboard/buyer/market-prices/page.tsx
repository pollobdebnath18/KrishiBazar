"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import MarketPricesPanel from "@/components/dashboard/MarketPricesPanel";

export default function BuyerMarketPricesPage() {
  return (
    <>
      <PageHeader
        title="বাজারদর"
        subtitle="সঠিক দামে কেনাকাটা করতে দৈনিক বাজারদর দেখুন"
      />
      <SectionCard
        title="দৈনিক বাজারদর"
        subtitle="সারাদেশের বাজার থেকে সংগৃহীত সর্বশেষ দর"
      >
        <MarketPricesPanel />
      </SectionCard>
    </>
  );
}