"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowRight, LuCameraOff, LuRefreshCw } from "react-icons/lu";
import { api } from "@/lib/api";
import StudioCard from "./StudioCard";
import EmptyState from "./EmptyState";
import { StudioGridSkeleton } from "./Skeletons";

export default function FeaturedStudios() {
  const [state, setState] = useState({ status: "loading", studios: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", studios: [] });

    api("/studios?limit=6&sort=rating", { signal: controller.signal })
      .then((studios) => setState({ status: "ready", studios }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ status: "error", studios: [] });
      });

    return () => controller.abort();
  }, [attempt]);

  return (
    <section className="bg-base-200/60 py-16 sm:py-20" aria-labelledby="featured-title">
      <div className="page-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Featured studios</p>
            <h2 id="featured-title" className="section-title mt-2">
              Top-rated spaces, ready to book
            </h2>
          </div>
          <Link href="/studios" className="btn btn-ghost self-start sm:self-auto">
            View all studios <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
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
              icon={LuCameraOff}
              title="No studios listed yet"
              text="Be the first host on StudioSpace and list your creative space."
              actionHref="/add-studio"
              actionLabel="Host Your Space"
            />
          )}

          {state.status === "ready" && state.studios.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {state.studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
