"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import MarketPricesPanel from "@/components/dashboard/MarketPricesPanel";

export default function FarmerMarketPricesPage() {
  return (
    <>
      <PageHeader
        title="বাজারদর"
        subtitle="দর নির্ধারণে সাহায্য নিন দৈনিক বাজারদর থেকে"
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