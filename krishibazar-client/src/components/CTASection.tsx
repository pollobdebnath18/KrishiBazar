"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sprout, Store, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#f5f8f2] py-20 sm:py-28">
      {/* Background card */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-6 py-14 sm:px-12 sm:py-20 lg:px-20">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-green-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

          {/* Grid pattern overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />

          <div className="relative flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-green-100 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-green-300" />
                এখনই শুরু করুন
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            >
              আজই যুক্ত হোন{" "}
              <span className="relative">
                <span className="relative z-10 text-green-200">KrishiBazar</span>
                <span className="absolute bottom-1 left-0 z-0 h-3 w-full bg-green-400/25 sm:bottom-2 sm:h-4" />
              </span>
              -এর সাথে
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-green-100/90 sm:text-lg"
            >
              কৃষক হোন বা ক্রেতা — সরাসরি কৃষিপণ্যের সাথে সংযুক্ত হোন।
              মাঝারি দামে, ঝামেলামুক্ত, বিশ্বাসযোগ্য।
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
            >
              <Link
                href="/register"
                className="group flex items-center gap-3 rounded-2xl bg-white px-7 py-4 text-base font-bold text-green-700 shadow-xl shadow-black/10 transition-all duration-200 hover:bg-green-50 hover:shadow-2xl hover:-translate-y-0.5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 transition-colors group-hover:bg-green-200">
                  <Sprout className="h-5 w-5 text-green-700" />
                </span>
                কৃষক হিসেবে যুক্ত হোন
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/register"
                className="group flex items-center gap-3 rounded-2xl border-2 border-white/30 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/10 hover:-translate-y-0.5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 transition-colors group-hover:bg-white/25">
                  <Store className="h-5 w-5 text-white" />
                </span>
                ক্রেতা হিসেবে যুক্ত হোন
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-green-200/70"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                বিনামূল্যে নিবন্ধন
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                কোনো মধ্যস্বত্বভোগী নেই
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                নিরাপদ লেনদেন
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
