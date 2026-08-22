"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ShoppingBag, Store, UserCheck } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import AdminUserListPanel from "@/components/dashboard/AdminUserListPanel";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { DeleteUser, GetUsers } from "@/lib/api/auth";
import type { DashboardUser } from "@/lib/dashboard/data";

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUser, setDeleteUser] = useState<DashboardUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadBuyers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetUsers("buyer");
      setBuyers(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBuyers();
  }, [loadBuyers]);

  const activeCount = buyers.filter((item) => item.status === "ACTIVE").length;

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      await DeleteUser(deleteUser.id);
      toast.success(`${deleteUser.name} মুছে ফেলা হয়েছে`);
      setBuyers((prev) => prev.filter((u) => u.id !== deleteUser.id));
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
          value={loading ? "-" : "—"}
          icon={ShoppingBag}
          tone="blue"
          delay={0.1}
        />
      </div>

      <SectionCard>
        <AdminUserListPanel
          role="buyer"
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
        title="ক্রেতা মুছে ফেলবেন?"
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
