"use client";

import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const orderNumber = params.get("orderNumber");
  const sessionId = params.get("session_id");

  return (
    <main className="min-h-screen bg-[#f5f8f2] px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-green-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-wide text-green-700">
          Payment Successful
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
          আপনার অর্ডার নিশ্চিত হয়েছে
        </h1>
        <p className="mt-4 text-sm text-gray-600">
          Stripe checkout সম্পন্ন হয়েছে। আপনার অর্ডার নম্বর: <span className="font-extrabold text-green-700">{orderNumber ?? "KB-ORDER"}</span>
        </p>

        {sessionId && (
          <p className="mt-3 text-xs text-gray-500">
            Session ID: {sessionId}
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/buyer/my-orders"
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700"
          >
            অর্ডার দেখুন
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-green-600 px-5 py-3 text-sm font-bold text-green-700 transition-colors hover:bg-green-50"
          >
            <Home className="h-4 w-4" />
            হোমে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
