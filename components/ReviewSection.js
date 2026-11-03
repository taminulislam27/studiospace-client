"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuMessageSquare, LuSend } from "react-icons/lu";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useAuth } from "./AuthProvider";
import { StarInput, Stars } from "./Stars";

export default function ReviewSection({ studio, onReviewed }) {
  const { user, isPending } = useAuth();
  const [state, setState] = useState({ status: "loading", reviews: [] });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    api(`/studios/${studio._id}/reviews`, { signal: controller.signal })
      .then((reviews) => setState({ status: "ready", reviews }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ status: "error", reviews: [] });
      });
    return () => controller.abort();
  }, [studio._id, attempt]);

  const isOwner = Boolean(user) && user.email === studio.ownerEmail;
  const alreadyReviewed =
    Boolean(user) && state.reviews.some((r) => r.userEmail === user.email);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (rating < 1) {
      setError("Choose a star rating first.");
      return;
    }
    setBusy(true);
    try {
      await api(`/studios/${studio._id}/reviews`, {
        method: "POST",
        body: { rating, comment },
      });
      toast.success("Thanks, your review is live.");
      setRating(0);
      setComment("");
      setAttempt((n) => n + 1);
      onReviewed?.();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="text-2xl font-bold">
        Reviews
        {studio.reviewCount > 0 && (
          <span className="ml-2 text-base font-normal text-base-content/60">
            ({studio.reviewCount})
          </span>
        )}
      </h2>

      <div className="mt-5 flex flex-col gap-4">
        {state.status === "loading" && (
          <>
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-24 w-full" />
          </>
        )}

        {state.status === "error" && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-base-300 p-4 text-sm">
            <span>We could not load the reviews.</span>
            <button type="button" className="btn btn-sm" onClick={() => setAttempt((n) => n + 1)}>
              Try again
            </button>
          </div>
        )}

        {state.status === "ready" && state.reviews.length === 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-base-300 bg-base-200/50 p-5 text-sm text-base-content/70">
            <LuMessageSquare className="h-5 w-5 shrink-0 text-primary" />
            No reviews yet. Book this studio and be the first to share how it went.
          </div>
        )}

        {state.reviews.map((review) => (
          <article
            key={review._id}
            className="rounded-box border border-base-300 bg-base-100 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-content">
                  {(review.userName || "?").charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold">{review.userName}</p>
                  <p className="text-xs text-base-content/60">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <Stars value={review.rating} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-base-content/80">{review.comment}</p>
          </article>
        ))}
      </div>

      <div className="mt-6">
        {isPending ? null : !user ? (
          <p className="text-sm text-base-content/70">
            <Link
              href={`/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`}
              className="font-semibold text-secondary hover:underline dark:text-primary"
            >
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        ) : isOwner ? (
          <p className="text-sm text-base-content/70">Hosts cannot review their own studio.</p>
        ) : alreadyReviewed ? (
          <p className="text-sm text-base-content/70">You have already reviewed this studio.</p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 rounded-box border border-base-300 bg-base-100 p-5"
          >
            <h3 className="text-lg font-semibold">Leave a review</h3>
            <StarInput value={rating} onChange={setRating} />
            <label htmlFor="review-comment" className="sr-only">
              Your review
            </label>
            <textarea
              id="review-comment"
              rows={3}
              required
              minLength={5}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the space, the gear and the host?"
              className="textarea w-full"
            />
            {error && (
              <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
                {error}
              </p>
            )}
            <div>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <LuSend className="h-4 w-4" />
                )}
                Post review
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
