"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "হোম", href: "/" },
  { label: "দৈনিক বাজারদর", href: "/market-prices" },
  { label: "পণ্যসমূহ", href: "/products" },
  { label: "কৃষক", href: "/farmers" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = 0;

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

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
          </ul>
        </div>
      )}
    </header>
  );
}