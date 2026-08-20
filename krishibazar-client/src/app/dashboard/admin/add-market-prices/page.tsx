"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Package,
  PlusCircle,
  Tag,
  TrendingUp,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import { createMarketPrice } from "@/lib/api/marketPrice";

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

const emptyForm = {
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
};

export default function AdminAddMarketPricePage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.image.trim() ||
      !form.location.trim() ||
      !form.category.trim() ||
      !form.price ||
      !form.quantity
    ) {
      toast.error("দয়া করে সব আবশ্যক ক্ষেত্র পূরণ করুন");
      return;
    }

    setLoading(true);
    try {
      await createMarketPrice({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        image: form.image.trim(),
        location: form.location.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        previousPrice: form.previousPrice
          ? Number(form.previousPrice)
          : null,
        priceStatus: form.priceStatus,
        quantity: Number(form.quantity),
        unit: form.unit,
      });
      toast.success("বাজারদর সফলভাবে যোগ হয়েছে");
      setForm(emptyForm);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "বাজারদর যোগ করা যায়নি"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="বাজারদর যোগ করুন"
        subtitle="নতুন দৈনিক বাজারদর রেকর্ড তৈরি করুন"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="নতুন বাজারদর"
          subtitle="পণ্যের নাম, দর, অবস্থান ও ইউনিট দিন"
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="পণ্যের নাম *">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Package className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="যেমন: তাজা টমেটো"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            <Field label="ছবির লিংক *">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://..."
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="অবস্থান *">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="যেমন: ঢাকা"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </Field>

              <Field label="ক্যাটাগরি *">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    placeholder="যেমন: সবজি"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="দর (৳) *">
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="৮০"
                  className={inputClass}
                />
              </Field>

              <Field label="আগের দর (৳)">
                <input
                  type="number"
                  min={0}
                  value={form.previousPrice}
                  onChange={(e) => update("previousPrice", e.target.value)}
                  placeholder="৭৫"
                  className={inputClass}
                />
              </Field>

              <Field label="দরের অবস্থা">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <TrendingUp className="h-5 w-5 text-gray-400" />
                  </span>
                  <select
                    value={form.priceStatus}
                    onChange={(e) => update("priceStatus", e.target.value)}
                    className={`${inputClass} appearance-none pl-11`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="পরিমাণ *">
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => update("quantity", e.target.value)}
                  placeholder="৫০"
                  className={inputClass}
                />
              </Field>

              <Field label="ইউনিট">
                <select
                  value={form.unit}
                  onChange={(e) => update("unit", e.target.value)}
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
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                placeholder="পণ্য সম্পর্কে সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)"
                className={`${inputClass} resize-none`}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:from-green-700 hover:to-green-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  যোগ হচ্ছে...
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  বাজারদর যোগ করুন
                </>
              )}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="টিপস"
          subtitle="সঠিক তথ্য নিশ্চিত করুন"
          delay={0.1}
        >
          <ul className="space-y-3 text-sm leading-6 text-gray-600">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              পণ্যের নাম বাজারভেদে যেন একই থাকে
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              আগের দর দিলে দাম বাড়া/কমা স্বয়ংক্রিয়ভাবে দেখা যাবে
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              একই পণ্য একই দিনে একই জেলায় একবারই যোগ করুন
            </li>
          </ul>
        </SectionCard>
      </div>
    </>
  );
}