"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, WifiOff } from "lucide-react";
import { GetUsers } from "@/lib/api/auth";
import type { DashboardUser } from "@/lib/dashboard/data";
import UserTable from "./UserTable";
import EmptyState from "./EmptyState";

type ViewState = "loading" | "error" | "ready";

interface AdminUserListPanelProps {
  role?: string;
  showRole?: boolean;
  action?: (user: DashboardUser) => React.ReactNode;
}

export default function AdminUserListPanel({
  role,
  showRole = true,
  action,
}: AdminUserListPanelProps) {
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await GetUsers(role);
        if (cancelled) return;
        setUsers(response.data);
        setViewState("ready");
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(
          err instanceof Error ? err.message : "সার্ভার থেকে তথ্য পাওয়া যায়নি"
        );
        setViewState("error");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [role, reloadCount]);

  const handleRetry = useCallback(() => {
    setViewState("loading");
    setErrorMessage(undefined);
    setReloadCount((count) => count + 1);
  }, []);

  if (viewState === "loading") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="h-16 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (viewState === "error") {
    return (
      <EmptyState
        icon={<WifiOff className="h-7 w-7" />}
        title="তথ্য লোড করা যায়নি"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <RefreshCw className="h-4 w-4" />
            আবার চেষ্টা করুন
          </button>
        }
      />
    );
  }

  return (
    <UserTable
      users={users}
      showRole={showRole}
      action={action}
    />
  );
}
