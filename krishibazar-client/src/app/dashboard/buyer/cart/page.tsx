"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import { cartLines as initialCart, type CartLine } from "@/lib/dashboard/data";
import { formatPrice } from "@/lib/format";

export default function BuyerCartPage() {
  const [cart, setCart] = useState<CartLine[]>(initialCart);

  const changeQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((line) => {
        if (line.id !== id) return line;
        const next = Math.max(1, Math.min(line.quantity + delta, 999));
        return { ...line, quantity: next };
      })
    );
  };

  const removeLine = (id: string) => {
    setCart((prev) => prev.filter((line) => line.id !== id));
    toast.info("আইটেম কার্ট থেকে সরানো হয়েছে");
  };

  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const deliveryFee = subtotal > 0 ? 60 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.info("আপনার কার্ট খালি");
      return;
    }
    toast.success("অর্ডার প্লেস করার পদ্ধতি শীঘ্রই আসছে");
  };

  return (
    <>
      <PageHeader
        title="কার্ট"
        subtitle="আপনার নির্বাচিত পণ্যসমূহ"
        action={
          <span className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            <ShoppingCart className="h-4 w-4" />
            {itemCount}টি আইটেম
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart lines */}
        <SectionCard
          title="পণ্যের তালিকা"
          subtitle="পরিমাণ পরিবর্তন করুন বা সরান"
          className="lg:col-span-2"
        >
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingCart className="mx-auto h-10 w-10 text-green-300" />
              <p className="mt-3 text-lg font-bold text-gray-900">
                আপনার কার্ট খালি
              </p>
              <p className="mt-1 text-sm text-gray-500">
                পণ্য ব্রাউজ করে কার্টে যোগ করুন
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-4 transition-colors hover:border-green-200 hover:bg-white"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 text-green-500">
                    <ShoppingCart className="h-6 w-6" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {line.title}
                    </p>
                    <p className="text-sm font-extrabold text-green-700">
                      {formatPrice(line.price)}
                      <span className="text-xs font-medium text-gray-400">
                        {" "}
                        / {line.unit}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => changeQuantity(line.id, -1)}
                      aria-label="পরিমাণ কমান"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition hover:bg-green-50 hover:text-green-700"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-gray-900">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(line.id, 1)}
                      aria-label="পরিমাণ বাড়ান"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition hover:bg-green-50 hover:text-green-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="w-20 shrink-0 text-right text-sm font-extrabold text-gray-900">
                    {formatPrice(line.price * line.quantity)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    aria-label="সরান"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Summary */}
        <SectionCard
          title="অর্ডার সারাংশ"
          subtitle="পেমেন্ট চেকআউটে সম্পন্ন হবে"
          delay={0.1}
        >
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">সাবটোটাল</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">ডেলিভারি ফি</span>
              <span className="font-semibold text-gray-900">
                {deliveryFee === 0 ? "—" : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="font-bold text-gray-900">সর্বমোট</span>
              <span className="text-xl font-extrabold text-green-700">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition hover:from-green-700 hover:to-green-800"
            >
              চেকআউট
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </SectionCard>
      </div>
    </>
  );
}