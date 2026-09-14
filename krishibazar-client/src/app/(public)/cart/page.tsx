"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/dashboard/data";
import { readCart, writeCart } from "@/lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartLine[]>([]);

  const readCartForPage = () => {
    setCart(readCart());
  };

  useEffect(() => {
    readCartForPage();

    const onCartChange = () => readCartForPage();
    window.addEventListener("cart:updated", onCartChange);
    window.addEventListener("storage", onCartChange);

    return () => {
      window.removeEventListener("cart:updated", onCartChange);
      window.removeEventListener("storage", onCartChange);
    };
  }, []);

  const persistCart = (next: CartLine[]) => {
    setCart(next);
    writeCart(next);
  };

  const changeQuantity = (id: string, delta: number) => {
    const next = cart
      .map((line) => {
        if (line.id !== id) return line;
        const updated = Math.max(1, Math.min(line.quantity + delta, 999));
        return { ...line, quantity: updated };
      })
      .filter((line) => line.quantity > 0);

    persistCart(next);
  };

  const removeLine = (id: string) => {
    const next = cart.filter((line) => line.id !== id);
    persistCart(next);
    toast.info("আইটেম কার্ট থেকে সরানো হয়েছে");
  };

  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const deliveryFee = subtotal > 0 ? 60 : 0;
  const total = subtotal + deliveryFee;

  const checkout = () => {
    if (cart.length === 0) {
      toast.info("আপনার কার্ট খালি");
      return;
    }

    window.location.href = "/checkout";
  };

  return (
    <main className="min-h-screen bg-[#f5f8f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-green-700">
              কৃষিবাজার কার্ট
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
              আপনার কার্ট
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 font-bold text-green-700">
            <ShoppingCart className="h-4 w-4" />
            {itemCount}টি আইটেম
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            {cart.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center gap-4 py-12 text-center">
                <ShoppingCart className="h-14 w-14 text-green-200" />
                <div>
                  <p className="text-lg font-extrabold text-gray-900">
                    আপনার কার্ট খালি
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    পণ্য ব্রাউজ করে কার্টে যোগ করুন
                  </p>
                </div>
                <Link
                  href="/products"
                  className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700"
                >
                  পণ্য দেখুন
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((line) => (
                  <div
                    key={line.id}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 text-green-600">
                      <ShoppingCart className="h-6 w-6" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {line.title}
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-green-700">
                        {formatPrice(line.price)}
                        <span className="ml-1 text-xs font-medium text-gray-400">
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
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                অর্ডার সারাংশ
              </p>
              <p className="mt-1 text-xs text-gray-400">
                পেমেন্ট চেকআউটে সম্পন্ন হবে
              </p>
            </div>

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
                onClick={checkout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700"
              >
                চেকআউট
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}