"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";

type Tone = "green" | "emerald" | "amber" | "red" | "blue" | "violet";

const toneStyles: Record<Tone, { icon: string; hint: string }> = {
  green: { icon: "bg-green-100 text-green-700", hint: "text-green-700" },
  emerald: { icon: "bg-emerald-100 text-emerald-700", hint: "text-emerald-700" },
  amber: { icon: "bg-amber-100 text-amber-700", hint: "text-amber-700" },
  red: { icon: "bg-red-100 text-red-700", hint: "text-red-700" },
  blue: { icon: "bg-blue-100 text-blue-700", hint: "text-blue-700" },
  violet: { icon: "bg-violet-100 text-violet-700", hint: "text-violet-700" },
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "green",
  hint,
  trend = "neutral",
  delay = 0,
}: StatCardProps) {
  const styles = toneStyles[tone];

  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1.5 text-3xl font-extrabold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
      </div>

      {(hint || trend !== "neutral") && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
          {trend !== "neutral" && (
            <TrendIcon className={`h-3.5 w-3.5 ${styles.hint}`} />
          )}
          <span className={styles.hint}>{hint}</span>
        </div>
      )}
    </motion.div>
  );
}