"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, type LucideIcon } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password" | "tel" | "number";
  icon: LucideIcon;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  toggleable?: boolean;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function FormField({
  id,
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  toggleable = false,
}: FormFieldProps) {
  const [show, setShow] = useState(false);
  const inputType = toggleable && show ? "text" : type;
  const hasError = Boolean(error);

  return (
    <motion.div variants={fieldVariants}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Icon
            className={`h-5 w-5 ${
              hasError ? "text-red-400" : "text-gray-400"
            }`}
            strokeWidth={2}
          />
        </span>

        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`w-full rounded-xl border py-3 pl-11 pr-4 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 ${
            toggleable ? "pr-12" : ""
          } ${
            hasError
              ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-gray-200 bg-white hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
          }`}
        />

        {toggleable && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition-colors hover:text-green-600"
          >
            {show ? (
              <EyeOff className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Eye className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        )}
      </div>

      {hasError && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-500"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}