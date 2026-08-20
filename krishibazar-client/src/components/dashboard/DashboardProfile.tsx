"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  Tractor,
  User,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { roleLabels, type DashboardRole } from "@/lib/dashboard/navigation";

const roleIcons: Record<DashboardRole, LucideIcon> = {
  admin: BadgeCheck,
  farmer: Tractor,
  buyer: Store,
};

export default function DashboardProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role as DashboardRole;
  const RoleIcon = roleIcons[role] ?? User;

  const location = [user.district, user.upazila].filter(Boolean).join(", ");

  const rows: { icon: LucideIcon; label: string; value?: string | null }[] = [
    { icon: User, label: "পূর্ণ নাম", value: user.name },
    { icon: Mail, label: "ইমেইল", value: user.email },
    { icon: Phone, label: "মোবাইল নম্বর", value: user.mobile },
    { icon: MapPin, label: "জেলা", value: user.district },
    { icon: MapPin, label: "উপজেলা", value: user.upazila },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Header card */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="lg:col-span-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="h-28 bg-gradient-to-r from-green-700 via-green-600 to-emerald-500" />
        <div className="px-5 pb-6 sm:px-6">
          <div className="-mt-10 flex items-end gap-4">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-green-600 text-2xl font-bold text-white shadow-lg">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {user.name}
                </h2>
                <BadgeCheck className="h-5 w-5 fill-green-600 text-white" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <RoleIcon className="h-3.5 w-3.5" />
                  {roleLabels[role] ?? role}
                </span>
                {location && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-green-600" />
                    {location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Account card */}
      <motion.aside
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="space-y-6"
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">অ্যাকাউন্ট</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">স্ট্যাটাস</p>
                  <p className="text-xs text-gray-500">অ্যাকাউন্ট সক্রিয়</p>
                </div>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700">
                <CalendarDays className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">সদস্যপদ</p>
                <p className="text-xs text-gray-500">কৃষিবাজারের সদস্য</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Personal info */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-base font-bold text-gray-900">ব্যক্তিগত তথ্য</h3>
        <p className="mt-0.5 text-sm text-gray-500">
          আপনার অ্যাকাউন্টের মৌলিক তথ্য
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                  {value || "তথ্য দেওয়া হয়নি"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}