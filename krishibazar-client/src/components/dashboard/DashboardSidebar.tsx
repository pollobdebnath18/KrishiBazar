"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightFromLine, LogOut, LucideLogOut, Sprout, X } from "lucide-react";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import {
  homeNavItem,
  isNavActive,
  logoutNavItem,
  navForRole,
  roleLabels,
  type DashboardRole,
  type NavItem,
} from "@/lib/dashboard/navigation";
import { LuLogOut } from "react-icons/lu";

interface DashboardSidebarProps {
  role: DashboardRole;
  open: boolean;
  onClose: () => void;
}

function SidebarContent({
  role,
  onNavigate,
}: {
  role: DashboardRole;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const handleLogout = () => {
    setConfirmOpen(false);
    logout();
    onNavigate?.();
    router.push("/login");
  };

  return (
    <div className="flex h-full flex-col border-r border-white/20 bg-gray-950 text-white">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pb-5 pt-6 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700">
          <Sprout className="h-5 w-5 text-white" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold leading-tight text-white">
            কৃষিবাজার
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-green-400">
            ড্যাশবোর্ড
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 space-y-1 overflow-y-auto px-4 pb-4 sm:px-5"
        aria-label="ড্যাশবোর্ড নেভিগেশন"
      >
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          মেনু
        </p>

        {navForRole[role].map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isNavActive(pathname, item)}
            onNavigate={onNavigate}
          />
        ))}

        <div className="my-3 border-t border-white/30" />

        <NavLink
          item={homeNavItem}
          active={isNavActive(pathname, homeNavItem)}
          onNavigate={onNavigate}
        />
      </nav>

      {/* User card + Logout */}
      <div className="px-4 pb-6 pt-2 sm:px-5">
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-sm font-bold text-white shadow-inner">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name}
            </p>
            <span className="mt-1 inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-[11px] font-semibold text-green-200">
              {roleLabels[role]}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="group flex w-full items-center gap-1 rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-600 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">{logoutNavItem.label}</span>
          <LuLogOut className="ml-auto h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="লগআউট করবেন?"
        description="আপনি কি নিশ্চিত যে আপনি ড্যাশবোর্ড থেকে লগআউট করতে চান?"
        confirmLabel="হ্যাঁ, লগআউট"
        cancelLabel="বাতিল"
        confirmTone="danger"
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-green-600 font-bold text-white shadow-md shadow-green-600/30"
          : "font-medium text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-green-400" />
      )}
      <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export default function DashboardSidebar({
  role,
  open,
  onClose,
}: DashboardSidebarProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleKey);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[25%] lg:overflow-hidden">
        <SidebarContent role={role} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              role="dialog"
              aria-modal="true"
              aria-label="ড্যাশবোর্ড মেনু"
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-xs overflow-hidden lg:hidden"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="মেনু বন্ধ করুন"
                className="absolute right-3 top-4 z-10 rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent role={role} onNavigate={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}