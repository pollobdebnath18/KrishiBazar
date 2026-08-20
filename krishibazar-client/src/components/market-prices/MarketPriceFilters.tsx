"use client";

import { motion } from "framer-motion";
import { ListFilter, MapPinned, Search, Tags } from "lucide-react";
import type { PriceStatus } from "@/types/marketPrice";
import { translateCategory, translateLocation } from "@/lib/bangla";

export type StatusFilter = "all" | PriceStatus;

interface MarketPriceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  category: string;
  onCategoryChange: (value: string) => void;
  locations: string[];
  location: string;
  onLocationChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "সব" },
  { value: "increased", label: "দাম বেড়েছে" },
  { value: "decreased", label: "দাম কমেছে" },
  { value: "stable", label: "অপরিবর্তিত" },
];

export default function MarketPriceFilters({
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  locations,
  location,
  onLocationChange,
  status,
  onStatusChange,
}: MarketPriceFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-10 rounded-2xl border-2 border-green-300 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-green-600" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="পণ্যের নাম, বিভাগ বা এলাকা খুঁজুন..."
            className="w-full rounded-xl border border-green-200 bg-green-50/50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div className="relative lg:col-span-3">
          <Tags className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" />
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-green-200 bg-green-50/50 py-3 pl-10 pr-8 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
          >
            <option value="all">সব বিভাগ</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {translateCategory(item)}
              </option>
            ))}
          </select>
          <ListFilter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative lg:col-span-4">
          <MapPinned className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" />
          <select
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-green-200 bg-green-50/50 py-3 pl-10 pr-8 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
          >
            <option value="all">সব অবস্থান</option>
            {locations.map((item) => (
              <option key={item} value={item}>
                {translateLocation(item)}
              </option>
            ))}
          </select>
          <ListFilter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {statusOptions.map((option) => {
          const active = status === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onStatusChange(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}