"use client";

import { motion } from "framer-motion";

export interface BarDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  suffix?: string;
}

export function BarChart({ data, height = 180, suffix = "" }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
      {data.map((d, index) => (
        <div
          key={d.label}
          className="flex h-full min-w-0 flex-1 flex-col items-center gap-1.5"
        >
          <span className="text-[11px] font-semibold text-gray-600">
            {d.value}
            {suffix}
          </span>
          <div className="flex w-full flex-1 items-end overflow-hidden rounded-md bg-green-50">
            <motion.div
              className="w-full rounded-md bg-gradient-to-t from-green-600 to-emerald-400"
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.7, delay: index * 0.06, ease: "easeOut" }}
            />
          </div>
          <span className="truncate text-[11px] font-medium text-gray-500">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

interface SparklineProps {
  data: number[];
  className?: string;
}

export function Sparkline({ data, className }: SparklineProps) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 40 - ((value - min) / range) * 32 - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={`h-8 w-full ${className ?? ""}`}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}