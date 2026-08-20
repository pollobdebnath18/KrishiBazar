"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Package,
  ShoppingBasket,
} from "lucide-react";
import type { MarketPrice, PriceStatus } from "@/types/marketPrice";
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

interface StatusConfig {
  label: string;
  className: string;
  dot: string;
}

const statusConfigs: Record<PriceStatus, StatusConfig> = {
  increased: {
    label: "দাম বেড়েছে",
    className: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
  decreased: {
    label: "দাম কমেছে",
    className: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  stable: {
    label: "দাম অপরিবর্তিত",
    className: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
};

interface MarketPriceCardProps {
  marketPrice: MarketPrice;
  index: number;
}

export default function MarketPriceCard({
  marketPrice,
  index,
}: MarketPriceCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const status = resolvePriceStatus(marketPrice);
  const { label, className, dot } = statusConfigs[status];

  return (
<motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.08 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-green-300 bg-white shadow-sm transition-shadow hover:shadow-xl sm:flex-row"
    >
      {/* ছবি */}
      <div className="relative aspect-square w-20 shrink-0 self-center overflow-hidden rounded-xl m-3 bg-gradient-to-br from-green-50 to-emerald-50 sm:w-24">
        {imageFailed ? (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBasket className="h-7 w-7 text-green-200" />
          </div>
        ) : (
          <Image
            src={marketPrice.image}
            alt={translateProductTitle(marketPrice.title)}
            fill
            sizes="6rem"
            unoptimized
            onError={() => setImageFailed(true)}
            className="object-cover"
          />
        )}
      </div>

      {/* তথ্য */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 py-4 pr-5">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
              {translateProductTitle(marketPrice.title)}
            </h3>
            <span className="shrink-0 rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
              {translateCategory(marketPrice.category)}
            </span>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              {label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4 text-green-600" />
              পরিমাণ:{" "}
              <span className="font-medium text-gray-700">
                {formatQuantity(marketPrice.quantity, marketPrice.unit)}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-green-600" />
              অবস্থান:{" "}
              <span className="font-medium text-gray-700">
                {translateLocation(marketPrice.location)}
              </span>
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <CalendarDays className="h-4 w-4 text-green-600" />
              হালনাগাদ: {formatDate(marketPrice.date)}
            </span>
          </div>
        </div>

        {/* দাম */}
        <div className="flex shrink-0 flex-col items-end gap-0.5 border-l border-green-200 pl-4">
          <p className="text-2xl font-extrabold leading-none text-green-700 sm:text-3xl">
            {formatPrice(marketPrice.price)}
          </p>
          {marketPrice.previousPrice !== null &&
            marketPrice.previousPrice !== undefined && (
              <p className="text-sm font-medium text-gray-400 line-through">
                {formatPrice(marketPrice.previousPrice)}
              </p>
            )}
        </div>
      </div>
    </motion.article>
  );
}
