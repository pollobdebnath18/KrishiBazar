"use client";

import { motion } from "framer-motion";
import {
  Banknote,
  ClipboardList,
  Clock,
  Package,
  PackageCheck,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { BarChart } from "@/components/dashboard/MiniCharts";
import {
  farmerOrders,
  farmerProducts,
  productPerformance,
  weeklySales,
} from "@/lib/dashboard/data";

export default function FarmerDashboardPage() {
  const { user } = useAuth();

  const activeProducts = farmerProducts.filter(
    (item) => item.status === "ACTIVE"
  ).length;
  const outOfStock = farmerProducts.filter(
    (item) => item.status === "OUT_OF_STOCK"
  ).length;
  const pendingOrders = farmerOrders.filter(
    (item) => item.status === "PENDING"
  ).length;
  const totalRevenue = farmerOrders.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <PageHeader
        title={`স্বাগতম, ${user?.name ?? "কৃষক"} 🌾`}
        subtitle="আপনার পণ্য, অর্ডার ও বিক্রয়ের সারসংক্ষেপ"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="মোট পণ্য"
          value={farmerProducts.length}
          icon={Package}
          tone="emerald"
          delay={0}
        />
        <StatCard
          label="সক্রিয় পণ্য"
          value={activeProducts}
          icon={PackageCheck}
          tone="green"
          hint={`${outOfStock}টি স্টক শেষ`}
          delay={0.05}
        />
        <StatCard
          label="মোট অর্ডার"
          value={farmerOrders.length}
          icon={ClipboardList}
          tone="blue"
          delay={0.1}
        />
        <StatCard
          label="অপেক্ষমাণ অর্ডার"
          value={pendingOrders}
          icon={Clock}
          tone="amber"
          delay={0.15}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="পণ্যের পারফরম্যান্স"
          subtitle="বিক্রির হিসাবে শীর্ষ পণ্য"
          action={
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <TrendingUp className="h-3.5 w-3.5" />
              মোট বিক্রয়: {farmerProducts.reduce((s, p) => s + p.sold, 0)} ইউনিট
            </span>
          }
        >
          <BarChart data={productPerformance} suffix="" height={200} />
        </SectionCard>

        <SectionCard
          title="সাপ্তাহিক আয়"
          subtitle="এই সপ্তাহের বিক্রয় আয় (৳)"
          action={
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <Banknote className="h-3.5 w-3.5" />
              মোট: {weeklySales.reduce((s, d) => s + d.value, 0)}৳
            </span>
          }
        >
          <BarChart data={weeklySales} suffix="৳" height={200} />
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs font-medium text-gray-500">আনুমানিক আয়</p>
              <p className="text-xl font-extrabold text-green-700">
                {totalRevenue}৳
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">প্রতি অর্ডার গড়</p>
              <p className="text-xl font-extrabold text-gray-900">
                {farmerOrders.length > 0
                  ? Math.round(totalRevenue / farmerOrders.length)
                  : 0}
                ৳
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="mt-6"
      >
        <SectionCard
          title="সাম্প্রতিক অর্ডার"
          subtitle="সর্বশেষ অর্ডারগুলো"
        >
          <OrdersTable
            orders={farmerOrders}
            partyKey="customer"
            partyLabel="ক্রেতা"
            limit={4}
          />
        </SectionCard>
      </motion.div>
    </>
  );
}