"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Plus, ShoppingBasket } from "lucide-react";
import { toast } from "react-toastify";
import type { DashboardProduct } from "@/lib/dashboard/data";
import { formatPrice } from "@/lib/format";
import { translateProductTitle } from "@/lib/bangla";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: DashboardProduct;
  index?: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = product.image && !imageFailed;

  const handleAdd = () => {
    toast.success(`"${product.title}" কার্টে যোগ হয়েছে`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
        {showImage ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, 25vw"
            unoptimized
            onError={() => setImageFailed(true)}
            className="object-cover"
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
          <h3 className="text-base font-bold text-gray-900">{translateProductTitle(product.title)}</h3>
          <span className="shrink-0 rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
            {product.category}
          </span>
        </div>

        <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-green-600" />
          {product.location}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-extrabold text-green-700">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-gray-500">
              প্রতি {product.unit} ·{" "}
              {product.quantity > 0 ? `${product.quantity} ${product.unit} আছে` : "স্টকে নেই"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={product.quantity === 0}
            aria-label={`${product.title} কার্টে যোগ করুন`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-md shadow-green-600/25 transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}