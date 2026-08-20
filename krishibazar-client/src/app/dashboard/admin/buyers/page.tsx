"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { ShoppingBag, Store, UserCheck, UserX } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import UserTable from "@/components/dashboard/UserTable";
import {
  dashboardUsers,
  type DashboardUser,
  type UserStatus,
} from "@/lib/dashboard/data";

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<DashboardUser[]>(
    dashboardUsers.filter((item) => item.role === "buyer")
  );

  const activeCount = buyers.filter((item) => item.status === "ACTIVE").length;
  const totalOrders = 24;

  const toggleStatus = (id: string) => {
    setBuyers((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next: UserStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        toast.success(
          next === "ACTIVE"
            ? `${item.name} সক্রিয় করা হয়েছে`
            : `${item.name} নিষ্ক্রিয় করা হয়েছে`
        );
        return { ...item, status: next };
      })
    );
  };

  return (
    <>
      <PageHeader
        title="ক্রেতা"
        subtitle="নিবন্ধিত ক্রেতাদের তালিকা ও কেনাকাটার তথ্য"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="মোট ক্রেতা"
          value={buyers.length}
          icon={Store}
          tone="violet"
          delay={0}
        />
        <StatCard
          label="সক্রিয় ক্রেতা"
          value={activeCount}
          icon={UserCheck}
          tone="green"
          trend="up"
          delay={0.05}
        />
        <StatCard
          label="মোট অর্ডার"
          value={totalOrders}
          icon={ShoppingBag}
          tone="blue"
          delay={0.1}
        />
      </div>

      <SectionCard>
        <UserTable
          users={buyers}
          showRole={false}
          action={(user) =>
            user.role === "admin" ? null : (
              <button
                type="button"
                onClick={() => toggleStatus(user.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  user.status === "ACTIVE"
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {user.status === "ACTIVE" ? (
                  <span className="flex items-center gap-1">
                    <UserX className="h-3.5 w-3.5" />
                    নিষ্ক্রিয় করুন
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5" />
                    সক্রিয় করুন
                  </span>
                )}
              </button>
            )
          }
        />
      </SectionCard>
    </>
  );
}