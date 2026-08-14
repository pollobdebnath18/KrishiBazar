"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "হোম", href: "/" },
  { label: "দৈনিক বাজারদর", href: "/market-prices" },
  { label: "পণ্যসমূহ", href: "/products" },
  { label: "কৃষক", href: "/farmers" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
];

const profileMenu = [
  { label: "প্রোফাইল", href: "/profile", icon: User },
  { label: "সেটিংস", href: "/settings", icon: Settings },
  { label: "ড্যাশবোর্ড", href: "/dashboard", icon: LayoutDashboard },
];

const roleLabels: Record<string, string> = {
  admin: "অ্যাডমিন",
  farmer: "কৃষক",
  buyer: "ক্রেতা",
};

function roleLabel(role?: string): string {
  return role ? roleLabels[role] ?? role : "";
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const cartCount = 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    logout();
  };

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">
            🌾
          </span>
          <span className="text-xl font-bold text-green-700 sm:text-2xl">
            কৃষিবাজার
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative rounded-full p-2 text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
          >
            <ShoppingBag className="h-6 w-6" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div
              ref={profileRef}
              className="relative "
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-green-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                  {initials}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg"
                >
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user?.name}{" "}
                      <span className="font-medium text-green-700">
                        ({roleLabel(user?.role)})
                      </span>
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  {profileMenu.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    লগআউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-50"
              >
                লগইন
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
              >
                রেজিস্টার
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="rounded-md p-2 text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700 lg:hidden"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <ul className="space-y-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!isAuthenticated && (
              <li className="flex gap-2 pt-2 sm:hidden">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg border border-green-600 px-4 py-2 text-center text-sm font-medium text-green-700 transition-colors hover:bg-green-50"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                >
                  রেজিস্টার
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
