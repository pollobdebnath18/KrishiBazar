"use client";

import { motion } from "framer-motion";
import { PackageCheck, Search, ShoppingBasket } from "lucide-react";

const steps = [
  {
    number: "১",
    icon: Search,
    title: "পণ্য খুঁজুন",
    description: "পছন্দের কৃষিপণ্য সহজে খুঁজে দেখুন।",
  },
  {
    number: "২",
    icon: ShoppingBasket,
    title: "পণ্য নির্বাচন করুন",
    description: "আপনার পছন্দের পণ্য ও কৃষক নির্বাচন করুন।",
  },
  {
    number: "৩",
    icon: PackageCheck,
    title: "সহজে অর্ডার করুন",
    description: "অর্ডার করে কৃষকের কাছ থেকে পণ্য সংগ্রহ করুন।",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            সহজ প্রক্রিয়া
          </span>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            কীভাবে কাজ করে?
          </h2>
          <p className="mt-3 text-base text-gray-500">
            মাত্র তিনটি সহজ ধাপে কৃষিপণ্য পান আপনার দোরগোড়ায়।
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6"
        >
          {/* Connecting line — desktop */}
          <div className="pointer-events-none absolute left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] top-[72px] hidden h-[2px] bg-gradient-to-r from-green-300 via-green-400 to-green-300 md:block" />

          {/* Connecting line — mobile (vertical) */}
          <div className="pointer-events-none absolute bottom-[calc(50%-24px)] left-[39px] top-[calc(50%+24px)] w-[2px] bg-gradient-to-b from-green-300 via-green-400 to-green-300 md:hidden" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative flex flex-col items-center gap-5 rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-xl"
              >
                {/* Step number badge */}
                <span className="absolute -top-4 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-600/30">
                  {step.number}
                </span>

                {/* Icon circle */}
                <span className="mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-500/25 transition-transform group-hover:scale-110">
                  <Icon className="h-8 w-8" strokeWidth={1.8} />
                </span>

                <h3 className="text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
