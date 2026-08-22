"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Package, Tractor, UserCheck } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import AdminUserListPanel from "@/components/dashboard/AdminUserListPanel";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { DeleteUser, GetUsers } from "@/lib/api/auth";
import type { DashboardUser } from "@/lib/dashboard/data";

export default function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUser, setDeleteUser] = useState<DashboardUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadFarmers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetUsers("farmer");
      setFarmers(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  const activeCount = farmers.filter((item) => item.status === "ACTIVE").length;

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      await DeleteUser(deleteUser.id);
      toast.success(`${deleteUser.name} মুছে ফেলা হয়েছে`);
      setFarmers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "মুছে ফেলা যায়নি");
    } finally {
      setDeleteLoading(false);
    }
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
          value={loading ? "-" : "—"}
          icon={Package}
          tone="blue"
          delay={0.1}
        />
      </div>

      <SectionCard>
        <AdminUserListPanel
          role="farmer"
          showRole={false}
          action={(user) => (
            <button
              type="button"
              onClick={() => setDeleteUser(user)}
              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
              মুছে ফেলুন
            </button>
          )}
        />
      </SectionCard>

      <ConfirmDialog
        open={!!deleteUser}
        title="কৃষক মুছে ফেলবেন?"
        description={`"${deleteUser?.name}" কে প্ল্যাটফর্ম থেকে মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`}
        confirmLabel={deleteLoading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
        cancelLabel="বাতিল"
        confirmTone="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteUser(null)}
      />
    </>
  );
}
