"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Leaf, ShieldCheck, Truck } from "lucide-react";

const features = [
  { icon: Truck, label: "ঘরে ঘরে ডেলিভারি" },
  { icon: Leaf, label: "১০০% তাজা পণ্য" },
  { icon: ShieldCheck, label: "ন্যায্য দামের নিশ্চয়তা" },
];

export default function AuthImagePanel({ image }: { image: StaticImageData }) {
  return (
    <div className="relative flex min-h-[320px] flex-col overflow-hidden bg-green-950 lg:min-h-full">
      <Image
        src={image}
        alt="বাংলাদেশের কৃষকের ক্ষেত"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/55 to-green-900/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-green-950/60" />

      <div className="relative z-10 flex flex-1 flex-col justify-between p-8 sm:p-10 lg:p-12">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
        >
          <BadgeCheck className="h-4 w-4 text-green-300" />
          <span className="text-sm font-semibold text-white">
            কৃষক থেকে সরাসরি
          </span>
        </motion.div>

        {/* Marketing text */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-md text-3xl font-bold leading-snug text-white sm:text-4xl lg:text-[2.6rem] lg:leading-tight"
          >
            মাঠের তাজা ফসল,
            <span className="text-green-300"> সরাসরি আপনার দোরগোড়ায়।</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-4 max-w-md text-base leading-relaxed text-green-100/90 sm:text-lg"
          >
            দেশের লক্ষ কৃষকের গর্ব ও ঘামে গড়া কৃষিপণ্য — ন্যায্য দামে,
            মধ্যস্বত্বভোগী ছাড়াই।
          </motion.p>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
              >
                <Icon className="h-4 w-4 text-green-300" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}