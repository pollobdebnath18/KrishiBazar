"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, Sprout } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  isDashboardRole,
  roleHome,
} from "@/lib/dashboard/navigation";
import DashboardSidebar from "./DashboardSidebar";
import PageTransition from "./PageTransition";
import Redirect from "./Redirect";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return <Redirect to="/login" />;
  }

  if (!isDashboardRole(user.role)) {
    return <Redirect to={roleHome(user.role)} />;
  }

  const role = user.role;

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        role={role}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="মেনু খুলুন"
            aria-expanded={drawerOpen}
            className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-700">
              <Sprout className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              কৃষি<span className="text-green-600">বাজার</span>
            </span>
          </Link>

          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white"
            aria-label={user.name}
          >
            {initials}
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 py-6 sm:px-5 lg:py-8 lg:pl-1 lg:pr-3">
          <div className="w-full">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}