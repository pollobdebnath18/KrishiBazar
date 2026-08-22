"use client";

import { motion } from "framer-motion";
import { Handshake, IndianRupee, Leaf, ShoppingBag } from "lucide-react";

const features = [
  {
    icon: Handshake,
    title: "সরাসরি কৃষকের কাছ থেকে",
    description:
      "মধ্যস্বত্বভোগী ছাড়াই সরাসরি কৃষকদের কাছ থেকে কিনুন — নির্ভরযোগ্য ও স্বচ্ছ।",
  },
  {
    icon: IndianRupee,
    title: "ন্যায্য মূল্য",
    description:
      "বাজারের সর্বোত্তম দামে কৃষিপণ্য পান — কোনো লুকফুঁটি নেই।",
  },
  {
    icon: Leaf,
    title: "তাজা ও মানসম্মত পণ্য",
    description:
      "খামার থেকে সরাসরি আপনার দোরগোড়ায় — সবসময় তাজা ও প্রাকৃতিক।",
  },
  {
    icon: ShoppingBag,
    title: "সহজে অর্ডার করুন",
    description:
      "মাত্র কয়েকটি ক্লিকে পণ্য অর্ডার করুন — দ্রুত ও ঝামেলামুক্ত ডেলিভারি।",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyKrishiBazar() {
  return (
    <section className="bg-[#f5f8f2] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            আমাদের সুবিধা
          </span>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            কেন KrishiBazar?
          </h2>
          <p className="mt-3 text-base text-gray-500">
            কৃষক ও ক্রেতাদের মধ্যে সেতুবন্ধন — বিশ্বাসযোগ্য, সহজ, দ্রুত।
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative flex flex-col items-center gap-4 rounded-2xl border border-green-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-xl"
              >
                {/* Icon circle */}
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-500/25 transition-transform group-hover:scale-110">
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </span>

                <h3 className="text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
