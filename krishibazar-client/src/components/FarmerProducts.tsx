"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, ShoppingBasket } from "lucide-react";
import { getProducts } from "@/lib/api/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

export default function FarmerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({})
      .then((res) => setProducts(res.data.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 h-6 w-40 animate-pulse rounded-full bg-green-200" />
            <div className="mx-auto h-8 w-56 animate-pulse rounded-lg bg-green-100" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
              >
                <div className="h-36 w-full animate-pulse rounded-t-2xl bg-green-100" />
                <div className="p-4">
                  <div className="mb-3 h-5 w-2/3 animate-pulse rounded bg-green-100" />
                  <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-green-50" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-green-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            <ShoppingBasket className="h-4 w-4" />
            সরাসরি কৃষকদের কাছ থেকে
          </span>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            কৃষকের পণ্য
          </h2>
          <p className="mt-3 text-base text-gray-500">
            তাজা কৃষিপণ্য — মাঝারি দামে, মানসম্মত
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              whileHover={{ y: -4 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <ShoppingBasket className="h-12 w-12 text-green-200 transition-transform group-hover:scale-110" />
                )}
                {product.quantity === 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                    স্টক শেষ
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-gray-900">
                    {product.title}
                  </h3>
                  <span className="shrink-0 rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                    {product.category}
                  </span>
                </div>

                <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5 text-green-600" />
                  {product.location}
                </p>

                <div className="mt-auto pt-3">
                  <p className="text-xl font-extrabold text-green-700">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    প্রতি {product.unit} ·{" "}
                    {product.quantity > 0
                      ? `${product.quantity} ${product.unit} আছে`
                      : "স্টকে নেই"}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            সব পণ্য দেখুন
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
