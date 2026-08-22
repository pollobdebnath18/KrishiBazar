"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Loader2,
  MapPin,
  Pencil,
  RefreshCw,
  Trash2,
  TrendingDown,
  TrendingUp,
  WifiOff,
} from "lucide-react";
import {
  deleteMarketPrice,
  getMarketPrices,
  updateMarketPrice,
} from "@/lib/api/marketPrice";
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
import ConfirmDialog from "./ConfirmDialog";

type ViewState = "loading" | "error" | "ready";

const units = [
  { value: "KG", label: "কেজি" },
  { value: "GRAM", label: "গ্রাম" },
  { value: "LITER", label: "লিটার" },
  { value: "PIECE", label: "পিস" },
  { value: "DOZEN", label: "ডজন" },
  { value: "SACK", label: "বস্তা" },
];

const statusOptions = [
  { value: "increased", label: "দাম বেড়েছে" },
  { value: "decreased", label: "দাম কমেছে" },
  { value: "stable", label: "অপরিবর্তিত" },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function AdminMarketPricesPanel() {
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [reloadCount, setReloadCount] = useState(0);

  const [updateItem, setUpdateItem] = useState<MarketPrice | null>(null);
  const [updateForm, setUpdateForm] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    category: "",
    price: "",
    previousPrice: "",
    priceStatus: "stable",
    quantity: "",
    unit: "KG",
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  const [deleteItem, setDeleteItem] = useState<MarketPrice | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleRefresh = useCallback(() => {
    setViewState("loading");
    setErrorMessage(undefined);
    setReloadCount((count) => count + 1);
  }, []);

  const openUpdate = (item: MarketPrice) => {
    setUpdateItem(item);
    setUpdateForm({
      title: item.title,
      description: item.description || "",
      image: item.image,
      location: item.location,
      category: item.category,
      price: String(item.price),
      previousPrice: item.previousPrice ? String(item.previousPrice) : "",
      priceStatus: item.priceStatus,
      quantity: String(item.quantity),
      unit: item.unit,
    });
  };

  const closeUpdate = () => setUpdateItem(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateItem) return;

    if (
      !updateForm.title.trim() ||
      !updateForm.image.trim() ||
      !updateForm.location.trim() ||
      !updateForm.category.trim() ||
      !updateForm.price ||
      !updateForm.quantity
    ) {
      toast.error("দয়া করে সব আবশ্যক ক্ষেত্র পূরণ করুন");
      return;
    }

    setUpdateLoading(true);
    try {
      await updateMarketPrice(updateItem.id, {
        title: updateForm.title.trim(),
        description: updateForm.description.trim() || undefined,
        image: updateForm.image.trim(),
        location: updateForm.location.trim(),
        category: updateForm.category.trim(),
        price: Number(updateForm.price),
        previousPrice: updateForm.previousPrice
          ? Number(updateForm.previousPrice)
          : null,
        priceStatus: updateForm.priceStatus,
        quantity: Number(updateForm.quantity),
        unit: updateForm.unit,
      });
      toast.success("বাজারদর সফলভাবে আপডেট হয়েছে");
      closeUpdate();
      handleRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "আপডেট করা যায়নি"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    setDeleteLoading(true);
    try {
      await deleteMarketPrice(deleteItem.id);
      toast.success("বাজারদর সফলভাবে মুছে ফেলা হয়েছে");
      setDeleteItem(null);
      handleRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "মুছে ফেলা যায়নি"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateField = (key: keyof typeof updateForm, value: string) =>
    setUpdateForm((prev) => ({ ...prev, [key]: value }));

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
    <>
      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {marketPrices.slice(0, 20).map((item, index) => {
            const status = resolvePriceStatus(item);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index * 0.04, 0.4),
                }}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 transition-colors hover:border-green-200 hover:bg-white"
              >
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                    {index + 1}
                  </span>
                  <p className="truncate text-sm font-bold text-gray-900">
                    {translateProductTitle(item.title)}
                  </p>
                  <span className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                    {translateCategory(item.category)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
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
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openUpdate(item)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                      title="আপডেট করুন"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteItem(item)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        title="বাজারদর মুছে ফেলবেন?"
        description={`"${deleteItem ? translateProductTitle(deleteItem.title) : ""}" মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`}
        confirmLabel={
          deleteLoading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"
        }
        cancelLabel="বাতিল"
        confirmTone="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />

      {/* Update Modal */}
      <AnimatePresence>
        {updateItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeUpdate}
              aria-hidden="true"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="বাজারদর আপডেট করুন"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
            >
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                বাজারদর আপডেট করুন
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <Field label="পণ্যের নাম *">
                  <input
                    type="text"
                    value={updateForm.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="ছবির লিংক *">
                  <input
                    type="text"
                    value={updateForm.image}
                    onChange={(e) => updateField("image", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="অবস্থান *">
                    <input
                      type="text"
                      value={updateForm.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="ক্যাটাগরি *">
                    <input
                      type="text"
                      value={updateForm.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="দর (৳) *">
                    <input
                      type="number"
                      min={0}
                      value={updateForm.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="আগের দর (৳)">
                    <input
                      type="number"
                      min={0}
                      value={updateForm.previousPrice}
                      onChange={(e) =>
                        updateField("previousPrice", e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="দরের অবস্থা">
                    <select
                      value={updateForm.priceStatus}
                      onChange={(e) =>
                        updateField("priceStatus", e.target.value)
                      }
                      className={inputClass}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="পরিমাণ *">
                    <input
                      type="number"
                      min={1}
                      value={updateForm.quantity}
                      onChange={(e) => updateField("quantity", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="ইউনিট">
                    <select
                      value={updateForm.unit}
                      onChange={(e) => updateField("unit", e.target.value)}
                      className={inputClass}
                    >
                      {units.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="বিবরণ">
                  <textarea
                    value={updateForm.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeUpdate}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-600/25 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {updateLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        আপডেট হচ্ছে...
                      </>
                    ) : (
                      "আপডেট করুন"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
