"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import {
  LuCalendarCheck,
  LuCheck,
  LuMapPin,
  LuRefreshCw,
  LuSearchX,
  LuShieldCheck,
  LuUsers,
} from "react-icons/lu";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { useAuth } from "./AuthProvider";
import BookingModal from "./BookingModal";
import CategoryIcon from "./CategoryIcon";
import EmptyState from "./EmptyState";
import ReviewSection from "./ReviewSection";
import { Stars } from "./Stars";

function GallerySlide({ src, alt, category }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/25 text-primary">
        <CategoryIcon category={category} className="h-20 w-20" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      className="h-full w-full object-cover"
    />
  );
}

function DetailsSkeleton() {
  return (
    <section className="page-container py-10" aria-busy="true">
      <div className="skeleton mb-6 h-5 w-64" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-5">
          <div className="skeleton aspect-[16/10] w-full" />
          <div className="skeleton h-9 w-3/4" />
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton h-32 w-full" />
        </div>
        <div className="skeleton h-72 w-full" />
      </div>
    </section>
  );
}

export default function StudioDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isPending } = useAuth();

  const [state, setState] = useState({ status: "loading", studio: null });
  const [attempt, setAttempt] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", studio: null });
    api(`/studios/${id}`, { signal: controller.signal })
      .then((studio) => setState({ status: "ready", studio }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        const missing = err.status === 404 || err.status === 400;
        setState({ status: missing ? "missing" : "error", studio: null });
      });
    return () => controller.abort();
  }, [id, attempt]);

  const refreshStudio = useCallback(() => {
    api(`/studios/${id}`)
      .then((studio) => setState({ status: "ready", studio }))
      .catch(() => {});
  }, [id]);

  function startBooking() {
    if (!user) {
      toast.error("Please log in to book this studio.");
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`);
      return;
    }
    setBookingOpen(true);
  }

  if (state.status === "loading") return <DetailsSkeleton />;

  if (state.status === "missing") {
    return (
      <section className="page-container py-16">
        <EmptyState
          icon={LuSearchX}
          title="We could not find that studio"
          text="It may have been removed by its host, or the link is incorrect."
          actionHref="/studios"
          actionLabel="Explore Studios"
        />
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="page-container py-16">
        <EmptyState
          icon={LuRefreshCw}
          title="We could not load this studio"
          text="The server did not answer. Check your connection and try again."
          actionLabel="Try again"
          onAction={() => setAttempt((n) => n + 1)}
        />
      </section>
    );
  }

  const studio = state.studio;
  const images = [...new Set([studio.image, ...(studio.gallery || [])].filter(Boolean))];
  const rating = Number(studio.rating) || 0;

  const specs = [
    { icon: LuUsers, label: "Max capacity", value: `${studio.maxCapacity} people` },
    { icon: LuShieldCheck, label: "Security deposit", value: formatMoney(studio.securityDeposit) },
    { icon: LuMapPin, label: "Location", value: studio.location },
  ];

  return (
    <section className="page-container py-8 sm:py-10">
      <nav className="mb-5 text-sm text-base-content/60" aria-label="Breadcrumb">
        <Link href="/studios" className="hover:text-primary">
          Explore Studios
        </Link>
        <span className="mx-2">/</span>
        <span className="text-base-content">{studio.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="gallery-swiper relative aspect-[16/10] w-full overflow-hidden rounded-box border border-base-300 bg-base-200">
            <Swiper
              className="h-full"
              modules={[Navigation, Pagination, Keyboard]}
              navigation
              pagination={{ clickable: true }}
              keyboard
              loop={images.length > 1}
            >
              {images.map((src, i) => (
                <SwiperSlide key={src}>
                  <GallerySlide
                    src={src}
                    alt={`${studio.title}, photo ${i + 1}`}
                    category={studio.category}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <header>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-neutral border-0 font-medium">{studio.category}</span>
              <span className="flex items-center gap-2 text-sm text-base-content/70">
                <Stars value={rating} />
                {rating > 0
                  ? `${rating.toFixed(1)} (${studio.reviewCount} ${studio.reviewCount === 1 ? "review" : "reviews"})`
                  : "No reviews yet"}
              </span>
            </div>
            <h1 className="section-title mt-3">{studio.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-base-content/70">
              <LuMapPin className="h-4 w-4 shrink-0" />
              {studio.location}
            </p>
          </header>

          <section aria-labelledby="overview-title">
            <h2 id="overview-title" className="text-2xl font-bold">About this space</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-base-content/80">
              {studio.overview}
            </p>
          </section>

          <section aria-labelledby="specs-title">
            <h2 id="specs-title" className="text-2xl font-bold">Specifications</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex h-full flex-col gap-2 rounded-box border border-base-300 bg-base-100 p-4"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <dt className="text-xs uppercase tracking-wider text-base-content/60">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="amenities-title">
            <h2 id="amenities-title" className="text-2xl font-bold">Amenities</h2>
            {studio.amenities?.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2.5 text-sm">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-success/20 text-success">
                      <LuCheck className="h-4 w-4" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-base-content/70">
                The host has not listed any amenities yet.
              </p>
            )}
          </section>

          <section aria-labelledby="host-title">
            <h2 id="host-title" className="text-2xl font-bold">Your host</h2>
            <div className="mt-4 flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-xl font-bold text-primary-content">
                {(studio.ownerName || "?").charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{studio.ownerName}</p>
                <p className="truncate text-sm text-base-content/70">{studio.ownerEmail}</p>
                <p className="mt-1 text-xs text-base-content/50">
                  Listed{" "}
                  {new Date(studio.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </section>

          <ReviewSection studio={studio} onReviewed={refreshStudio} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
            <p className="font-display text-3xl font-bold">
              {formatMoney(studio.hourlyRate)}
              <span className="text-base font-normal text-base-content/60"> / hr</span>
            </p>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-base-content/70">Security deposit</dt>
                <dd className="font-medium">{formatMoney(studio.securityDeposit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-base-content/70">Max capacity</dt>
                <dd className="font-medium">{studio.maxCapacity} people</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={startBooking}
              disabled={isPending}
              className="btn btn-primary btn-lg w-full"
            >
              <LuCalendarCheck className="h-5 w-5" />
              Book Workspace Now
            </button>
            <p className="text-center text-xs text-base-content/60">
              Send a request in one step. The host confirms each booking.
            </p>
          </div>
        </aside>
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        studio={studio}
      />
    </section>
  );
}
