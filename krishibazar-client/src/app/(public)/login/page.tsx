"use client";

import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Loader2, Mail } from "lucide-react";

import Logo from "@/components/auth/Logo";
import FormField from "@/components/auth/FormField";
import AuthImagePanel from "@/components/auth/AuthImagePanel";
import banner from "@/assets/banner2.jpg";
import { LoginUser } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Errors = {
  email?: string;
  password?: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      const saved = window.localStorage.getItem("rememberedLogin");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setEmail(parsed.email ?? "");
          setPassword(parsed.password ?? "");
          setRemember(true);
        } catch {
          // ignore malformed saved credentials
        }
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!email.trim()) {
      next.email = "ইমেইল প্রয়োজন";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "সঠিক ইমেইল ঠিকানা দিন";
    }
    if (!password) {
      next.password = "পাসওয়ার্ড প্রয়োজন";
    } else if (password.length < 6) {
      next.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
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

      const result = await LoginUser({
        email: email.trim(),
        password,
      });

      if (remember) {
        window.localStorage.setItem(
          "rememberedLogin",
          JSON.stringify({ email: email.trim(), password }),
        );
      } else {
        window.localStorage.removeItem("rememberedLogin");
      }

      login(result.data.user, result.data.token);

      toast.success("লগইন সফল হয়েছে");

      router.push("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "লগইন ব্যর্থ হয়েছে",
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
                স্বাগতম কৃষিবাজারে
              </h1>
              <p className="mt-2 text-gray-500">
                আপনার অ্যাকাউন্টে লগইন করে তাজা কৃষিপণ্য কেনাবেচা করুন
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
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
                id="password"
                label="পাসওয়ার্ড"
                type="password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড"
                autoComplete="current-password"
                error={errors.password}
                toggleable
              />

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 accent-green-600"
                  />
                  মনে রাখুন
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

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
                    লগইন হচ্ছে...
                  </>
                ) : (
                  <>
                    লগইন করুন
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.p
              variants={cardVariants}
              className="mt-8 text-center text-sm text-gray-500"
            >
              অ্যাকাউন্ট নেই?{" "}
              <Link
                href="/register"
                className="font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline"
              >
                নিবন্ধন করুন
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}