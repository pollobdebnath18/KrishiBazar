"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";

import Img1 from "../assets/banner1.jpg";
import Img2 from "../assets/banner2.jpg";
// import Img3 from "../assets/banner3.webp";
import Img3 from "../assets/banner4.jpg";
// import Img5 from "../assets/banner5.webp";
import Img4 from "../assets/banner6.webp";
import Link from "next/link";

const banners: StaticImageData[] = [Img1, Img2, Img3, Img4];

const Banner = () => {
  return (
    <section className="min-h-screen overflow-hidden bg-[#f5f8f2]">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <span className="mb-5 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            🌾 কৃষক থেকে সরাসরি
          </span>

          <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            কৃষকের পণ্য,
            <span className="block text-green-600">সরাসরি আপনার ঘরে</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            স্থানীয় কৃষকদের কাছ থেকে তাজা ও মানসম্মত কৃষিপণ্য ন্যায্য দামে
            সরাসরি কিনুন।
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products" className="rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white transition hover:bg-green-700 cursor-pointer">
              পণ্য দেখুন
            </Link>

            <Link href="/market-prices" className="rounded-xl border border-green-600 px-7 py-3.5 font-semibold text-green-700 transition hover:bg-green-600 hover:text-white cursor-pointer">
              আজকের বাজারদর
            </Link>
          </div>

          {/* Small Stats */}
          <div className="mt-10 flex gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">৫০০+</h3>
              <p className="text-sm text-gray-500">কৃষক</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">১,০০০+</h3>
              <p className="text-sm text-gray-500">কৃষিপণ্য</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">২৪/৭</h3>
              <p className="text-sm text-gray-500">অনলাইন বাজার</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {banners.map((image, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                }}
                whileHover={{
                  scale: 1.04,
                  y: -6,
                }}
                className={`group relative overflow-hidden rounded-2xl shadow-lg ${
                  index === 1 || index === 4 ? "mt-8" : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`কৃষিবাজার ${index + 1}`}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-60"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/30" />

                {/* Number */}
                {/* <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-green-700">
                  {index + 1}
                </div> */}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
