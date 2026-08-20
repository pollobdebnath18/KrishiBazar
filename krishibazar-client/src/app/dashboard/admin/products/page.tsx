"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { MapPin, Package, PackageCheck, PackageX } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import { ProductStatusBadge } from "@/components/dashboard/StatusBadge";
import {
  adminDashboardProducts,
  type DashboardProduct,
  type ProductStatus,
} from "@/lib/dashboard/data";
import { formatPrice } from "@/lib/format";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DashboardProduct[]>(
    adminDashboardProducts
  );

  const activeCount = products.filter((item) => item.status === "ACTIVE").length;
  const outOfStockCount = products.filter(
    (item) => item.status === "OUT_OF_STOCK"
  ).length;

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next: ProductStatus =
          item.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
        toast.success(
          next === "ACTIVE"
            ? `${item.title} প্রকাশিত হয়েছে`
            : `${item.title} নিষ্ক্রিয় করা হয়েছে`
        );
        return { ...item, status: next };
      })
    );
  };

  return (
    <>
      <PageHeader
        title="পণ্যসমূহ"
        subtitle="প্ল্যাটফর্মের সব পণ্যের তালিকা ও অবস্থা পরিচালনা করুন"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="মোট পণ্য"
          value={products.length}
          icon={Package}
          tone="emerald"
          delay={0}
        />
        <StatCard
          label="প্রকাশিত"
          value={activeCount}
          icon={PackageCheck}
          tone="green"
          delay={0.05}
        />
        <StatCard
          label="স্টক শেষ"
          value={outOfStockCount}
          icon={PackageX}
          tone="amber"
          delay={0.1}
        />
      </div>

      <SectionCard>
        <div className="-mx-5 sm:-mx-6">
          <div className="hidden grid-cols-[1.4fr_0.9fr_0.9fr_0.8fr_0.8fr_0.8fr_auto] gap-4 border-b border-gray-200 px-6 pb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 lg:grid">
            <span>পণ্য</span>
            <span>ক্যাটাগরি</span>
            <span>দর</span>
            <span>স্টক</span>
            <span>বিক্রয়</span>
            <span>স্ট্যাটাস</span>
            <span />
          </div>

          <div className="divide-y divide-gray-100">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-1 gap-3 px-5 py-4 sm:px-6 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.8fr_0.8fr_0.8fr_auto] lg:items-center lg:gap-4"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {product.title}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3 text-green-600" />
                    {product.location}
                  </p>
                </div>

                <span className="w-fit rounded-md bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-600">
                  {product.category}
                </span>

                <p className="text-sm font-extrabold text-green-700">
                  {formatPrice(product.price)}
                  <span className="ml-1 text-xs font-medium text-gray-400">
                    / {product.unit}
                  </span>
                </p>

                <p className="text-sm font-medium text-gray-700">
                  {product.quantity} {product.unit}
                </p>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {product.sold} {product.unit}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatPrice(product.revenue)}
                  </p>
                </div>

                <div>
                  <ProductStatusBadge status={product.status} />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => toggleStatus(product.id)}
                    className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                  >
                    {product.status === "INACTIVE" ? "প্রকাশ করুন" : "নিষ্ক্রিয় করুন"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </>
  );
}