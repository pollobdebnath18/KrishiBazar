"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Image as ImageIcon,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  PackageX,
  PlusCircle,
  Tag,
  X,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { ProductStatusBadge } from "@/components/dashboard/StatusBadge";
import { translateProductTitle } from "@/lib/bangla";
import {
  createProduct,
  deleteProduct,
  getProducts,
} from "@/lib/api/products";
import type { DashboardProduct } from "@/lib/dashboard/data";
import { formatPrice } from "@/lib/format";
import type { Product as ServerProduct } from "@/types/product";

const units = [
  { value: "KG", label: "কেজি" },
  { value: "GRAM", label: "গ্রাম" },
  { value: "LITER", label: "লিটার" },
  { value: "PIECE", label: "পিস" },
  { value: "DOZEN", label: "ডজন" },
  { value: "SACK", label: "বস্তা" },
];

const emptyForm = {
  title: "",
  description: "",
  price: "",
  quantity: "",
  unit: "KG",
  image: "",
  location: "",
  category: "",
};

const mapServerProductToDashboardProduct = (
  product: ServerProduct,
): DashboardProduct => ({
  id: product.id,
  title: product.title,
  category: product.category,
  location: product.location,
  price: product.price,
  unit: product.unit,
  quantity: product.quantity,
  image: product.image,
  featured: product.featured,
  status: product.quantity > 0 ? "ACTIVE" : "OUT_OF_STOCK",
  sold: 0,
  revenue: 0,
});

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<DashboardProduct | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const response = await getProducts();
        if (!mounted) return;

        const mappedProducts = response.data.map(mapServerProductToDashboardProduct);
        setProducts(mappedProducts);
      } catch {
        toast.error("পণ্যের তালিকা লোড করতে সমস্যা হয়েছে");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const activeCount = products.filter((item) => item.status === "ACTIVE").length;
  const outOfStockCount = products.filter(
    (item) => item.status === "OUT_OF_STOCK",
  ).length;

  const refreshProducts = async () => {
    try {
      const response = await getProducts();
      const mappedProducts = response.data.map(mapServerProductToDashboardProduct);
      setProducts(mappedProducts);
    } catch {
      toast.error("পণ্যের তালিকা রিফ্রেশ করতে সমস্যা হয়েছে");
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleteLoading(true);

    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((item) => item.id !== productToDelete.id));
      toast.success(`${productToDelete.title} মুছে ফেলা হয়েছে`);
      setProductToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "পণ্যটি মুছে ফেলা যায়নি");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.price ||
      !form.quantity ||
      !form.image.trim() ||
      !form.location.trim() ||
      !form.category.trim()
    ) {
      toast.error("দয়া করে সব আবশ্যক ক্ষেত্র পূরণ করুন");
      return;
    }

    setCreateLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || "তাজা কৃষিপণ্য",
        price: Number(form.price),
        quantity: Number(form.quantity),
        unit: form.unit,
        image: form.image.trim(),
        location: form.location.trim(),
        category: form.category.trim(),
      };

      const response = await createProduct(payload);
      toast.success("পণ্যটি সফলভাবে যোগ হয়েছে");
      setForm(emptyForm);
      setShowCreateModal(false);
      await refreshProducts();

      if (response.data?.id) {
        setProducts((prev) => {
          const newProduct = mapServerProductToDashboardProduct(response.data);
          return [newProduct, ...prev];
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "পণ্য যোগ করা যায়নি");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="পণ্যসমূহ"
        subtitle="প্ল্যাটফর্মের সব পণ্যের তালিকা ও অবস্থা পরিচালনা করুন"
        action={
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
          >
            <PlusCircle className="h-4 w-4" />
            পণ্য যোগ করুন
          </button>
        }
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
            {loading ? (
              <div className="px-6 py-8 text-sm font-medium text-gray-500">
                পণ্য তালিকা লোড হচ্ছে...
              </div>
            ) : products.length === 0 ? (
              <div className="px-6 py-8 text-sm font-medium text-gray-500">
                কোনো পণ্য পাওয়া যায়নি
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 sm:px-6 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.8fr_0.8fr_0.8fr_auto] lg:items-center lg:gap-4"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {translateProductTitle(product.title)}
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
                      onClick={() => setProductToDelete(product)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      নিষ্ক্রিয় করুন
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SectionCard>

      {showCreateModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-3xl rounded-3xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">পণ্য যোগ করুন</h3>
                <p className="text-sm text-gray-500">নতুন পণ্য প্রকাশ করুন</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-5 px-6 py-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">পণ্যের নাম *</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Package className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="যেমন: তাজা টমেটো"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">ছবির লিংক *</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                    />
                  </div>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">অবস্থান *</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="যেমন: গোলাপগঞ্জ, সিলেট"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">ক্যাটাগরি *</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="যেমন: সবজি"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                    />
                  </div>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">দর (৳) *</span>
                  <input
                    type="number"
                    min={1}
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="৮০"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">পরিমাণ *</span>
                  <input
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                    placeholder="৫০"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">ইউনিট</span>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                  >
                    {units.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">বিবরণ</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="পণ্য সম্পর্কে সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {createLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      প্রকাশ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      পণ্য প্রকাশ করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!productToDelete}
        title="পণ্যটি মুছে ফেলবেন?"
        description={`"${productToDelete?.title}" পণ্যটি প্ল্যাটফর্ম থেকে সম্পূর্ণভাবে মুছে যাবে।`}
        confirmLabel={deleteLoading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
        cancelLabel="বাতিল"
        confirmTone="danger"
        onConfirm={handleDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </>
  );
}