"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { LuAperture } from "react-icons/lu";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Decorative art is drawn in SVG/CSS so the hero never depends on a remote image.
function ApertureArt() {
  return (
    <div className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 text-white/25 md:block lg:-right-10">
      <LuAperture
        className="animate-spin-slow h-[30rem] w-[30rem] lg:h-[36rem] lg:w-[36rem]"
        strokeWidth={0.35}
      />
    </div>
  );
}

const BAR_HEIGHTS = [38, 62, 90, 54, 100, 72, 46, 84, 58, 96, 66, 40, 78, 52, 88, 44];

function WaveArt() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-1/2 items-center justify-center gap-2 pr-10 md:flex">
      {BAR_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="animate-bar-pulse w-2.5 rounded-full bg-white/30"
          style={{ height: `${h}%`, maxHeight: "22rem", animationDelay: `${i * 0.11}s` }}
        />
      ))}
    </div>
  );
}

function BeamArt() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      <div
        className="animate-beam-sway absolute -top-10 right-[28%] h-[130%] w-56 origin-top"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0))",
          clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
        }}
      />
      <div
        className="animate-beam-sway absolute -top-10 right-[10%] h-[130%] w-56 origin-top"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,190,90,0.5), rgba(255,190,90,0))",
          clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
          animationDelay: "-3s",
        }}
      />
      <div className="absolute bottom-0 right-[8%] h-24 w-[34rem] rounded-[50%] bg-white/10 blur-2xl" />
    </div>
  );
}

const SLIDES = [
  {
    eyebrow: "Photo studios",
    title: "Find the room where your next shoot happens",
    text: "From north-light cyc walls to seamless paper sweeps, book verified photo studios by the hour with the price and deposit shown up front.",
    background:
      "radial-gradient(60% 80% at 78% 40%, oklch(70% 0.17 60 / 0.55), transparent 70%), linear-gradient(135deg, oklch(24% 0.04 55), oklch(14% 0.02 40))",
    Art: ApertureArt,
  },
  {
    eyebrow: "Podcast rooms and music suites",
    title: "Record in rooms built to sound right",
    text: "Treated podcast lounges and recording suites with mics, monitors and booths on site, ready for a two-hour session or a full-day tracking run.",
    background:
      "radial-gradient(55% 80% at 80% 50%, oklch(55% 0.12 205 / 0.55), transparent 70%), linear-gradient(135deg, oklch(22% 0.05 245), oklch(13% 0.03 230))",
    Art: WaveArt,
  },
  {
    eyebrow: "Own a studio?",
    title: "Put your space to work between bookings",
    text: "List your studio, set your hourly rate and security deposit, and let fellow creators book open slots while you stay in control of every reservation.",
    background:
      "radial-gradient(50% 70% at 70% 0%, oklch(65% 0.18 30 / 0.5), transparent 70%), linear-gradient(135deg, oklch(18% 0.02 30), oklch(11% 0.01 30))",
    Art: BeamArt,
  },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured highlights" className="relative">
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
      >
        {SLIDES.map(({ eyebrow, title, text, background, Art }) => (
          <SwiperSlide key={title}>
            <div
              className="relative flex min-h-[34rem] items-center overflow-hidden text-white sm:min-h-[38rem]"
              style={{ background }}
            >
              <Art />
              <div className="page-container relative z-10 py-20">
                <div className="max-w-2xl">
                  <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/90">
                    {eyebrow}
                  </span>
                  <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
                    {title}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                    {text}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/studios" className="btn btn-primary btn-lg">
                      Explore Studios
                    </Link>
                    <Link
                      href="/add-studio"
                      className="btn btn-lg border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
