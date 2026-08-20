"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Ban, CheckCircle2, Plus, Users } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import UserTable from "@/components/dashboard/UserTable";
import {
  dashboardUsers,
  type DashboardUser,
  type UserStatus,
} from "@/lib/dashboard/data";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DashboardUser[]>(dashboardUsers);

  const activeCount = users.filter((item) => item.status === "ACTIVE").length;

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
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
        title="ব্যবহারকারী"
        subtitle="প্ল্যাটফর্মের সব ব্যবহারকারীর তালিকা ও অবস্থা পরিচালনা করুন"
        action={
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-600/25 transition hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            ব্যবহারকারী যোগ করুন
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="মোট ব্যবহারকারী"
          value={users.length}
          icon={Users}
          tone="blue"
          delay={0}
        />
        <StatCard
          label="সক্রিয়"
          value={activeCount}
          icon={CheckCircle2}
          tone="green"
          delay={0.05}
        />
        <StatCard
          label="নিষ্ক্রিয়"
          value={users.length - activeCount}
          icon={Ban}
          tone="red"
          delay={0.1}
        />
      </div>

      <SectionCard>
        <UserTable
          users={users}
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