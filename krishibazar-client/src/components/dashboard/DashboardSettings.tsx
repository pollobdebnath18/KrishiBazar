"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Bell, Loader2, Lock, MapPin, Phone, Save, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/auth/FormField";
import { districtList, districts } from "@/lib/data/locations";
import SectionCard from "./SectionCard";

export default function DashboardSettings() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(() => user?.name ?? "");
  const [mobile, setMobile] = useState(() => user?.mobile ?? "");
  const [district, setDistrict] = useState(() => user?.district ?? "");
  const [upazila, setUpazila] = useState(() => user?.upazila ?? "");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    setTimeout(() => {
      updateUser({ name: name.trim(), mobile: mobile.trim(), district, upazila });
      setSaving(false);
      toast.success("সেটিংস সংরক্ষণ করা হয়েছে");
    }, 500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard
        title="প্রোফাইল তথ্য"
        subtitle="আপনার অ্যাকাউন্টের মৌলিক তথ্য আপডেট করুন"
      >
        <form onSubmit={handleSave} noValidate className="mt-4 space-y-5">
          <FormField
            id="dashboard-name"
            label="আপনার নাম"
            type="text"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার পূর্ণ নাম"
          />

          <FormField
            id="dashboard-mobile"
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
                  <MapPin className="h-5 w-5 text-gray-400" />
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
                  {districtList.map((districtName) => (
                    <option key={districtName} value={districtName}>
                      {districtName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </span>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  disabled={!district}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 shadow-sm outline-none transition-all duration-200 hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">উপজেলা নির্বাচন করুন</option>
                  {district &&
                    districts[district].map((upazilaName) => (
                      <option key={upazilaName} value={upazilaName}>
                        {upazilaName}
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
        </form>
      </SectionCard>

      <div className="space-y-6">
        <SectionCard
          title="নোটিফিকেশন"
          subtitle="নতুন দর ও অফার সম্পর্কে জানুন"
          delay={0.1}
        >
          <label className="mt-2 flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition-colors hover:border-green-300">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700">
                <Bell className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  ইমেইল নোটিফিকেশন
                </p>
                <p className="text-xs text-gray-500">
                  অর্ডার ও বাজারদরের আপডেট পান
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications}
              onClick={() => setNotifications((value) => !value)}
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
        </SectionCard>

        <SectionCard
          title="নিরাপত্তা"
          subtitle="আপনার পাসওয়ার্ড পরিবর্তন করতে চাইলে প্রশাসকের সাথে যোগাযোগ করুন"
          delay={0.15}
        >
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700">
              <Lock className="h-4 w-4" />
            </span>
            <p className="text-sm font-medium text-gray-700">
              পাসওয়ার্ড রিসেট পদ্ধতি পরবর্তী সংস্করণে যোগ হবে
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}