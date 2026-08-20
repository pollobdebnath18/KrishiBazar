"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  History,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import ProductCard from "@/components/dashboard/ProductCard";
import {
  buyerOrders,
  buyerProducts,
  cartLines,
} from "@/lib/dashboard/data";

export default function BuyerDashboardPage() {
  const { user } = useAuth();

  const pendingOrders = buyerOrders.filter(
    (item) => item.status === "PENDING"
  ).length;
  const completedOrders = buyerOrders.filter(
    (item) => item.status === "DELIVERED"
  ).length;
  const cartItems = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const cartSubtotal = cartLines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0
  );
  const recentlyViewed = buyerProducts.slice(0, 3);

  return (
    <>
      <PageHeader
        title={`স্বাগতম, ${user?.name ?? "ক্রেতা"} 🛒`}
        subtitle="আপনার অর্ডার ও কেনাকাটার সারসংক্ষেপ"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="মোট অর্ডার"
          value={buyerOrders.length}
          icon={ClipboardList}
          tone="blue"
          delay={0}
        />
        <StatCard
          label="অপেক্ষমাণ অর্ডার"
          value={pendingOrders}
          icon={Clock}
          tone="amber"
          delay={0.05}
        />
        <StatCard
          label="সম্পন্ন অর্ডার"
          value={completedOrders}
          icon={CheckCircle2}
          tone="green"
          delay={0.1}
        />
        <StatCard
          label="কার্ট সারাংশ"
          value={cartItems}
          icon={ShoppingCart}
          tone="violet"
          hint={`মোট ${cartSubtotal}৳`}
          delay={0.15}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="mt-6"
      >
        <SectionCard
          title="সাম্প্রতিক অর্ডার"
          subtitle="আপনার সর্বশেষ অর্ডারগুলো"
        >
          <OrdersTable
            orders={buyerOrders}
            partyKey="farmer"
            partyLabel="কৃষক"
            limit={4}
          />
        </SectionCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="mt-6"
      >
        <SectionCard
          title="সাম্প্রতিক দেখা পণ্য"
          subtitle="আপনি যে পণ্যগুলো সম্প্রতি দেখেছেন"
          action={
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <History className="h-3.5 w-3.5" />
              ইতিহাস
            </span>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentlyViewed.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </SectionCard>
      </motion.div>
    </>
  );
}