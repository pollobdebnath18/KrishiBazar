"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import DashboardSettings from "@/components/dashboard/DashboardSettings";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader
        title="সেটিংস"
        subtitle="আপনার অ্যাকাউন্টের তথ্য ও পছন্দ পরিবর্তন করুন"
      />
      <DashboardSettings />
    </>
  );
}