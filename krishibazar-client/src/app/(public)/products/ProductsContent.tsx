"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  MapPin,
  Search,
  ShoppingBasket,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getProducts } from "@/lib/api/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

type ViewState = "loading" | "error" | "ready";
type SortOption = "newest" | "price-low" | "price-high";

const categoryOptions = [
  { value: "all", label: "সব পণ্য" },
  { value: "vegetables", label: "শাকসবজি" },
  { value: "fruits", label: "ফলমূল" },
  { value: "grains", label: "ধান ও চাল" },
  { value: "fish", label: "মাছ" },
  { value: "meat", label: "মাংস" },
  { value: "dairy", label: "দুধ ও দুগ্ধজাত পণ্য" },
  { value: "eggs", label: "ডিম" },
  { value: "other", label: "অন্যান্য" },
] as const;

export interface ProductsFilters {
  search?: string;
  category?: string;
  location?: string;
}

interface ProductsContentProps {
  initialFilters: ProductsFilters;
}

export default function ProductsContent({
  initialFilters,
}: ProductsContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [reloadCount, setReloadCount] = useState(0);

  const [searchInput, setSearchInput] = useState(initialFilters.search ?? "");
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [category, setCategory] = useState(initialFilters.category ?? "all");
  const [location, setLocation] = useState(initialFilters.location ?? "all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (location !== "all") params.set("location", location);
    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (window.location.pathname + window.location.search !== nextUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [search, category, location, pathname, router]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setViewState("loading");
      try {
        const response = await getProducts({ search, category, location });
        if (cancelled) return;
        setProducts(response.data);
        setViewState("ready");
        setErrorMessage(undefined);
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "সার্ভার থেকে পণ্য পাওয়া যায়নি",
        );
        setViewState("error");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [search, category, location, reloadCount]);

  const handleRetry = useCallback(() => {
    setViewState("loading");
    setErrorMessage(undefined);
    setReloadCount((c) => c + 1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setCategory("all");
    setLocation("all");
    setSort("newest");
    setMobileFiltersOpen(false);
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(products.map((p) => p.location))).sort(),
    [products],
  );

  const isFiltering =
    search !== "" ||
    category !== "all" ||
    location !== "all" ||
    sort !== "newest";

  const sortedProducts = useMemo(() => {
    return [...products].sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      return (
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      );
    });
  }, [products, sort]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setMobileFiltersOpen(false);
  };

  const filterPanel = (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">পণ্যের ক্যাটাগরি</h2>
        <span className="text-xs text-gray-400">{products.length} পণ্য</span>
      </div>
      <div className="space-y-1">
        {categoryOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleCategoryChange(option.value)}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
              category === option.value
                ? "bg-green-600 font-semibold text-white"
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {option.label}
            {category === option.value && <span>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#f5f8f2] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {viewState === "loading" && <ProductsPageSkeleton />}

        {viewState === "error" && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
            <p className="text-sm font-medium text-red-600">{errorMessage}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {viewState === "ready" && (
          <>
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <p className="text-sm font-medium text-gray-600">
                {sortedProducts.length}টি পণ্য পাওয়া গেছে
              </p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 shadow-sm"
                aria-expanded={mobileFiltersOpen}
              >
                <SlidersHorizontal className="h-4 w-4" />
                ফিল্টার
              </button>
            </div>

            {mobileFiltersOpen && (
              <div className="mb-5 lg:hidden">{filterPanel}</div>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(190px,25%)_1fr]">
              <aside className="sticky top-24 hidden self-start lg:block">
                {filterPanel}
              </aside>

              <div className="min-w-0">
                {(products.length > 0 || isFiltering) && (
                  <div className="mb-8 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_minmax(150px,0.35fr)_minmax(130px,0.3fr)_auto] sm:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="পণ্য খুঁজুন..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100"
                      />
                      {searchInput && (
                        <button
                          type="button"
                          onClick={() => setSearchInput("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    >
                      <option value="all">সব এলাকা</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>

                    <div className="relative">
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 pr-9 text-sm text-gray-700 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                        aria-label="পণ্য সাজান"
                      >
                        <option value="newest">নতুন</option>
                        <option value="price-low">কম দাম</option>
                        <option value="price-high">বেশি দাম</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    {isFiltering && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="whitespace-nowrap rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        ফিল্টার পরিষ্কার
                      </button>
                    )}
                  </div>
                )}

                <div className="mb-4 hidden items-center justify-between sm:flex">
                  <p className="text-sm font-medium text-gray-500">
                    {sortedProducts.length}টি পণ্য পাওয়া গেছে
                  </p>
                </div>

                {/* Product grid */}
                {sortedProducts.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white py-16 text-center">
                    <ShoppingBasket className="h-12 w-12 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">
                      {isFiltering
                        ? "কোনো পণ্য পাওয়া যায়নি — ফিল্টার পরিবর্তন করে দেখুন"
                        : "এখনো কোনো পণ্য যোগ করা হয়নি"}
                    </p>
                    {isFiltering && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                      >
                        সব ফিল্টার মুছুন
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {sortedProducts.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = product.image && !imageFailed;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <Link
        href={`/products/${product.id}`}
        aria-label={`${product.title} এর বিস্তারিত দেখুন`}
        className="absolute inset-0 z-10"
      />
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-linear-to-br from-green-50 to-emerald-50">
        {showImage ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, 25vw"
            unoptimized
            onError={() => setImageFailed(true)}
            className="object-cover"
          />
        ) : (
          <ShoppingBasket className="h-12 w-12 text-green-200 transition-transform group-hover:scale-110" />
        )}
        {product.quantity === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            স্টক শেষ
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-gray-900">{product.title}</h3>
          <span className="shrink-0 rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
            {product.category}
          </span>
        </div>

        <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-green-600" />
          {product.location}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-extrabold text-green-700">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-gray-500">
              প্রতি {product.unit} ·{" "}
              {product.quantity > 0
                ? `${product.quantity} ${product.unit} আছে`
                : "স্টকে নেই"}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProductsPageSkeleton() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(190px,25%)_1fr]">
      <aside className="hidden self-start lg:block">
        <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 h-5 w-32 rounded bg-gray-200" />
          <div className="space-y-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-10 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-8 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_minmax(150px,0.45fr)_minmax(130px,0.35fr)_auto]">
          <div className="h-11 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-11 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-11 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-11 animate-pulse rounded-xl bg-gray-100" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="h-40 animate-pulse bg-green-100" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-7 w-2/5 animate-pulse rounded bg-green-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
