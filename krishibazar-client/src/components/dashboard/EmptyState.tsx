"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600"
      >
        {icon ?? <Inbox className="h-7 w-7" />}
      </motion.span>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm leading-6 text-gray-500">{description}</p>
      )}
      {action}
    </div>
  );
}