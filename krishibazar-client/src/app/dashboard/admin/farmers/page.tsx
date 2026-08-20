"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Package, Tractor, UserCheck } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import UserTable from "@/components/dashboard/UserTable";
import {
  dashboardUsers,
  type DashboardUser,
  type UserStatus,
} from "@/lib/dashboard/data";

export default function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<DashboardUser[]>(
    dashboardUsers.filter((item) => item.role === "farmer")
  );

  const activeCount = farmers.filter((item) => item.status === "ACTIVE").length;
  const totalProducts = 12;

  const toggleStatus = (id: string) => {
    setFarmers((prev) =>
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
        title="কৃষক"
        subtitle="নিবন্ধিত কৃষকদের তালিকা ও তাদের কার্যক্রম"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="মোট কৃষক"
          value={farmers.length}
          icon={Tractor}
          tone="green"
          delay={0}
        />
        <StatCard
          label="সক্রিয় কৃষক"
          value={activeCount}
          icon={UserCheck}
          tone="emerald"
          trend="up"
          delay={0.05}
        />
        <StatCard
          label="মোট প্রকাশিত পণ্য"
          value={totalProducts}
          icon={Package}
          tone="blue"
          delay={0.1}
        />
      </div>

      <SectionCard>
        <UserTable
          users={farmers}
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
                {user.status === "ACTIVE" ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
              </button>
            )
          }
        />
      </SectionCard>
    </>
  );
}