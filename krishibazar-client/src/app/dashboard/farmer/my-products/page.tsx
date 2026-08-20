"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  Eye,
  MapPin,
  Package,
  PackageCheck,
  PackageX,
  Pencil,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import { ProductStatusBadge } from "@/components/dashboard/StatusBadge";
import {
  farmerProducts,
  type DashboardProduct,
  type ProductStatus,
} from "@/lib/dashboard/data";
import { formatPrice } from "@/lib/format";

export default function FarmerMyProductsPage() {
  const [products, setProducts] = useState<DashboardProduct[]>(farmerProducts);

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

  const restock = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 50, status: "ACTIVE" }
          : item
      )
    );
    toast.success("৫০ ইউনিট স্টক যোগ হয়েছে");
  };

  return (
    <>
      <PageHeader
        title="আমার পণ্য"
        subtitle="আপনার প্রকাশিত পণ্যগুলো পরিচালনা করুন"
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 transition-colors hover:border-green-200 hover:bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-gray-900">
                    {product.title}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-green-600" />
                    {product.location}
                  </p>
                </div>
                <ProductStatusBadge status={product.status} />
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xl font-extrabold text-green-700">
                    {formatPrice(product.price)}
                    <span className="text-xs font-medium text-gray-400">
                      {" "}
                      / {product.unit}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    স্টক: {product.quantity} {product.unit}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toast.info(`${product.title} দেখছেন`)}
                    aria-label="পণ্য দেখুন"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition hover:bg-green-50 hover:text-green-700"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.info("সম্পাদনা শীঘ্রই আসছে")}
                    aria-label="সম্পাদনা"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition hover:bg-green-50 hover:text-green-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                {product.status === "OUT_OF_STOCK" ? (
                  <button
                    type="button"
                    onClick={() => restock(product.id)}
                    className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                  >
                    স্টক যোগ করুন
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleStatus(product.id)}
                    className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
                  >
                    {product.status === "INACTIVE" ? "প্রকাশ করুন" : "নিষ্ক্রিয় করুন"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => restock(product.id)}
                  className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
                >
                  + স্টক
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}