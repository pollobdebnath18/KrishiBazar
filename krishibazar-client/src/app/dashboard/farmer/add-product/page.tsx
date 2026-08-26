"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  Image as ImageIcon,
  Loader2,
  MapPin,
  Package,
  PlusCircle,
  Tag,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import { createProduct } from "@/lib/api/products";
import { useAuth } from "@/context/AuthContext";

const units = [
  { value: "KG", label: "কেজি" },
  { value: "GRAM", label: "গ্রাম" },
  { value: "LITER", label: "লিটার" },
  { value: "PIECE", label: "পিস" },
  { value: "DOZEN", label: "ডজন" },
  { value: "SACK", label: "বস্তা" },
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
  price: "",
  quantity: "",
  unit: "KG",
  image: "",
  location: "",
  category: "",
};

export default function FarmerAddProductPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
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

    if (!user?.id) {
      toast.error("আপনার অ্যাকাউন্টের তথ্য পাওয়া যায়নি");
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        title: form.title.trim(),
        description: form.description.trim() || "তাজা কৃষিপণ্য",
        price: Number(form.price),
        quantity: Number(form.quantity),
        unit: form.unit,
        image: form.image.trim(),
        location: form.location.trim(),
        category: form.category.trim(),
        // farmerId: user.id,
      });
      toast.success("পণ্য সফলভাবে প্রকাশিত হয়েছে");
      setForm(emptyForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "পণ্য যোগ করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="পণ্য যোগ করুন"
        subtitle="নতুন পণ্য প্রকাশ করুন — সাথে সাথে ক্রেতাদের কাছে দৃশ্যমান হবে"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="পণ্যের বিবরণ"
          subtitle="পণ্যের তথ্য সঠিকভাবে দিন"
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
                    placeholder="যেমন: গোলাপগঞ্জ, সিলেট"
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
                  min={1}
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="৮০"
                  className={inputClass}
                />
              </Field>

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
                  প্রকাশ হচ্ছে...
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  পণ্য প্রকাশ করুন
                </>
              )}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="যা মনে রাখবেন"
          subtitle="প্রকাশের আগে নিশ্চিত হন"
          delay={0.1}
        >
          <ul className="space-y-3 text-sm leading-6 text-gray-600">
            <li className="flex gap-2">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              পণ্য প্রকাশের সাথে সাথে ক্রেতাদের কাছে দেখা যাবে
            </li>
            <li className="flex gap-2">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              সঠিক দর ও পরিমাণ দিন — অর্ডারের সময় স্টক যাচাই হয়
            </li>
            <li className="flex gap-2">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              স্টক শেষ হলে পণ্যটি স্বয়ংক্রিয়ভাবে লুকিয়ে যাবে
            </li>
          </ul>
        </SectionCard>
      </div>
    </>
  );
}