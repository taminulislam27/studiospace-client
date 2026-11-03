import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import CategoryIcon from "./CategoryIcon";
import { CATEGORIES, categoryHref } from "@/lib/constants";

export default function CategoryCards() {
  return (
    <section className="page-container py-16 sm:py-20" aria-labelledby="categories-title">
      <div className="max-w-2xl">
        <p className="section-eyebrow">Browse by category</p>
        <h2 id="categories-title" className="section-title mt-2">
          Whatever you make, there is a room for it
        </h2>
        <p className="section-lead mt-3">
          Choose a category and we will take you straight to matching spaces.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={categoryHref(c.value)}
            className="group flex h-full flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-6 transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
              <CategoryIcon category={c.value} className="h-6 w-6" />
            </span>
            <div className="flex flex-1 flex-col gap-1.5">
              <h3 className="text-lg font-semibold">{c.label}</h3>
              <p className="text-sm leading-relaxed text-base-content/70">{c.blurb}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary dark:text-primary">
              Browse
              <LuArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
