"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, ClipboardList, Clock, RefreshCcw } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import {
  farmerOrders,
  type DashboardOrder,
  type OrderStatus,
} from "@/lib/dashboard/data";

const statusOptions: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>(farmerOrders);

  const pendingCount = orders.filter((item) => item.status === "PENDING").length;
  const deliveredCount = orders.filter(
    (item) => item.status === "DELIVERED"
  ).length;

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    toast.success(`অর্ডার ${id.toUpperCase()} এর স্ট্যাটাস হালনাগাদ হয়েছে`);
  };

  return (
    <>
      <PageHeader
        title="অর্ডারসমূহ"
        subtitle="আপনার পণ্যের অর্ডারগুলো পরিচালনা করুন"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="মোট অর্ডার"
          value={orders.length}
          icon={ClipboardList}
          tone="blue"
          delay={0}
        />
        <StatCard
          label="অপেক্ষমাণ"
          value={pendingCount}
          icon={Clock}
          tone="amber"
          delay={0.05}
        />
        <StatCard
          label="ডেলিভারি সম্পন্ন"
          value={deliveredCount}
          icon={CheckCircle2}
          tone="green"
          delay={0.1}
        />
      </div>

      <SectionCard
        title="অর্ডার তালিকা"
        subtitle="প্রতিটি অর্ডারের স্ট্যাটাস হালনাগাদ করুন"
      >
        <OrdersTable
          orders={orders}
          partyKey="customer"
          partyLabel="ক্রেতা"
          action={(order) => (
            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
              aria-label="অর্ডার স্ট্যাটাস"
              className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none transition focus:border-green-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          )}
        />
      </SectionCard>

      <div className="mt-6">
        <SectionCard title="স্ট্যাটাস গাইড" delay={0.1}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-600">
            <RefreshCcw className="h-4 w-4 text-green-600" />
            <span>অপেক্ষমাণ</span>
            <span>→</span>
            <span>নিশ্চিতকৃত</span>
            <span>→</span>
            <span>প্রক্রিয়াধীন</span>
            <span>→</span>
            <span>পাঠানো হয়েছে</span>
            <span>→</span>
            <span>ডেলিভারি সম্পন্ন</span>
          </div>
        </SectionCard>
      </div>
    </>
  );
}