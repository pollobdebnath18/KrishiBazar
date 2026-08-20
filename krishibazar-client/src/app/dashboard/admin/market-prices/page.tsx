"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import MarketPricesPanel from "@/components/dashboard/MarketPricesPanel";

export default function AdminMarketPricesPage() {
  return (
    <>
      <PageHeader
        title="বাজারদর"
        subtitle="দৈনিক বাজার দরের হালনাগাদ তালিকা"
      />
      <SectionCard
        title="সব বাজারদর"
        subtitle="সার্ভার থেকে সংগৃহীত সর্বশেষ তথ্য"
      >
        <MarketPricesPanel />
      </SectionCard>
    </>
  );
}