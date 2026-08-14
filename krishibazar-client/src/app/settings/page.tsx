"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Bell,
  Loader2,
  Lock,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/auth/FormField";
import { districtList, districts } from "@/lib/data/locations";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(() => user?.name ?? "");
  const [mobile, setMobile] = useState(() => user?.mobile ?? "");
  const [district, setDistrict] = useState(() => user?.district ?? "");
  const [upazila, setUpazila] = useState(() => user?.upazila ?? "");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      updateUser({ name: name.trim(), mobile: mobile.trim(), district, upazila });
      setSaving(false);
      toast.success("সেটিংস সংরক্ষণ করা হয়েছে");
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f5f8f2]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            হোমে ফিরে যান
          </Link>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mt-6"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            সেটিংস
          </h1>
          <p className="mt-2 text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য ও পছন্দ পরিবর্তন করুন
          </p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Profile settings */}
          <motion.form
            onSubmit={handleSave}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: 0.14 }}
            className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <User className="h-5 w-5 text-green-600" />
              প্রোফাইল তথ্য
            </h2>

            <FormField
              id="name"
              label="আপনার নাম"
              type="text"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম"
            />

            <FormField
              id="mobile"
              label="মোবাইল নম্বর"
              type="tel"
              icon={Phone}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="01XXXXXXXXX"
            />

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                অবস্থান
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <MapPin className="h-5 w-5 text-gray-400" strokeWidth={2} />
                  </span>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setUpazila("");
                    }}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-gray-900 shadow-sm outline-none transition-all duration-200 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                  >
                    <option value="">জেলা নির্বাচন করুন</option>
                    {districtList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                    <MapPin className="h-5 w-5 text-gray-400" strokeWidth={2} />
                  </span>
                  <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    disabled={!district}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 shadow-sm outline-none transition-all duration-200 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">উপজেলা নির্বাচন করুন</option>
                    {district &&
                      districts[district].map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:from-green-700 hover:to-green-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  সংরক্ষণ করুন
                </>
              )}
            </button>
          </motion.form>

          {/* Preferences */}
          <div className="space-y-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Bell className="h-5 w-5 text-green-600" />
                নোটিফিকেশন
              </h2>

              <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition-colors hover:border-green-300">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    ইমেইল নোটিফিকেশন
                  </p>
                  <p className="text-xs text-gray-500">
                    নতুন দর ও অফার সম্পর্কে জানুন
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications}
                  onClick={() => setNotifications((n) => !n)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    notifications ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      notifications ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </label>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4, delay: 0.26 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Lock className="h-5 w-5 text-green-600" />
                নিরাপত্তা
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                আপনার পাসওয়ার্ড পরিবর্তন করতে চাইলে লগআউট করে আবার লগইন করুন
                অথবা প্রশাসকের সাথে যোগাযোগ করুন।
              </p>
              <Link
                href="/forgot-password"
                className="mt-4 inline-block text-sm font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline"
              >
                পাসওয়ার্ড রিসেট করুন
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}