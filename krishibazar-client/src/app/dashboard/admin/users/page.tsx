"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Ban, CheckCircle2, Plus, Users } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import AdminUserListPanel from "@/components/dashboard/AdminUserListPanel";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { DeleteUser, GetUsers } from "@/lib/api/auth";
import type { DashboardUser } from "@/lib/dashboard/data";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUser, setDeleteUser] = useState<DashboardUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetUsers();
      setUsers(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const activeCount = users.filter((item) => item.status === "ACTIVE").length;

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      await DeleteUser(deleteUser.id);
      toast.success(`${deleteUser.name} মুছে ফেলা হয়েছে`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
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
        <AdminUserListPanel
          action={(user) =>
            user.role === "admin" ? null : (
              <button
                type="button"
                onClick={() => setDeleteUser(user)}
                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                মুছে ফেলুন
              </button>
            )
          }
        />
      </SectionCard>

      <ConfirmDialog
        open={!!deleteUser}
        title="ব্যবহারকারী মুছে ফেলবেন?"
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
