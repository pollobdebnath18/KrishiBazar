"use client";

import { motion } from "framer-motion";

const SKELETON_COUNT = 5;

export default function MarketPriceSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          className="flex flex-col overflow-hidden rounded-2xl border-2 border-green-300 bg-white shadow-sm sm:flex-row"
        >
          <div className="h-44 w-full shrink-0 animate-pulse bg-green-100 sm:h-auto sm:w-44 lg:w-56" />
          <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="h-6 w-1/3 animate-pulse rounded-full bg-green-100" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-green-200" />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="h-4 w-24 animate-pulse rounded-full bg-green-100" />
              <div className="h-4 w-20 animate-pulse rounded-full bg-green-100" />
              <div className="h-4 w-28 animate-pulse rounded-full bg-green-100" />
            </div>
            <div className="mt-1 h-4 w-full animate-pulse rounded-full bg-green-100" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}