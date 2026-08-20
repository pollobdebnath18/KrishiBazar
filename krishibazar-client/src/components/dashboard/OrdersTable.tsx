"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { DashboardOrder } from "@/lib/dashboard/data";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "./StatusBadge";

interface OrdersTableProps {
  orders: DashboardOrder[];
  partyKey: "customer" | "farmer";
  partyLabel: string;
  emptyTitle?: string;
  action?: (order: DashboardOrder) => ReactNode;
  limit?: number;
}

export default function OrdersTable({
  orders,
  partyKey,
  partyLabel,
  emptyTitle = "এখনো কোনো অর্ডার নেই",
  action,
  limit,
}: OrdersTableProps) {
  const visibleOrders = limit ? orders.slice(0, limit) : orders;

  if (visibleOrders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="text-lg font-bold text-gray-900">{emptyTitle}</p>
        <p className="text-sm text-gray-500">নতুন অর্ডার এলে এখানে দেখা যাবে।</p>
      </div>
    );
  }

  return (
    <div className="-mx-5 sm:-mx-6">
      {/* Header (desktop) */}
      <div className="hidden grid-cols-[1.3fr_1fr_1.2fr_0.7fr_0.8fr_1fr_auto] gap-4 border-b border-gray-200 px-6 pb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 lg:grid">
        <span>অর্ডার নম্বর</span>
        <span>{partyLabel}</span>
        <span>পণ্য</span>
        <span>পরিমাণ</span>
        <span>মোট</span>
        <span>স্ট্যাটাস</span>
        <span />
      </div>

      <div className="divide-y divide-gray-100">
        {visibleOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="grid grid-cols-1 gap-3 px-5 py-4 sm:px-6 lg:grid-cols-[1.3fr_1fr_1.2fr_0.7fr_0.8fr_1fr_auto] lg:items-center lg:gap-4"
          >
            <div className="flex items-start justify-between gap-3 lg:flex-col lg:gap-1">
              <p className="text-sm font-bold text-gray-900">
                {order.orderNumber}
              </p>
              <span className="lg:hidden">
                <OrderStatusBadge status={order.status} />
              </span>
            </div>

            <p className="truncate text-sm font-medium text-gray-700">
              {order[partyKey]}
            </p>

            <div className="flex flex-col">
              <p className="truncate text-sm font-medium text-gray-900">
                {order.product}
              </p>
              <p className="text-xs text-gray-400">{order.date}</p>
            </div>

            <p className="text-sm font-medium text-gray-600">
              {order.quantity} {order.unit}
            </p>

            <p className="text-sm font-extrabold text-green-700">
              {formatPrice(order.total)}
            </p>

            <div className="hidden lg:block">
              <OrderStatusBadge status={order.status} />
            </div>

            {action && <div className="flex justify-end">{action(order)}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}