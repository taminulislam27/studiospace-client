"use client";

import Link from "next/link";
import { useState } from "react";
import { LuMapPin, LuStar } from "react-icons/lu";
import CategoryIcon from "./CategoryIcon";

export default function StudioCard({ studio }) {
  const [broken, setBroken] = useState(false);
  const showImage = studio.image && !broken;
  const ratingValue = Number(studio.rating);
  const rating = ratingValue > 0 ? ratingValue.toFixed(1) : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-base-200">
        {showImage ? (
          <img
            src={studio.image}
            alt={studio.title}
            loading="lazy"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/25 text-primary">
            <CategoryIcon category={studio.category} className="h-14 w-14" />
          </div>
        )}
        <span className="badge badge-neutral absolute left-3 top-3 border-0 font-medium">
          {studio.category}
        </span>
        <span className="badge absolute right-3 top-3 gap-1 border-0 bg-base-100/95 font-semibold text-base-content">
          <LuStar className="h-3.5 w-3.5 fill-primary text-primary" />
          {rating ?? "New"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-1 text-lg font-semibold">{studio.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-base-content/70">
          <LuMapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="font-display text-xl font-bold">
            ${studio.hourlyRate}
            <span className="text-sm font-normal text-base-content/60"> / hr</span>
          </p>
          <Link href={`/studios/${studio._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
