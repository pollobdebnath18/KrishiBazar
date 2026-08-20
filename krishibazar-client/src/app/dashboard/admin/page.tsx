"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ClipboardList,
  Package,
  Store,
  Tractor,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import { BarChart } from "@/components/dashboard/MiniCharts";
import {
  adminActivity,
  adminDashboardProducts,
  adminOrders,
  dashboardUsers,
  marketPriceTrend,
  type ActivityType,
} from "@/lib/dashboard/data";

const activityIcons: Record<ActivityType, LucideIcon> = {
  user: Users,
  product: Package,
  order: ClipboardList,
  price: TrendingUp,
};

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const farmers = dashboardUsers.filter((item) => item.role === "farmer");
  const buyers = dashboardUsers.filter((item) => item.role === "buyer");
  const activeProducts = adminDashboardProducts.filter(
    (item) => item.status === "ACTIVE"
  );

  return (
    <>
      <PageHeader
        title={`স্বাগতম, ${user?.name ?? "অ্যাডমিন"} 👋`}
        subtitle="পুরো প্ল্যাটফর্মের সারসংক্ষেপ এক নজরে দেখুন"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="মোট ব্যবহারকারী"
          value={dashboardUsers.length}
          icon={Users}
          tone="blue"
          hint="সব ভূমিকার সমন্বয়ে"
          delay={0}
        />
        <StatCard
          label="মোট কৃষক"
          value={farmers.length}
          icon={Tractor}
          tone="green"
          hint="সক্রিয় কৃষকরা পণ্য দিচ্ছেন"
          trend="up"
          delay={0.05}
        />
        <StatCard
          label="মোট ক্রেতা"
          value={buyers.length}
          icon={Store}
          tone="violet"
          hint="সক্রিয় ক্রেতা"
          trend="up"
          delay={0.1}
        />
        <StatCard
          label="মোট পণ্য"
          value={adminDashboardProducts.length}
          icon={Package}
          tone="emerald"
          hint={`${activeProducts.length}টি প্রকাশিত`}
          delay={0.15}
        />
        <StatCard
          label="মোট অর্ডার"
          value={adminOrders.length}
          icon={ClipboardList}
          tone="amber"
          hint="সর্বমোট অর্ডার"
          trend="up"
          delay={0.2}
        />
        <StatCard
          label="বাজারদর এন্ট্রি"
          value={marketPriceTrend.length * 4}
          icon={TrendingUp}
          tone="red"
          hint="সর্বশেষ সপ্তাহ"
          delay={0.25}
        />
      </div>

      {/* Overview grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="বাজারদর ওভারভিউ"
          subtitle="সর্বশেষ সপ্তাহের গড় বাজারদর প্রবণতা"
          action={
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              সাপ্তাহিক
            </span>
          }
        >
          <BarChart data={marketPriceTrend} suffix="৳" height={200} />
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs font-medium text-gray-500">সর্বোচ্চ</p>
              <p className="text-lg font-extrabold text-green-700">৭৫৳</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">সর্বনিম্ন</p>
              <p className="text-lg font-extrabold text-gray-900">৫৮৳</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">পরিবর্তন</p>
              <p className="text-lg font-extrabold text-red-600">+১৭৳</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="সাম্প্রতিক কার্যক্রম"
          subtitle="সর্বশেষ প্ল্যাটফর্ম কার্যক্রম"
          action={
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <Activity className="h-3.5 w-3.5" />
              লাইভ
            </span>
          }
        >
          <ul className="space-y-1">
            {adminActivity.map((item, index) => {
              const Icon = activityIcons[item.type];
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {item.detail}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 text-[11px] font-medium text-gray-400">
                    {item.time}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}