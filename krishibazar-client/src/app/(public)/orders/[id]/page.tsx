"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ClipboardList, Package } from "lucide-react";
import { getOrder } from "@/lib/api/orders";
import { formatPrice } from "@/lib/format";
import type { DashboardOrder } from "@/lib/dashboard/data";

type ViewState = "loading" | "ready" | "error";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<DashboardOrder | null>(null);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    void getOrder(id)
      .then((response) => {
        if (cancelled) return;
        setOrder(response.data);
        setViewState("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error ? error.message : "অর্ডার পাওয়া যায়নি",
        );
        setViewState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (viewState === "loading") {
    return (
      <main className="min-h-screen bg-[#f5f8f2] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-10 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-24 animate-pulse rounded bg-gray-100" />
        </div>
      </main>
    );
  }

  if (viewState === "error" || !order) {
    return (
      <main className="min-h-screen bg-[#f5f8f2] px-4 py-12">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-lg font-extrabold text-red-700">
            {errorMessage || "অর্ডারটি পাওয়া যায়নি"}
          </p>
          <Link
            href="/dashboard/buyer/my-orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            অর্ডার তালিকায় ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f2] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-green-700">
              Order Details
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
              {order.orderNumber}
            </h1>
          </div>
          <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
            {order.status}
          </span>
        </div>

        <div className="grid gap-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_280px]">
          <section className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <Package className="h-7 w-7" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-gray-500">
                  পণ্যের নাম
                </p>
                <p className="mt-1 text-lg font-extrabold text-gray-900">
                  {order.product}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="ক্রেতা" value={order.customer} />
              <InfoRow label="কৃষক" value={order.farmer} />
              <InfoRow label="পরিমাণ" value={`${order.quantity} ${order.unit}`} />
              <InfoRow label="তারিখ" value={order.date} />
              <InfoRow label="পেমেন্ট" value={order.payment} />
            </div>
          </section>

          <aside className="rounded-3xl border border-gray-200 bg-green-50 p-5">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-extrabold">
                অর্ডার সারাংশ
              </span>
            </div>
            <div className="mt-4 border-t border-green-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">মোট</span>
                <span className="text-2xl font-extrabold text-green-700">
                  {formatPrice(order.total)}
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">স্ট্যাটাস</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-green-700">
                  {order.status}
                </span>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard/buyer/my-orders"
            className="inline-flex items-center gap-2 rounded-xl border border-green-600 px-5 py-3 text-sm font-bold text-green-700 transition-colors hover:bg-green-50"
          >
            <ArrowLeft className="h-4 w-4" />
            অর্ডার তালিকায় ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-500">{label}</p>
      <p className="mt-2 text-sm font-extrabold text-gray-900">{value}</p>
    </div>
  );
}
