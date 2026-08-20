"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { RefreshCw, SearchX, ShoppingBasket, WifiOff } from "lucide-react";

interface StateCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

function StateCard({ icon, title, description, action }: StateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-green-100 bg-white px-8 py-12 text-center shadow-sm"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-6 text-gray-500">{description}</p>
      {action}
    </motion.div>
  );
}

interface EmptyStateProps {
  onRetry: () => void;
}

export function EmptyState({ onRetry }: EmptyStateProps) {
  return (
    <StateCard
      icon={<ShoppingBasket className="h-10 w-10" />}
      title="এখনো কোনো বাজারদর যোগ হয়নি"
      description="বর্তমানে দৈনিক বাজার দরের কোনো তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন অথবা কিছুক্ষণ পর দেখুন।"
      action={
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <RefreshCw className="h-4 w-4" />
          আবার চেষ্টা করুন
        </button>
      }
    />
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <StateCard
      icon={<WifiOff className="h-10 w-10" />}
      title="বাজারদর লোড করা যায়নি"
      description={
        message ||
        "সার্ভার থেকে দৈনিক বাজার দর আনা সম্ভব হয়নি। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।"
      }
      action={
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <RefreshCw className="h-4 w-4" />
          আবার চেষ্টা করুন
        </button>
      }
    />
  );
}

interface NoResultsProps {
  onClear: () => void;
}

export function NoResults({ onClear }: NoResultsProps) {
  return (
    <StateCard
      icon={<SearchX className="h-10 w-10" />}
      title="কোনো ফলাফল পাওয়া যায়নি"
      description="আপনার খোঁজা বা ফিল্টারের সাথে মিলে যাওয়া কোনো বাজারদর পাওয়া যায়নি। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।"
      action={
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <RefreshCw className="h-4 w-4" />
          ফিল্টার মুছুন
        </button>
      }
    />
  );
}