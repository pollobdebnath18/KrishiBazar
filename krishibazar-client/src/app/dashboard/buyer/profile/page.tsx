"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import DashboardProfile from "@/components/dashboard/DashboardProfile";

export default function BuyerProfilePage() {
  return (
    <>
      <PageHeader title="প্রোফাইল" subtitle="আপনার অ্যাকাউন্টের তথ্য" />
      <DashboardProfile />
    </>
  );
}