"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ShoppingBasket, Search, X } from "lucide-react";
import { getProducts } from "@/lib/api/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

type ViewState = "loading" | "error" | "ready";

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
      try {
        const response = await getProducts({ search, category, location });
        if (cancelled) return;
        setProducts(response.data);
        setViewState("ready");
        setErrorMessage(undefined);
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(
          err instanceof Error ? err.message : "সার্ভার থেকে পণ্য পাওয়া যায়নি"
        );
        setViewState("error");
      }
    };

    load();
    return () => { cancelled = true; };
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
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const locations = useMemo(
    () => Array.from(new Set(products.map((p) => p.location))).sort(),
    [products]
  );

  const isFiltering = search !== "" || category !== "all" || location !== "all";

  return (
    <section className="min-h-screen bg-[#f5f8f2] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-center gap-3 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <ShoppingBasket className="h-4 w-4" />
            কৃষিপণ্য কিনুন
          </span>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            পণ্যসমূহ
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gray-600">
            সরাসরি কৃষকদের কাছ থেকে তাজা কৃষিপণ্য কিনুন — মাঝারি দামে, মানসম্মত।
          </p>
        </motion.div>

        {viewState === "loading" && (
          <div className="flex flex-col items-center gap-6 py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
            <p className="text-sm font-medium text-green-700">
              পণ্য লোড হচ্ছে...
            </p>
          </div>
        )}

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
            {/* Filters */}
            {(products.length > 0 || isFiltering) && (
              <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                >
                  <option value="all">সব ক্যাটাগরি</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                >
                  <option value="all">সব এলাকা</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                {isFiltering && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="whitespace-nowrap rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    মুছুন
                  </button>
                )}
              </div>
            )}

            {/* Product grid */}
            {products.length === 0 ? (
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
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
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

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = product.image && !imageFailed;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
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
          <h3 className="text-base font-bold text-gray-900">
            {product.title}
          </h3>
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
