"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CreditCard, Lock, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { createCheckoutSession } from "@/lib/api/orders";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/dashboard/data";
import { readCart } from "@/lib/cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"BKASH" | "CARD">("BKASH");

  useEffect(() => {
    setCart(readCart());
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [cart],
  );
  const itemCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );
  const deliveryFee = subtotal > 0 ? 60 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!cart.length) {
      toast.info("আপনার কার্ট খালি। পণ্য যোগ করুন।");
      return;
    }

    try {
      setLoading(true);
      const response = await createCheckoutSession({
        cart,
        customer: "ক্রেতা",
        farmer: cart[0]?.title ?? "কৃষক",
        paymentMethod: selectedPayment,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/cart`,
      });

      if (!response.success || !response.data?.order?.id) {
        throw new Error(response.message ?? "Checkout failed");
      }

      const orderId = response.data.order.id;
      window.location.href = `/orders/${orderId}`;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "চেকআউট শুরু করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f2] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-green-700">
              Payment Method
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
              Checkout
            </h1>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
            <Lock className="h-4 w-4" />
            Secure
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="text-sm font-bold uppercase text-gray-500">
                  আপনার অর্ডার
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {itemCount}টি পণ্য
                </p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-extrabold text-green-700">
                {cart.length ? "READY" : "EMPTY"}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                <ShoppingCart className="h-12 w-12 text-green-200" />
                <p className="font-bold text-gray-700">কার্ট খালি</p>
                <Link
                  href="/products"
                  className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700"
                >
                  পণ্য ব্রাউজ করুন
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((line) => (
                  <div key={line.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-600">
                      <ShoppingCart className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-gray-900">
                        {line.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {line.quantity} × {formatPrice(line.price)}
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-green-700">
                      {formatPrice(line.price * line.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <p className="mb-3 text-sm font-extrabold text-gray-900">
                পেমেন্ট নির্বাচন করুন
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayment("BKASH")}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    selectedPayment === "BKASH"
                      ? "border-green-600 bg-green-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-green-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-green-700">bKash</span>
                    <span className="rounded-full bg-pink-50 px-2 py-1 text-[10px] font-bold text-pink-600">
                      Mobile
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    bKash card
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayment("CARD")}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    selectedPayment === "CARD"
                      ? "border-green-600 bg-green-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-green-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-green-700">Card</span>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                      Visa / Master
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Debit / Credit card
                  </p>
                </button>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                অর্ডার সারাংশ
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
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">সর্বমোট</span>
                  <span className="text-xl font-extrabold text-green-700">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={loading || cart.length === 0}
              onClick={handleCheckout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <CreditCard className="h-4 w-4" />
              {loading ? "চেকআউট চালু হচ্ছে..." : `Pay by ${selectedPayment}`}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-xs font-medium text-green-800">
              {selectedPayment === "BKASH" ? "bKash card selected" : "Card selected"}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
