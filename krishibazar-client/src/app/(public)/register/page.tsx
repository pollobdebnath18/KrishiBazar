"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Store,
  Tractor,
  User,
} from "lucide-react";

import Logo from "@/components/auth/Logo";
import FormField from "@/components/auth/FormField";
import AuthImagePanel from "@/components/auth/AuthImagePanel";
import banner from "@/assets/banner5.webp";
import { RegisterUser } from "@/lib/api/auth";
import { districtList, districts } from "@/lib/data/locations";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Role = "farmer" | "buyer" | null;

type Errors = {
  name?: string;
  email?: string;
  mobile?: string;
  district?: string;
  upazila?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
};

const roles: {
  value: Exclude<Role, null>;
  label: string;
  desc: string;
  icon: typeof Tractor;
}[] = [
  {
    value: "farmer",
    label: "কৃষক",
    desc: "ফসল ও পণ্য বিক্রি করুন",
    icon: Tractor,
  },
  { value: "buyer", label: "ক্রেতা", desc: "তাজা কৃষিপণ্য কিনুন", icon: Store },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) {
      next.name = "আপনার নাম লিখুন";
    } else if (name.trim().length < 2) {
      next.name = "নাম কমপক্ষে ৩ অক্ষরের হতে হবে";
    }
    if (!email.trim()) {
      next.email = "ইমেইল প্রয়োজন";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "সঠিক ইমেইল ঠিকানা দিন";
    }
    if (!mobile.trim()) {
      next.mobile = "মোবাইল নম্বর প্রয়োজন";
    } else if (!/^01[3-9]\d{8}$/.test(mobile.trim())) {
      next.mobile = "সঠিক মোবাইল নম্বর দিন";
    }
    if (!district) {
      next.district = "জেলা নির্বাচন করুন";
    }
    if (!upazila) {
      next.upazila = "উপজেলা নির্বাচন করুন";
    }
    if (!password) {
      next.password = "পাসওয়ার্ড প্রয়োজন";
    } else if (password.length < 6) {
      next.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    }
    if (!confirmPassword) {
      next.confirmPassword = "পাসওয়ার্ড আবার লিখুন";
    } else if (confirmPassword !== password) {
      next.confirmPassword = "পাসওয়ার্ড দুটি মিলছে না";
    }
    if (!role) {
      next.role = "আপনার ভূমিকা নির্বাচন করুন";
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) return;

    try {
      setLoading(true);

      const result = await RegisterUser({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        upazila: upazila.trim(),
        district: district.trim(),
        password,
        role: role!,
      });

      console.log("REGISTER RESPONSE:", result);

      login(result.data.user, result.data.token);

      toast.success("নিবন্ধন সফল হয়েছে");

      // Redirect
      router.push("/");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "নিবন্ধন ব্যর্থ হয়েছে",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f5f8f2]">
      <div className="grid lg:grid-cols-2 lg:gap-0">
        {/* Left: image panel */}
        <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
          <AuthImagePanel image={banner} />
        </div>

        {/* Right: auth card */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <motion.div variants={cardVariants}>
              <Logo />
            </motion.div>

            <motion.div variants={cardVariants} className="mt-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                অ্যাকাউন্ট তৈরি করুন
              </h1>
              <p className="mt-2 text-gray-500">
                কৃষিবাজারে যোগ দিন — কয়েক সেকেন্ডেই শুরু করুন
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <FormField
                id="name"
                label="আপনার নাম"
                type="text"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার পূর্ণ নাম"
                autoComplete="name"
                error={errors.name}
              />

              <FormField
                id="email"
                label="ইমেইল"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল"
                autoComplete="email"
                error={errors.email}
              />

              <FormField
                id="mobile"
                label="মোবাইল নম্বর"
                type="tel"
                icon={Phone}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                error={errors.mobile}
              />

              <motion.div variants={cardVariants}>
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  আপনার অবস্থান
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <MapPin
                          className={`h-5 w-5 ${
                            errors.district ? "text-red-400" : "text-gray-400"
                          }`}
                          strokeWidth={2}
                        />
                      </span>
                      <select
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          setUpazila("");
                        }}
                        aria-invalid={Boolean(errors.district)}
                        className={`w-full appearance-none rounded-xl border py-3 pl-11 pr-4 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 ${
                          errors.district
                            ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-gray-200 bg-white hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                        }`}
                      >
                        <option value="">জেলা নির্বাচন করুন</option>
                        {districtList.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.district && (
                      <p className="mt-1.5 text-sm font-medium text-red-500">
                        {errors.district}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                        <MapPin
                          className={`h-5 w-5 ${
                            errors.upazila ? "text-red-400" : "text-gray-400"
                          }`}
                          strokeWidth={2}
                        />
                      </span>
                      <select
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        disabled={!district}
                        aria-invalid={Boolean(errors.upazila)}
                        className={`w-full appearance-none rounded-xl border py-3 pl-10 pr-4 text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${
                          errors.upazila
                            ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-gray-200 bg-white hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15"
                        }`}
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
                    {errors.upazila && (
                      <p className="mt-1.5 text-sm font-medium text-red-500">
                        {errors.upazila}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              <FormField
                id="password"
                label="পাসওয়ার্ড"
                type="password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                autoComplete="new-password"
                error={errors.password}
                toggleable
              />

              <FormField
                id="confirmPassword"
                label="পাসওয়ার্ড নিশ্চিত করুন"
                type="password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার পাসওয়ার্ড লিখুন"
                autoComplete="new-password"
                error={errors.confirmPassword}
                toggleable
              />

              {/* Role selection */}
              <motion.div variants={cardVariants}>
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  আপনি কে?
                </span>
                <div
                  className="grid grid-cols-2 gap-3"
                  role="radiogroup"
                  aria-label="আপনার ভূমিকা"
                >
                  {roles.map(({ value, label, desc, icon: Icon }) => {
                    const active = role === value;
                    return (
                      <motion.button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setRole(value)}
                        className={`flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                          active
                            ? "border-green-600 bg-green-50 shadow-md shadow-green-600/10"
                            : "border-gray-200 bg-white hover:border-green-300"
                        }`}
                      >
                        <div className="flex justify-center items-center gap-4">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              active
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Icon className="h-5 w-5" strokeWidth={2} />
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{desc}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {errors.role && (
                  <p className="mt-1.5 text-sm font-medium text-red-500">
                    {errors.role}
                  </p>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.02 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:from-green-700 hover:to-green-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    নিবন্ধন হচ্ছে...
                  </>
                ) : (
                  <>
                    নিবন্ধন করুন
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.p
              variants={cardVariants}
              className="mt-6 text-center text-sm text-gray-500"
            >
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link
                href="/login"
                className="font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline"
              >
                লগইন করুন
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
