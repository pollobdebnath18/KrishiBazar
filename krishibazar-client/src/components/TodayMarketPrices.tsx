"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  TrendingDown,
  TrendingUp,
  TrendingUp as Minus,
} from "lucide-react";
import { getMarketPrices } from "@/lib/api/marketPrice";
import type { MarketPrice } from "@/types/marketPrice";
import {
  formatDate,
  formatPrice,
  formatQuantity,
  resolvePriceStatus,
} from "@/lib/format";
import {
  translateCategory,
  translateLocation,
  translateProductTitle,
} from "@/lib/bangla";

const statusStyles = {
  increased: { icon: TrendingUp, color: "text-red-500", label: "বেড়েছে" },
  decreased: { icon: TrendingDown, color: "text-emerald-500", label: "কমেছে" },
  stable: { icon: Minus, color: "text-amber-500", label: "অপরিবর্তিত" },
};

export default function TodayMarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketPrices({})
      .then((res) => setPrices(res.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[#f5f8f2] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 h-6 w-40 animate-pulse rounded-full bg-green-200" />
            <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-green-100" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-green-200 bg-white p-5"
              >
                <div className="mb-3 h-5 w-1/2 animate-pulse rounded bg-green-100" />
                <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-green-50" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-green-50" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (prices.length === 0) return null;

  return (
    <section className="bg-[#f5f8f2] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            <CalendarDays className="h-4 w-4" />
            আজকের তথ্য
          </span>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            আজকের বাজার দর
          </h2>
          <p className="mt-3 text-base text-gray-500">
            সর্বশেষ কৃষিপণ্যের দাম — প্রতিদিন হালনাগাদ
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prices.map((item, index) => {
            const status = resolvePriceStatus(item);
            const cfg = statusStyles[status];
            const StatusIcon = cfg.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-green-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Top row: title + price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-gray-900">
                      {translateProductTitle(item.title)}
                    </h3>
                    <span className="mt-1 inline-block rounded-md bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                      {translateCategory(item.category)}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xl font-extrabold text-green-700">
                      {formatPrice(item.price)}
                    </p>
                    {item.previousPrice != null && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(item.previousPrice)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-green-600" />
                    {translateLocation(item.location)}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span>{formatQuantity(item.quantity, item.unit)}</span>
                  <span className="text-gray-300">|</span>
                  <span className={`flex items-center gap-1 font-medium ${cfg.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </span>
                </div>

                {/* Date */}
                <p className="mt-3 text-xs text-gray-400">
                  {formatDate(item.date)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/market-prices"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            সব বাজারদর দেখুন
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
