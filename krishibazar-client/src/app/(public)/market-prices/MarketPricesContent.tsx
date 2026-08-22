"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sprout } from "lucide-react";
import MarketPriceCard from "@/components/market-prices/MarketPriceCard";
import MarketPriceSkeleton from "@/components/market-prices/MarketPriceSkeleton";
import MarketPriceFilters, {
  type StatusFilter,
} from "@/components/market-prices/MarketPriceFilters";
import {
  EmptyState,
  ErrorState,
  NoResults,
} from "@/components/market-prices/MarketPriceStates";
import { getMarketPrices } from "@/lib/api/marketPrice";
import type { MarketPrice } from "@/types/marketPrice";

type ViewState = "loading" | "error" | "ready";

export interface MarketPricesFilters {
  search?: string;
  category?: string;
  location?: string;
  status?: string;
}

interface MarketPricesContentProps {
  initialFilters: MarketPricesFilters;
}

function parseStatus(value: string | undefined): StatusFilter {
  return value === "increased" || value === "decreased" || value === "stable"
    ? value
    : "all";
}

export default function MarketPricesContent({
  initialFilters,
}: MarketPricesContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [reloadCount, setReloadCount] = useState(0);

  const [searchInput, setSearchInput] = useState(initialFilters.search ?? "");
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [category, setCategory] = useState(initialFilters.category ?? "all");
  const [location, setLocation] = useState(initialFilters.location ?? "all");
  const [status, setStatus] = useState<StatusFilter>(
    parseStatus(initialFilters.status)
  );

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (location !== "all") params.set("location", location);
    if (status !== "all") params.set("status", status);
    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (window.location.pathname + window.location.search !== nextUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [search, category, location, status, pathname, router]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await getMarketPrices({ search, category, location, status });
        if (cancelled) return;
        setMarketPrices(response.data);
        setViewState("ready");
        setErrorMessage(undefined);
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
  }, [search, category, location, status, reloadCount]);

  const handleRetry = useCallback(() => {
    setViewState("loading");
    setErrorMessage(undefined);
    setReloadCount((count) => count + 1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setCategory("all");
    setLocation("all");
    setStatus("all");
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(marketPrices.map((item) => item.category))).sort(),
    [marketPrices]
  );

  const locations = useMemo(
    () => Array.from(new Set(marketPrices.map((item) => item.location))).sort(),
    [marketPrices]
  );

  const isFiltering =
    search !== "" || category !== "all" || location !== "all" || status !== "all";

  return (
    <section className="min-h-screen bg-[#f5f8f2] py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-center gap-3 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <Sprout className="h-4 w-4" />
            হালনাগাদ বাজার তথ্য
          </span>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            দৈনিক বাজার দর
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gray-600">
            সারাদেশের বিভিন্ন বাজার থেকে সংগৃহীত কৃষিপণ্যের সর্বশেষ দর —
            প্রতিদিন হালনাগাদ করা হয়।
          </p>
        </motion.div>

        {viewState === "loading" && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-sm font-medium text-green-700">
              দৈনিক বাজার দর লোড হচ্ছে...
            </p>
            <MarketPriceSkeleton />
          </div>
        )}

        {viewState === "error" && (
          <ErrorState message={errorMessage} onRetry={handleRetry} />
        )}

        {viewState === "ready" && (
          <>
            {(marketPrices.length > 0 || isFiltering) && (
              <MarketPriceFilters
                search={searchInput}
                onSearchChange={setSearchInput}
                categories={categories}
                category={category}
                onCategoryChange={setCategory}
                locations={locations}
                location={location}
                onLocationChange={setLocation}
                status={status}
                onStatusChange={setStatus}
              />
            )}

            {marketPrices.length === 0 ? (
              isFiltering ? (
                <NoResults onClear={clearFilters} />
              ) : (
                <EmptyState onRetry={handleRetry} />
              )
            ) : (
              <div className="flex flex-col gap-6">
                <AnimatePresence mode="popLayout" initial={false}>
                  {marketPrices.map((marketPrice, index) => (
                    <MarketPriceCard
                      key={marketPrice.id}
                      marketPrice={marketPrice}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}