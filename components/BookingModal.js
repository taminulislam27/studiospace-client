"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuCalendarCheck, LuInfo } from "react-icons/lu";
import { api } from "@/lib/api";
import {
  addDays,
  formatDate,
  formatMoney,
  formatRange,
  toDateInput,
} from "@/lib/format";

export default function BookingModal({ open, onClose, studio }) {
  const router = useRouter();
  const ref = useRef(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [slots, setSlots] = useState([]);

  const studioId = studio._id;

  function loadSlots() {
    api(`/studios/${studioId}/booked`)
      .then(setSlots)
      .catch(() => setSlots([]));
  }

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Each time the modal opens: reset the message, default the date, load taken slots.
  useEffect(() => {
    if (!open) return;
    setError("");
    setDate((d) => d || toDateInput(addDays(new Date(), 1)));
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, studioId]);

  const start = date && startTime ? new Date(`${date}T${startTime}`) : null;
  const end = date && endTime ? new Date(`${date}T${endTime}`) : null;
  const hours = start && end && end > start ? (end - start) / 3600000 : 0;
  const subtotal = hours * studio.hourlyRate;

  // Confirmed slots that touch the chosen day, shown so guests can plan around them.
  const dayStart = date ? new Date(`${date}T00:00`) : null;
  const dayEnd = dayStart ? addDays(dayStart, 1) : null;
  const daySlots = dayStart
    ? slots.filter((s) => new Date(s.startAt) < dayEnd && new Date(s.endAt) > dayStart)
    : [];
  const clash =
    hours > 0 && slots.some((s) => new Date(s.startAt) < end && new Date(s.endAt) > start);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (hours < 1) {
      setError("Choose at least one hour: the end time must be after the start time.");
      return;
    }

    setBusy(true);
    try {
      await api("/bookings", {
        method: "POST",
        body: {
          studioId,
          date,
          startTime,
          endTime,
          tzOffset: start.getTimezoneOffset(),
          guests: Number(guests),
          note: note.trim(),
        },
      });
      toast.success("Booking request sent. The host will confirm it soon.");
      onClose();
      router.push("/my-bookings");
    } catch (err) {
      let message = err.message;
      const conflict = err.data?.conflict;
      if (err.status === 409 && conflict) {
        message = `${err.message} Already booked: ${formatDate(conflict.startAt)}, ${formatRange(
          conflict.startAt,
          conflict.endAt
        )}.`;
        loadSlots();
      }
      setError(message);
      toast.error(err.status === 409 ? "That time slot is already booked." : message);
    } finally {
      setBusy(false);
    }
  }

  const label = "text-sm font-medium";

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle" onClose={onClose}>
      <div className="modal-box max-w-lg">
        <h3 className="text-xl font-bold">Book {studio.title}</h3>
        <p className="mt-1 text-sm text-base-content/70">
          {formatMoney(studio.hourlyRate)} per hour, up to {studio.maxCapacity} guests.
        </p>

        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="booking-date" className={label}>Date</label>
            <input
              id="booking-date"
              type="date"
              required
              min={toDateInput(new Date())}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="booking-start" className={label}>Start time</label>
              <input
                id="booking-start"
                type="time"
                step="1800"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="booking-end" className={label}>End time</label>
              <input
                id="booking-end"
                type="time"
                step="1800"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {daySlots.length > 0 && (
            <div className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm">
              <p className="font-semibold">Already booked on this day</p>
              <ul className="mt-1 text-base-content/80">
                {daySlots.map((s) => (
                  <li key={s._id}>{formatRange(s.startAt, s.endAt)}</li>
                ))}
              </ul>
              {clash && (
                <p className="mt-2 flex items-center gap-1.5 font-medium text-error">
                  <LuInfo className="h-4 w-4" />
                  Your times overlap one of these. Pick a different slot.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="booking-guests" className={label}>Guests</label>
            <input
              id="booking-guests"
              type="number"
              min="1"
              max={studio.maxCapacity}
              step="1"
              required
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="input w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="booking-note" className={label}>
              Note to the host <span className="font-normal text-base-content/50">(optional)</span>
            </label>
            <textarea
              id="booking-note"
              rows={2}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What are you shooting or recording?"
              className="textarea w-full"
            />
          </div>

          <dl className="rounded-lg bg-base-200 p-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-base-content/70">Duration</dt>
              <dd className="font-medium">{hours > 0 ? `${hours} hr` : "Choose your times"}</dd>
            </div>
            <div className="mt-1 flex justify-between">
              <dt className="text-base-content/70">Studio time</dt>
              <dd className="font-medium">{hours > 0 ? formatMoney(subtotal) : "-"}</dd>
            </div>
            <div className="mt-1 flex justify-between">
              <dt className="text-base-content/70">Security deposit (set by host)</dt>
              <dd className="font-medium">{formatMoney(studio.securityDeposit)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <div className="modal-action mt-0">
            <button type="button" className="btn" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <LuCalendarCheck className="h-4 w-4" />
              )}
              Send booking request
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close dialog">close</button>
      </form>
    </dialog>
  );
}
