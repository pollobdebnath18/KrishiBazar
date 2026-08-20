"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, TrendingDown, TrendingUp, WifiOff } from "lucide-react";
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
import EmptyState from "./EmptyState";

type ViewState = "loading" | "error" | "ready";

export default function MarketPricesPanel() {
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await getMarketPrices({});
        if (cancelled) return;
        setMarketPrices(response.data);
        setViewState("ready");
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(
          err instanceof Error ? err.message : "সার্ভার থেকে বাজারদর পাওয়া যায়নি"
        );
        setViewState("error");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  const handleRetry = useCallback(() => {
    setViewState("loading");
    setErrorMessage(undefined);
    setReloadCount((count) => count + 1);
  }, []);

  if (viewState === "loading") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="h-16 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (viewState === "error") {
    return (
      <EmptyState
        icon={<WifiOff className="h-7 w-7" />}
        title="বাজারদর লোড করা যায়নি"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <RefreshCw className="h-4 w-4" />
            আবার চেষ্টা করুন
          </button>
        }
      />
    );
  }

  if (marketPrices.length === 0) {
    return (
      <EmptyState
        title="এখনো কোনো বাজারদর যোগ হয়নি"
        description="বর্তমানে দৈনিক বাজার দরের কোনো তথ্য পাওয়া যায়নি।"
      />
    );
  }

  return (
    <div className="space-y-2.5">
      <AnimatePresence initial={false}>
        {marketPrices.slice(0, 20).map((item, index) => {
          const status = resolvePriceStatus(item);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 transition-colors hover:border-green-200 hover:bg-white"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <p className="truncate text-sm font-bold text-gray-900">
                  {translateProductTitle(item.title)}
                </p>
                <span className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                  {translateCategory(item.category)}
                </span>
                <span className="text-xs text-gray-500">
                  {translateLocation(item.location)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-gray-500">
                  {formatQuantity(item.quantity, item.unit)}
                </span>
                <span className="text-base font-extrabold text-green-700">
                  {formatPrice(item.price)}
                </span>
                {status === "increased" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                    <TrendingUp className="h-3 w-3" />
                    বেড়েছে
                  </span>
                )}
                {status === "decreased" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                    <TrendingDown className="h-3 w-3" />
                    কমেছে
                  </span>
                )}
                <span className="hidden text-xs text-gray-400 md:inline">
                  {formatDate(item.date)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}