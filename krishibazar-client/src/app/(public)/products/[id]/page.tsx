"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  ShoppingBasket,
} from "lucide-react";
import { toast } from "react-toastify";
import { getProduct } from "@/lib/api/products";
import { formatDate, formatPrice, formatQuantity } from "@/lib/format";
import {
  translateCategory,
  translateDescription,
  translateLocation,
  translateProductTitle,
} from "@/lib/bangla";
import type { Product } from "@/types/product";
import { getCartKey, readCart, writeCart } from "@/lib/cart";

type ViewState = "loading" | "ready" | "error";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void getProduct(id)
        .then((response) => {
          if (cancelled) return;
          setProduct(response.data);
          setViewState("ready");
        })
        .catch((error) => {
          if (cancelled) return;
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "পণ্যের তথ্য পাওয়া যায়নি",
          );
          setViewState("error");
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [id]);

  const addToCart = () => {
    if (!product || product.quantity <= 0) {
      return;
    }

    try {
      const cart = readCart();
      const existing = cart.find(
        (line: { productId: string }) => line.productId === product.id,
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          title: product.title,
          unit: product.unit,
          price: product.price,
          quantity: 1,
          image: product.image,
        });
      }

      writeCart(cart);
      toast.success(`"${translateProductTitle(product.title)}" কার্টে যোগ হয়েছে`);
    } catch {
      toast.error("কার্টে পণ্য যোগ করা যায়নি");
    }
  };

  if (viewState === "loading") return <ProductDetailsSkeleton />;

  if (viewState === "error" || !product) {
    return (
      <main className="min-h-screen bg-[#f5f8f2] px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
          <ShoppingBasket className="h-12 w-12 text-red-300" />
          <p className="font-medium text-red-600">
            {errorMessage || "পণ্যটি পাওয়া যায়নি"}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            পণ্যে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const title = translateProductTitle(product.title);
  const description =
    translateDescription(product.description) ?? "কোনো বিবরণ দেওয়া হয়নি";
  const showImage = Boolean(product.image) && !imageFailed;

  return (
    <main className="min-h-screen bg-[#f5f8f2] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition-colors hover:text-green-900"
        >
          <ArrowLeft className="h-4 w-4" />
          সব পণ্যে ফিরে যান
        </Link>

        <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 sm:min-h-[500px]">
            {showImage ? (
              <Image
                src={product.image}
                alt={title}
                fill
                priority
                unoptimized
                onError={() => setImageFailed(true)}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            ) : (
              <ShoppingBasket className="h-24 w-24 text-green-200" />
            )}
            {product.quantity === 0 && (
              <span className="absolute left-5 top-5 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                স্টক শেষ
              </span>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                {translateCategory(product.category)}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {product.quantity > 0 ? "স্টকে আছে" : "স্টকে নেই"}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 text-green-600" />
              {translateLocation(product.location)}
            </p>

            <div className="mt-8 border-y border-gray-100 py-6">
              <p className="text-4xl font-extrabold text-green-700">
                {formatPrice(product.price)}
              </p>
              <p className="mt-1 text-sm text-gray-500">প্রতি {product.unit}</p>
            </div>

            <section className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                পণ্যের বিবরণ
              </h2>
              <p className="mt-3 leading-7 text-gray-600">{description}</p>
            </section>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <DetailItem
                icon={<Package className="h-5 w-5" />}
                label="উপলভ্য পরিমাণ"
                value={formatQuantity(product.quantity, product.unit)}
              />
              <DetailItem
                icon={<CalendarDays className="h-5 w-5" />}
                label="যোগ করার তারিখ"
                value={formatDate(product.createdAt)}
              />
            </div>

            <button
              type="button"
              disabled={product.quantity === 0}
              onClick={addToCart}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              <ShoppingBasket className="h-5 w-5" />
              {product.quantity > 0 ? "কার্টে যোগ করুন" : "স্টক শেষ"}
            </button>

            <p className="mt-4 text-xs text-gray-400">
              সর্বশেষ আপডেট: {formatDate(product.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="text-green-600">{icon}</div>
      <p className="mt-2 text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f5f8f2] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 h-5 w-40 rounded bg-gray-200" />
        <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-h-[320px] bg-gray-200 sm:min-h-[500px]" />
          <div className="p-6 sm:p-10">
            <div className="h-6 w-24 rounded bg-gray-200" />
            <div className="mt-5 h-12 w-3/4 rounded bg-gray-200" />
            <div className="mt-4 h-5 w-40 rounded bg-gray-200" />
            <div className="my-8 border-y border-gray-100 py-7">
              <div className="h-12 w-44 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="h-24 rounded-xl bg-gray-100" />
              <div className="h-24 rounded-xl bg-gray-100" />
            </div>
            <div className="mt-8 h-12 w-full rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    </main>
  );
}
