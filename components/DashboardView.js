"use client";

import Link from "next/link";
import { LuArrowRight, LuCalendarDays, LuList, LuPlus } from "react-icons/lu";
import { useAuth } from "./AuthProvider";
import Avatar from "./Avatar";

const ACTIONS = [
  {
    href: "/add-studio",
    icon: LuPlus,
    title: "Add New Studio",
    text: "List a creative space and set your hourly rate.",
  },
  {
    href: "/my-listings",
    icon: LuList,
    title: "My Studio Listings",
    text: "Update or remove the spaces you host.",
  },
  {
    href: "/my-bookings",
    icon: LuCalendarDays,
    title: "My Bookings",
    text: "Track the status of your reservations.",
  },
];

export default function DashboardView() {
  const { user } = useAuth();

  return (
    <section className="page-container py-12 sm:py-16">
      <div className="flex flex-col items-start gap-5 rounded-box border border-base-300 bg-base-100 p-6 sm:flex-row sm:items-center sm:p-8">
        <Avatar user={user} size="h-16 w-16" />
        <div className="min-w-0">
          <p className="section-eyebrow">Dashboard</p>
          <h1 className="section-title mt-1 break-words">Welcome back, {user?.name}</h1>
          <p className="mt-1 truncate text-sm text-base-content/70">{user?.email}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {ACTIONS.map(({ href, icon: Icon, title, text }) => (
          <Link
            key={href}
            href={href}
            className="group flex h-full flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-6 transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
              <Icon className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-base-content/70">{text}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary dark:text-primary">
              Open <LuArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
