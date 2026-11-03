"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LuCameraOff,
  LuCheck,
  LuEye,
  LuInbox,
  LuPencil,
  LuPlus,
  LuRefreshCw,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { api } from "@/lib/api";
import { formatDate, formatMoney, formatRange } from "@/lib/format";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import StudioThumb from "./StudioThumb";
import { Stars } from "./Stars";

export default function MyListingsView() {
  const [listings, setListings] = useState({ status: "loading", items: [] });
  const [requests, setRequests] = useState({ status: "loading", items: [] });
  const [attempt, setAttempt] = useState(0);

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [declining, setDeclining] = useState(null);
  const [busyBookingId, setBusyBookingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setListings({ status: "loading", items: [] });
    setRequests({ status: "loading", items: [] });

    api("/my-studios", { signal: controller.signal })
      .then((items) => setListings({ status: "ready", items }))
      .catch((err) => {
        if (err.name !== "AbortError") setListings({ status: "error", items: [] });
      });
    api("/host-bookings", { signal: controller.signal })
      .then((items) => setRequests({ status: "ready", items }))
      .catch((err) => {
        if (err.name !== "AbortError") setRequests({ status: "error", items: [] });
      });

    return () => controller.abort();
  }, [attempt]);

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api(`/studios/${deleting._id}`, { method: "DELETE" });
      setListings((s) => ({ ...s, items: s.items.filter((x) => x._id !== deleting._id) }));
      setRequests((s) => ({
        ...s,
        items: s.items.map((b) =>
          b.studioId === deleting._id && (b.status === "Pending" || b.status === "Confirmed")
            ? { ...b, status: "Cancelled" }
            : b
        ),
      }));
      toast.success("Studio deleted.");
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteBusy(false);
    }
  }

  async function updateBooking(booking, status) {
    setBusyBookingId(booking._id);
    try {
      const updated = await api(`/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setRequests((s) => ({
        ...s,
        items: s.items.map((b) => (b._id === booking._id ? { ...b, ...updated } : b)),
      }));
      toast.success(status === "Confirmed" ? "Booking confirmed." : "Booking declined.");
      setDeclining(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyBookingId(null);
    }
  }

  const th = "text-xs uppercase tracking-wider text-base-content/60";

  return (
    <section className="page-container py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="section-eyebrow">Host dashboard</p>
          <h1 className="section-title mt-2">My studio listings</h1>
          <p className="section-lead mt-3">
            Update or remove the spaces you host and respond to booking requests.
          </p>
        </div>
        <Link href="/add-studio" className="btn btn-primary self-start sm:self-auto">
          <LuPlus className="h-4 w-4" /> Add New Studio
        </Link>
      </div>

      {/* ---- Listings ---- */}
      <div className="mt-8">
        {listings.status === "loading" && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-20 w-full" />
            ))}
          </div>
        )}

        {listings.status === "error" && (
          <EmptyState
            icon={LuRefreshCw}
            title="We could not load your listings"
            text="The server did not answer. Check your connection and try again."
            actionLabel="Try again"
            onAction={() => setAttempt((n) => n + 1)}
          />
        )}

        {listings.status === "ready" && listings.items.length === 0 && (
          <EmptyState
            icon={LuCameraOff}
            title="You have not listed a studio yet"
            text="List your first space and start earning from the hours it sits idle."
            actionHref="/add-studio"
            actionLabel="Add New Studio"
          />
        )}

        {listings.status === "ready" && listings.items.length > 0 && (
          <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th className={th}>Studio</th>
                  <th className={th}>Rate</th>
                  <th className={th}>Location</th>
                  <th className={th}>Rating</th>
                  <th className={`${th} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.items.map((studio) => (
                  <tr key={studio._id}>
                    <td>
                      <div className="flex min-w-56 items-center gap-3">
                        <StudioThumb src={studio.image} category={studio.category} alt={studio.title} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{studio.title}</p>
                          <p className="text-xs text-base-content/60">{studio.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap font-medium">
                      {formatMoney(studio.hourlyRate)} / hr
                    </td>
                    <td className="min-w-40 text-sm text-base-content/80">{studio.location}</td>
                    <td>
                      {studio.reviewCount > 0 ? (
                        <span className="flex items-center gap-2 whitespace-nowrap text-sm">
                          <Stars value={studio.rating} className="h-3.5 w-3.5" />
                          {Number(studio.rating).toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-sm text-base-content/50">No reviews</span>
                      )}
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/studios/${studio._id}`}
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={`View ${studio.title}`}
                          title="View"
                        >
                          <LuEye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/studios/edit/${studio._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <LuPencil className="h-4 w-4" /> Update
                        </Link>
                        <button
                          type="button"
                          className="btn btn-error btn-outline btn-sm"
                          onClick={() => setDeleting(studio)}
                        >
                          <LuTrash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---- Booking requests ---- */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold">Booking requests</h2>
        <p className="mt-1 text-sm text-base-content/70">
          Reservations guests have made on your studios. Confirming a request blocks that
          time for everyone else.
        </p>

        <div className="mt-5">
          {requests.status === "loading" && <div className="skeleton h-24 w-full" />}

          {requests.status === "error" && (
            <EmptyState
              icon={LuRefreshCw}
              title="We could not load booking requests"
              actionLabel="Try again"
              onAction={() => setAttempt((n) => n + 1)}
            />
          )}

          {requests.status === "ready" && requests.items.length === 0 && (
            <EmptyState
              icon={LuInbox}
              title="No booking requests yet"
              text="When a guest books one of your studios, the request shows up here."
            />
          )}

          {requests.status === "ready" && requests.items.length > 0 && (
            <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th className={th}>Studio</th>
                    <th className={th}>Guest</th>
                    <th className={th}>When</th>
                    <th className={th}>Total</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.items.map((b) => (
                    <tr key={b._id}>
                      <td className="min-w-40 font-medium">{b.studioTitle}</td>
                      <td className="min-w-40">
                        <p className="text-sm font-medium">{b.userName}</p>
                        <p className="text-xs text-base-content/60">
                          {b.guests} {b.guests === 1 ? "guest" : "guests"}
                        </p>
                      </td>
                      <td className="min-w-44 text-sm">
                        <p>{formatDate(b.startAt)}</p>
                        <p className="text-base-content/60">{formatRange(b.startAt, b.endAt)}</p>
                      </td>
                      <td className="whitespace-nowrap font-medium">{formatMoney(b.totalPrice)}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          {b.status === "Pending" ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                disabled={busyBookingId === b._id}
                                onClick={() => updateBooking(b, "Confirmed")}
                              >
                                {busyBookingId === b._id ? (
                                  <span className="loading loading-spinner loading-xs" />
                                ) : (
                                  <LuCheck className="h-4 w-4" />
                                )}
                                Confirm
                              </button>
                              <button
                                type="button"
                                className="btn btn-error btn-outline btn-sm"
                                disabled={busyBookingId === b._id}
                                onClick={() => setDeclining(b)}
                              >
                                <LuX className="h-4 w-4" /> Decline
                              </button>
                            </>
                          ) : (
                            <span className="text-sm text-base-content/50">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={Boolean(deleting)}
        title={`Delete ${deleting?.title ?? "this studio"}?`}
        text="This removes the listing and its reviews, and cancels any pending or confirmed bookings for it. This cannot be undone."
        confirmLabel="Delete studio"
        cancelLabel="Keep it"
        danger
        busy={deleteBusy}
        onConfirm={confirmDelete}
        onClose={() => !deleteBusy && setDeleting(null)}
      />

      <ConfirmModal
        open={Boolean(declining)}
        title="Decline this booking request?"
        text={`${declining?.userName ?? "The guest"} will see the booking as cancelled and the time stays open for others.`}
        confirmLabel="Decline request"
        cancelLabel="Go back"
        danger
        busy={Boolean(declining) && busyBookingId === declining?._id}
        onConfirm={() => declining && updateBooking(declining, "Cancelled")}
        onClose={() => setDeclining(null)}
      />
    </section>
  );
}
