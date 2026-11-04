"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuRefreshCw, LuSearch, LuSearchX } from "react-icons/lu";
import { api } from "@/lib/api";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import StudioCard from "./StudioCard";
import EmptyState from "./EmptyState";
import { StudioGridSkeleton } from "./Skeletons";

export default function StudiosExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "newest";

  const [search, setSearch] = useState(q);
  const [state, setState] = useState({ status: "loading", studios: [] });
  const [attempt, setAttempt] = useState(0);

  const paramString = params.toString();
  const updateParams = useCallback(
    (changes) => {
      const next = new URLSearchParams(paramString);
      Object.entries(changes).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [paramString, pathname, router]
  );

  useEffect(() => {
    if (search.trim() === q) return;
    const id = setTimeout(() => updateParams({ q: search.trim() }), 350);
    return () => clearTimeout(id);
  }, [search, q, updateParams]);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: "loading" }));

    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (q) qs.set("q", q);
    qs.set("sort", sort);

    api(`/studios?${qs.toString()}`, { signal: controller.signal })
      .then((studios) => setState({ status: "ready", studios }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ status: "error", studios: [] });
      });

    return () => controller.abort();
  }, [category, q, sort, attempt]);

  function clearFilters() {
    setSearch("");
    router.replace(pathname, { scroll: false });
  }

  const chip = (active) =>
    `btn btn-sm ${active ? "btn-primary" : "btn-ghost border border-base-300"}`;

  return (
    <section className="page-container py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="section-eyebrow">Explore studios</p>
        <h1 className="section-title mt-2">Find a space for your next session</h1>
        <p className="section-lead mt-3">
          Filter by category, search by name or location, and sort by price or rating.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button type="button" className={chip(!category)} onClick={() => updateParams({ category: "" })}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={chip(category === c.value)}
              onClick={() => updateParams({ category: c.value })}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="input w-full sm:w-64">
            <LuSearch className="h-4 w-4 opacity-60" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or location"
              aria-label="Search studios"
            />
          </label>
          <select
            className="select w-full sm:w-48"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value === "newest" ? "" : e.target.value })}
            aria-label="Sort studios"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        {state.status === "loading" && <StudioGridSkeleton count={6} />}

        {state.status === "error" && (
          <EmptyState
            icon={LuRefreshCw}
            title="We could not load the studios"
            text="The server did not answer. Check your connection and try again."
            actionLabel="Try again"
            onAction={() => setAttempt((n) => n + 1)}
          />
        )}

        {state.status === "ready" && state.studios.length === 0 && (
          <EmptyState
            icon={LuSearchX}
            title="No studios match your search"
            text="Try a different category or keyword, or clear your filters to see every space."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        )}

        {state.status === "ready" && state.studios.length > 0 && (
          <>
            <p className="mb-4 text-sm text-base-content/60" aria-live="polite">
              {state.studios.length} {state.studios.length === 1 ? "studio" : "studios"} found
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {state.studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
