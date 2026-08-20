"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import ProductCard from "@/components/dashboard/ProductCard";
import { buyerProducts } from "@/lib/dashboard/data";

export default function BuyerBrowseProductsPage() {
  const [query, setQuery] = useState("");

  const filtered = buyerProducts.filter((product) =>
    `${product.title} ${product.category} ${product.location}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  const inStock = buyerProducts.filter(
    (product) => product.quantity > 0
  ).length;

  return (
    <>
      <PageHeader
        title="পণ্য ব্রাউজ করুন"
        subtitle="কৃষকদের থেকে সরাসরি তাজা কৃষিপণ্য খুঁজুন"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="মোট পণ্য"
          value={buyerProducts.length}
          icon={Package}
          tone="emerald"
          delay={0}
        />
        <StatCard
          label="স্টকে আছে"
          value={inStock}
          icon={Package}
          tone="green"
          delay={0.05}
        />
      </div>

      <SectionCard
        title="সব পণ্য"
        subtitle="দর ও অবস্থান দেখে বেছে নিন"
        action={
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..."
              className="w-48 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/15 sm:w-64"
            />
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg font-bold text-gray-900">
              কোনো পণ্য পাওয়া যায়নি
            </p>
            <p className="mt-1 text-sm text-gray-500">
              অন্য কোনো নামে খুঁজে দেখুন
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </SectionCard>
    </>
  );
}