"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, ClipboardList, Clock } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { getOrders } from "@/lib/api/orders";
import type { DashboardOrder } from "@/lib/dashboard/data";

export default function BuyerMyOrdersPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getOrders()
      .then((response) => {
        if (!mounted) return;
        setOrders(response.data);
      })
      .catch(() => {
        if (!mounted) return;
        setOrders([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const pendingCount = orders.filter((item) => item.status === "PENDING").length;
  const completedCount = orders.filter(
    (item) => item.status === "DELIVERED",
  ).length;

  return (
    <>
      <PageHeader
        title="আমার অর্ডার"
        subtitle="আপনার সব অর্ডারের ইতিহাস ও অবস্থা"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="মোট অর্ডার"
          value={loading ? "—" : orders.length}
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
          label="সম্পন্ন"
          value={completedCount}
          icon={CheckCircle2}
          tone="green"
          delay={0.1}
        />
      </div>

      <SectionCard
        title="অর্ডার ইতিহাস"
        subtitle="কৃষকের কাছ থেকে সরাসরি অর্ডার ট্র্যাক করুন"
      >
        <OrdersTable
          orders={orders}
          partyKey="farmer"
          partyLabel="কৃষক"
          action={(order) => (
            <button
              type="button"
              onClick={() => toast.info(`${order.orderNumber} ট্র্যাক করছেন`)}
              className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-green-50 hover:text-green-700"
            >
              ট্র্যাক করুন
            </button>
          )}
        />
      </SectionCard>
    </>
  );
}