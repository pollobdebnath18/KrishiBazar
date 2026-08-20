"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import type { DashboardUser } from "@/lib/dashboard/data";
import { roleLabels, type DashboardRole } from "@/lib/dashboard/navigation";
import { UserStatusBadge } from "./StatusBadge";

const roleTones: Record<DashboardRole, string> = {
  admin: "bg-violet-50 text-violet-700",
  farmer: "bg-green-50 text-green-700",
  buyer: "bg-blue-50 text-blue-700",
};

function RoleBadge({ role }: { role: DashboardRole }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${roleTones[role]}`}
    >
      {roleLabels[role]}
    </span>
  );
}

interface UserTableProps {
  users: DashboardUser[];
  showRole?: boolean;
  emptyTitle?: string;
  action?: (user: DashboardUser) => ReactNode;
}

export default function UserTable({
  users,
  showRole = true,
  emptyTitle = "কোনো ব্যবহারকারী পাওয়া যায়নি",
  action,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="text-lg font-bold text-gray-900">{emptyTitle}</p>
      </div>
    );
  }

  return (
    <div className="-mx-5 sm:-mx-6">
      {/* Header (desktop) */}
      <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_0.8fr_auto] gap-4 border-b border-gray-200 px-6 pb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 lg:grid">
        <span>ব্যবহারকারী</span>
        <span>ভূমিকা</span>
        <span>অবস্থান</span>
        <span>যোগদান</span>
        <span>স্ট্যাটাস</span>
        <span />
      </div>

      <div className="divide-y divide-gray-100">
        {users.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="grid grid-cols-1 gap-3 px-5 py-4 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr_0.8fr_auto] lg:items-center lg:gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-bold text-white">
                {item.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {item.name}
                </p>
                <p className="flex items-center gap-1 truncate text-xs text-gray-500">
                  <Mail className="h-3 w-3" />
                  {item.email}
                </p>
              </div>
            </div>

            <div>
              {showRole ? (
                <RoleBadge role={item.role} />
              ) : (
                <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <Phone className="h-3 w-3" />
                  {item.mobile}
                </span>
              )}
              <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-400 lg:hidden">
                <MapPin className="h-3 w-3" />
                {item.district}
              </p>
            </div>

            <p className="hidden items-center gap-1 truncate text-sm text-gray-600 lg:flex">
              <MapPin className="h-4 w-4 shrink-0 text-green-600" />
              {[item.district, item.upazila].filter(Boolean).join(", ")}
            </p>

            <p className="text-sm text-gray-500">{item.joinedAt}</p>

            <div>
              <UserStatusBadge status={item.status} />
            </div>

            {action && <div className="flex justify-end">{action(item)}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}