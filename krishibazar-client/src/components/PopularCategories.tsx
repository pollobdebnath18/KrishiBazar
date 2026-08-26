"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Carrot, Apple, Fish, Beef, Milk, Wheat } from "lucide-react";

export default function PopularCategories() {
  const categories = [
    {
      id: 1,
      title: "সবজি",
      examples: "আলু, পেঁয়াজ, টমেটো, বেগুন",
      icon: <Carrot className="w-8 h-8 text-green-600" />,
      color: "bg-green-50",
      href: "/products?category=vegetables"
    },
    {
      id: 2,
      title: "ফল",
      examples: "আম, কলা, পেয়ারা, লিচু",
      icon: <Apple className="w-8 h-8 text-red-500" />,
      color: "bg-red-50",
      href: "/products?category=fruits"
    },
    {
      id: 3,
      title: "মাছ",
      examples: "রুই, কাতলা, ইলিশ, তেলাপিয়া",
      icon: <Fish className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-50",
      href: "/products?category=fish"
    },
    {
      id: 4,
      title: "মাংস",
      examples: "গরু, খাসি, মুরগি",
      icon: <Beef className="w-8 h-8 text-orange-500" />,
      color: "bg-orange-50",
      href: "/products?category=meat"
    },
    {
      id: 5,
      title: "দুধ ও দুগ্ধজাত",
      examples: "দুধ, দই, ঘি, ছানা",
      icon: <Milk className="w-8 h-8 text-sky-500" />,
      color: "bg-sky-50",
      href: "/products?category=dairy"
    },
    {
      id: 6,
      title: "শস্য ও ডাল",
      examples: "চাল, গম, ভুট্টা, মসুর ডাল",
      icon: <Wheat className="w-8 h-8 text-amber-600" />,
      color: "bg-amber-50",
      href: "/products?category=grains"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            <span className="inline-block mr-2">🥬</span> জনপ্রিয় ক্যাটাগরি
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            কৃষকদের কাছ থেকে সরাসরি তাজা ও মানসম্মত পণ্য কিনুন
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={category.href}
                className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full text-center hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-green-50/0 group-hover:bg-green-50/50 transition-colors duration-300 z-0"></div>

                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10 group-hover:text-green-700 transition-colors">
                  {category.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4 relative z-10 leading-relaxed">
                  {category.examples}
                </p>

                <div className="mt-auto relative z-10">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
