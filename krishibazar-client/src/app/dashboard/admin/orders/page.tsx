"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { adminOrders } from "@/lib/dashboard/data";

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const orders = adminOrders;

  const pendingCount = orders.filter((item) => item.status === "PENDING").length;
  const deliveredCount = orders.filter(
    (item) => item.status === "DELIVERED"
  ).length;

  const filters = [
    { key: "ALL", label: "সব" },
    { key: "PENDING", label: "অপেক্ষমাণ" },
    { key: "DELIVERED", label: "ডেলিভারি" },
    { key: "CANCELLED", label: "বাতিল" },
  ];

  const visibleOrders =
    filter === "ALL" ? orders : orders.filter((item) => item.status === filter);

  return (
    <>
      <PageHeader
        title="অর্ডারসমূহ"
        subtitle="প্ল্যাটফর্মের সব অর্ডার এক জায়গায়"
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
        subtitle="স্ট্যাটাস অনুযায়ী ফিল্টার করুন"
        action={
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  filter === item.key
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      >
        <OrdersTable
          orders={visibleOrders}
          partyKey="customer"
          partyLabel="ক্রেতা"
          action={(order) => (
            <button
              type="button"
              onClick={() => toast.info(`${order.orderNumber} এর বিস্তারিত দেখছেন`)}
              className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-green-50 hover:text-green-700"
            >
              <Eye className="h-3.5 w-3.5" />
              বিস্তারিত
            </button>
          )}
        />
      </SectionCard>
    </>
  );
}