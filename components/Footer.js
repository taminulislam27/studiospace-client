import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import Logo from "./Logo";
import XIcon from "./XIcon";
import NewsletterForm from "./NewsletterForm";
import { CATEGORIES, categoryHref } from "@/lib/constants";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Host Your Space", href: "/add-studio" },
];

const SOCIALS = [
  { label: "StudioSpace on X", href: "https://x.com", icon: <XIcon className="h-4 w-4" /> },
  { label: "StudioSpace on Instagram", href: "https://instagram.com", icon: <FaInstagram className="h-4 w-4" /> },
  { label: "StudioSpace on YouTube", href: "https://youtube.com", icon: <FaYoutube className="h-4 w-4" /> },
  { label: "StudioSpace on LinkedIn", href: "https://linkedin.com", icon: <FaLinkedinIn className="h-4 w-4" /> },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="page-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-sm leading-relaxed text-base-content/70">
            Our mission is to put every empty creative room to work and give
            every maker a fair, transparent way to book the space their idea
            needs.
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="btn btn-circle btn-ghost btn-sm border border-base-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-base font-bold">Quick links</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-base-content/70">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-base font-bold">Popular categories</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-base-content/70">
            {CATEGORIES.map((c) => (
              <li key={c.value}>
                <Link href={categoryHref(c.value)} className="hover:text-primary">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-base font-bold">Studio news, in your inbox</h4>
          <p className="text-sm text-base-content/70">
            New spaces, host tips and booking updates. No spam.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-base-300">
        <div className="page-container flex flex-col gap-2 py-5 text-xs text-base-content/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>
            By using StudioSpace you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </footer>
  );
}
