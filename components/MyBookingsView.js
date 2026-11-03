"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuCalendarDays, LuClock, LuMapPin, LuRefreshCw, LuUsers } from "react-icons/lu";
import { api } from "@/lib/api";
import { formatDate, formatMoney, formatRange } from "@/lib/format";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import StudioThumb from "./StudioThumb";
import { StudioGridSkeleton } from "./Skeletons";

export default function MyBookingsView() {
  const [state, setState] = useState({ status: "loading", items: [] });
  const [attempt, setAttempt] = useState(0);
  const [cancelling, setCancelling] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", items: [] });
    api("/my-bookings", { signal: controller.signal })
      .then((items) => setState({ status: "ready", items }))
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error", items: [] });
      });
    return () => controller.abort();
  }, [attempt]);

  async function confirmCancel() {
    if (!cancelling) return;
    setBusy(true);
    try {
      const updated = await api(`/bookings/${cancelling._id}/cancel`, { method: "PATCH" });
      setState((s) => ({
        ...s,
        items: s.items.map((b) => (b._id === cancelling._id ? { ...b, ...updated } : b)),
      }));
      toast.success("Booking cancelled.");
      setCancelling(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-container py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="section-eyebrow">Your reservations</p>
        <h1 className="section-title mt-2">My bookings</h1>
        <p className="section-lead mt-3">
          Track every request from Pending to Completed. You can cancel a booking while it is
          still Pending.
        </p>
      </div>

      <div className="mt-8">
        {state.status === "loading" && <StudioGridSkeleton count={3} />}

        {state.status === "error" && (
          <EmptyState
            icon={LuRefreshCw}
            title="We could not load your bookings"
            text="The server did not answer. Check your connection and try again."
            actionLabel="Try again"
            onAction={() => setAttempt((n) => n + 1)}
          />
        )}

        {state.status === "ready" && state.items.length === 0 && (
          <EmptyState
            icon={LuCalendarDays}
            title="No bookings yet"
            text="Find a space for your next shoot, session or workshop and your reservations will show up here."
            actionHref="/studios"
            actionLabel="Explore Studios"
          />
        )}

        {state.status === "ready" && state.items.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {state.items.map((b) => (
              <article
                key={b._id}
                className="flex h-full flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-5"
              >
                <div className="flex items-start gap-4">
                  <StudioThumb
                    src={b.studioImage}
                    category={b.studioCategory}
                    alt={b.studioTitle}
                    className="h-20 w-20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <StatusBadge status={b.status} />
                      <span className="text-xs text-base-content/50">{b.studioCategory}</span>
                    </div>
                    <h2 className="mt-2 line-clamp-1 text-lg font-semibold">
                      <Link href={`/studios/${b.studioId}`} className="hover:text-primary">
                        {b.studioTitle}
                      </Link>
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-base-content/70">
                      <LuMapPin className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{b.studioLocation}</span>
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 rounded-lg bg-base-200 p-4 text-sm">
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs text-base-content/60">
                      <LuCalendarDays className="h-3.5 w-3.5" /> Date
                    </dt>
                    <dd className="mt-0.5 font-medium">{formatDate(b.startAt)}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs text-base-content/60">
                      <LuClock className="h-3.5 w-3.5" /> Time
                    </dt>
                    <dd className="mt-0.5 font-medium">{formatRange(b.startAt, b.endAt)}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs text-base-content/60">
                      <LuUsers className="h-3.5 w-3.5" /> Guests
                    </dt>
                    <dd className="mt-0.5 font-medium">{b.guests}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-base-content/60">
                      Total ({b.hours} hr)
                    </dt>
                    <dd className="mt-0.5 font-medium">{formatMoney(b.totalPrice)}</dd>
                  </div>
                </dl>

                {b.status === "Cancelled" && b.cancelReason && (
                  <p className="text-sm text-base-content/60">{b.cancelReason}</p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3">
                  <p className="text-xs text-base-content/50">
                    Security deposit {formatMoney(b.securityDeposit)}
                  </p>
                  {b.status === "Pending" && (
                    <button
                      type="button"
                      className="btn btn-error btn-outline btn-sm"
                      onClick={() => setCancelling(b)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(cancelling)}
        title="Cancel this booking?"
        text={`Your request for ${cancelling?.studioTitle ?? "this studio"} will be cancelled and the host will not be asked to confirm it.`}
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        danger
        busy={busy}
        onConfirm={confirmCancel}
        onClose={() => !busy && setCancelling(null)}
      />
    </section>
  );
}
