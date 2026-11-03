"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LuCalendarDays,
  LuLayoutDashboard,
  LuList,
  LuLogOut,
  LuMenu,
  LuPlus,
  LuX,
} from "react-icons/lu";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./Avatar";
import { useAuth } from "./AuthProvider";
import { NAV_LINKS } from "@/lib/constants";

const MENU = [
  { href: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: LuPlus },
  { href: "/my-listings", label: "My Studio Listings", icon: LuList },
  { href: "/my-bookings", label: "My Bookings", icon: LuCalendarDays },
];

function closeDropdown() {
  const el = document.activeElement;
  if (el instanceof HTMLElement) el.blur();
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, isPending, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/90 backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden h-full items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = link.isActive(pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full items-center px-3 text-sm font-medium transition-colors hover:text-primary ${
                  active ? "text-base-content" : "text-base-content/70"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isPending ? (
            <div className="skeleton h-10 w-10 rounded-full" aria-hidden="true" />
          ) : user ? (
            <div className="dropdown dropdown-end dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="block cursor-pointer rounded-full"
                aria-label="Open account menu"
              >
                <Avatar user={user} />
              </div>
              <div tabIndex={0} className="dropdown-content z-50 w-64 pt-2">
                <div className="rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
                  <div className="px-3 py-2">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-base-content/60">
                      {user.email}
                    </p>
                  </div>
                  <div className="my-1 border-t border-base-300" />
                  <ul className="flex flex-col">
                    {MENU.map(({ href, label, icon: Icon }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={closeDropdown}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
                        >
                          <Icon className="h-4 w-4 text-base-content/60" />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="my-1 border-t border-base-300" />
                  <button
                    type="button"
                    onClick={() => {
                      closeDropdown();
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-error hover:bg-base-200"
                  >
                    <LuLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm hidden sm:inline-flex">
                Register
              </Link>
            </>
          )}

          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <LuX className="h-5 w-5" /> : <LuMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-base-300 bg-base-100 lg:hidden"
          aria-label="Mobile"
        >
          <div className="page-container flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => {
              const active = link.isActive(pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-primary/15 text-base-content"
                      : "text-base-content/75 hover:bg-base-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {!user && !isPending && (
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-2 sm:hidden"
              >
                Register
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
