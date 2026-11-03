import { LuAperture } from "react-icons/lu";

export function PageSpinner({ label = "Loading..." }) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <LuAperture className="animate-spin-brand h-12 w-12 text-primary" />
      <p className="text-sm text-base-content/60">{label}</p>
    </div>
  );
}

export function StudioCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-8 w-28" />
        </div>
      </div>
    </div>
  );
}

export function StudioGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <StudioCardSkeleton key={i} />
      ))}
    </div>
  );
}
