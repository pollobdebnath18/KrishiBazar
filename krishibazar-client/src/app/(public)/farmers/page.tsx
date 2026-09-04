"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Mail, MapPin, Phone, Tractor } from "lucide-react";
import { GetUsers } from "@/lib/api/auth";
import type { DashboardUser } from "@/lib/dashboard/data";

type ViewState = "loading" | "error" | "ready";

export default function Farmers() {
  const [farmers, setFarmers] = useState<DashboardUser[]>([]);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadFarmers = useCallback(async () => {
    setViewState("loading");
    try {
      const response = await GetUsers("farmer");
      setFarmers(response.data);
      setErrorMessage("");
      setViewState("ready");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "কৃষকদের তালিকা লোড করা যায়নি",
      );
      setViewState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadFarmers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadFarmers]);

  return (
    <main className="min-h-screen bg-[#f5f8f2] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <Tractor className="h-4 w-4" />
            আমাদের কৃষক পরিবার
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            কৃষকদের তালিকা
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-600">
            দেশের বিভিন্ন এলাকার নিবন্ধিত কৃষকদের সঙ্গে সরাসরি যোগাযোগ করুন।
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {viewState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-20"
            >
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
              <p className="text-sm font-medium text-green-700">
                কৃষকদের তালিকা লোড হচ্ছে...
              </p>
            </motion.div>
          )}

          {viewState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center"
            >
              <p className="text-sm font-medium text-red-600">{errorMessage}</p>
              <button
                type="button"
                onClick={loadFarmers}
                className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                আবার চেষ্টা করুন
              </button>
            </motion.div>
          )}

          {viewState === "ready" && farmers.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center"
            >
              <Tractor className="h-12 w-12 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                এখনো কোনো কৃষক নিবন্ধন করেননি।
              </p>
            </motion.div>
          )}

          {viewState === "ready" && farmers.length > 0 && (
            <motion.div
              key="farmers"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {farmers.map((farmer) => (
                <motion.article
                  key={farmer.id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-lg font-bold text-green-700">
                      {farmer.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-gray-900">
                        {farmer.name}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-green-700">
                        নিবন্ধিত কৃষক
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm text-gray-600">
                    <p className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-green-600" />
                      {farmer.upazila}, {farmer.district}
                    </p>
                    <a
                      href={`tel:${farmer.mobile}`}
                      className="flex items-center gap-3 transition-colors hover:text-green-700"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-green-600" />
                      {farmer.mobile}
                    </a>
                    <a
                      href={`mailto:${farmer.email}`}
                      className="flex min-w-0 items-center gap-3 transition-colors hover:text-green-700"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-green-600" />
                      <span className="truncate">{farmer.email}</span>
                    </a>
                    <p className="flex items-center gap-3 text-xs text-gray-500">
                      <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />
                      যোগ দিয়েছেন {farmer.joinedAt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
