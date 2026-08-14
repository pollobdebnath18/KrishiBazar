"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Edit3,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  Tractor,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const roleLabels: Record<string, string> = {
  admin: "অ্যাডমিন",
  farmer: "কৃষক",
  buyer: "ক্রেতা",
};

const roleIcons: Record<string, typeof Tractor> = {
  admin: BadgeCheck,
  farmer: Tractor,
  buyer: Store,
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const RoleIcon = roleIcons[user.role] ?? User;

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const location = [user.district, user.upazila].filter(Boolean).join(", ");

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f5f8f2]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Back */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            হোমে ফিরে যান
          </Link>
        </motion.div>

        {/* Main profile */}
        <motion.section
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 sm:h-40" />

          {/* Profile header */}
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-green-600 text-2xl font-bold text-white shadow-lg sm:h-24 sm:w-24 sm:text-3xl">
                  {initials}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {user.name}
                    </h1>
                    <BadgeCheck className="h-5 w-5 fill-green-600 text-white" />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                      <RoleIcon className="h-3.5 w-3.5" />
                      {roleLabels[user.role] ?? user.role}
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

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  ড্যাশবোর্ড
                </Link>

                <Link
                  href="/settings"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                  <Edit3 className="h-4 w-4" />
                  প্রোফাইল সম্পাদনা
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Personal information */}
          <motion.section
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: 0.12 }}
            className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  ব্যক্তিগত তথ্য
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  আপনার অ্যাকাউন্টের মৌলিক তথ্য
                </p>
              </div>

              <Link
                href="/settings"
                className="hidden items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 sm:flex"
              >
                সম্পাদনা
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <InfoCard icon={User} label="পূর্ণ নাম" value={user.name} />

              {/* Email */}
              <InfoCard icon={Mail} label="ইমেইল" value={user.email} />

              {/* Mobile */}
              <InfoCard icon={Phone} label="মোবাইল নম্বর" value={user.mobile} />

              {/* Role */}
              <InfoCard
                icon={RoleIcon}
                label="অ্যাকাউন্টের ধরন"
                value={roleLabels[user.role] ?? user.role}
              />

              {/* District */}
              <InfoCard icon={MapPin} label="জেলা" value={user.district} />

              {/* Upazila */}
              <InfoCard icon={MapPin} label="উপজেলা" value={user.upazila} />
            </div>

            {/* Full location */}
            <div className="mt-4 rounded-xl border border-green-100 bg-green-50/60 p-4">
              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                  <MapPin className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">অবস্থান</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {location || "অবস্থান যোগ করা হয়নি"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    আপনার নির্বাচিত জেলা ও উপজেলা
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/settings"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700 sm:hidden"
            >
              <Edit3 className="h-4 w-4" />
              তথ্য সম্পাদনা করুন
            </Link>
          </motion.section>

          {/* Account overview */}
          <motion.aside
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: 0.18 }}
            className="space-y-6"
          >
            {/* Account card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-gray-900">অ্যাকাউন্ট</h2>
              <p className="mt-1 text-sm text-gray-500">
                আপনার অ্যাকাউন্টের অবস্থা
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        স্ট্যাটাস
                      </p>
                      <p className="text-xs text-gray-500">
                        অ্যাকাউন্ট সক্রিয়
                      </p>
                    </div>
                  </div>

                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      সদস্য হিসেবে
                    </p>
                    <p className="text-xs text-gray-500">কৃষিবাজারের সদস্য</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role card */}
            <div className="overflow-hidden rounded-2xl border border-green-100 bg-gradient-to-br from-green-600 to-emerald-600 p-5 text-white shadow-sm sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <RoleIcon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-lg font-bold">
                {roleLabels[user.role] ?? user.role}
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-50">
                {user.role === "farmer"
                  ? "আপনি কৃষক হিসেবে কৃষিপণ্য বিক্রি করতে পারবেন।"
                  : user.role === "buyer"
                    ? "আপনি ক্রেতা হিসেবে কৃষিপণ্য খুঁজে কিনতে পারবেন।"
                    : "আপনি অ্যাডমিন হিসেবে প্ল্যাটফর্ম পরিচালনা করতে পারবেন।"}
              </p>

              <Link
                href="/dashboard"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
              >
                ড্যাশবোর্ড দেখুন
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
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
  );
}
