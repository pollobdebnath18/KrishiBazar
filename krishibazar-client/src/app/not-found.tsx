"use client";

import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <div className="relative w-full max-w-3xl text-center">
        {/* Background decorations */}
        <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-600 shadow-sm"
          >
            <SearchX size={40} />
          </motion.div>

          {/* 404 */}
          <h1 className="text-8xl font-bold tracking-tight text-green-600 sm:text-9xl">
            404
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
            দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি হয়তো সরানো হয়েছে, পরিবর্তন
            করা হয়েছে অথবা বর্তমানে উপলব্ধ নেই।
          </p>

          {/* Button */}
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
          >
            <Home size={18} />
            হোম পেজে ফিরে যান
          </Link>

          <p className="mt-6 text-sm text-gray-400">
            KrishiBazar — কৃষকের পণ্য, সরাসরি আপনার কাছে
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFoundPage;
