"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuImagePlus, LuPlus, LuSave } from "react-icons/lu";
import { api } from "@/lib/api";
import { uploadToImgbb } from "@/lib/imgbb";
import { AMENITIES, CATEGORIES } from "@/lib/constants";
import { useAuth } from "./AuthProvider";

const MAX_FILE_MB = 8;

// Shared by Add New Studio (create) and Update Studio (edit).
export default function StudioForm({ studio }) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = Boolean(studio);

  const [form, setForm] = useState({
    title: studio?.title ?? "",
    category: studio?.category ?? CATEGORIES[0].value,
    hourlyRate: studio?.hourlyRate ?? "",
    securityDeposit: studio?.securityDeposit ?? "",
    maxCapacity: studio?.maxCapacity ?? "",
    location: studio?.location ?? "",
    image: studio?.image ?? "",
    gallery: (studio?.gallery ?? []).join("\n"),
    overview: studio?.overview ?? "",
  });
  const [amenities, setAmenities] = useState(studio?.amenities ?? []);
  const [customAmenity, setCustomAmenity] = useState("");
  const [uploading, setUploading] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Suggested amenities plus any custom ones already chosen.
  const amenityOptions = [
    ...AMENITIES,
    ...amenities.filter((a) => !AMENITIES.includes(a)),
  ];

  function toggleAmenity(name) {
    setAmenities((list) =>
      list.includes(name) ? list.filter((a) => a !== name) : [...list, name]
    );
  }

  function addCustomAmenity() {
    const name = customAmenity.trim();
    if (!name) return;
    if (name.length > 40) {
      toast.error("Amenity names must be 40 characters or fewer.");
      return;
    }
    setAmenities((list) => (list.includes(name) ? list : [...list, name]));
    setCustomAmenity("");
  }

  async function upload(e, target) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Images must be ${MAX_FILE_MB} MB or smaller.`);
      return;
    }

    setUploading(target);
    try {
      const url = await uploadToImgbb(file);
      if (target === "cover") {
        setForm((f) => ({ ...f, image: url }));
      } else {
        setForm((f) => ({
          ...f,
          gallery: f.gallery.trim() ? `${f.gallery.trim()}\n${url}` : url,
        }));
      }
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading("");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit || 0),
      maxCapacity: Number(form.maxCapacity),
      location: form.location.trim(),
      image: form.image.trim(),
      gallery: form.gallery.split("\n").map((s) => s.trim()).filter(Boolean),
      amenities,
      overview: form.overview.trim(),
    };

    setBusy(true);
    try {
      if (isEdit) {
        await api(`/studios/${studio._id}`, { method: "PUT", body: payload });
        toast.success("Studio updated successfully.");
      } else {
        await api("/studios", { method: "POST", body: payload });
        toast.success("Your studio is now listed on StudioSpace.");
      }
      router.push("/my-listings");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setBusy(false);
    }
  }

  const hostName = isEdit ? studio.ownerName : user?.name;
  const hostEmail = isEdit ? studio.ownerEmail : user?.email;

  const label = "text-sm font-medium";
  const field = "flex flex-col gap-1.5";

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-8 rounded-box border border-base-300 bg-base-100 p-5 sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className={`${field} md:col-span-2`}>
          <label htmlFor="title" className={label}>Studio title</label>
          <input
            id="title"
            value={form.title}
            onChange={set("title")}
            required
            minLength={3}
            maxLength={80}
            placeholder="e.g. North Light Cyc Studio"
            className="input w-full"
          />
        </div>

        <div className={field}>
          <label htmlFor="category" className={label}>Category</label>
          <select
            id="category"
            value={form.category}
            onChange={set("category")}
            className="select w-full"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.value}</option>
            ))}
          </select>
        </div>

        <div className={field}>
          <label htmlFor="location" className={label}>Location / address</label>
          <input
            id="location"
            value={form.location}
            onChange={set("location")}
            required
            minLength={3}
            maxLength={120}
            placeholder="Neighborhood, City, State"
            className="input w-full"
          />
        </div>

        <div className={field}>
          <label htmlFor="hourlyRate" className={label}>Hourly rate ($)</label>
          <input
            id="hourlyRate"
            type="number"
            min="1"
            step="0.01"
            value={form.hourlyRate}
            onChange={set("hourlyRate")}
            required
            placeholder="85"
            className="input w-full"
          />
        </div>

        <div className={field}>
          <label htmlFor="securityDeposit" className={label}>Security deposit ($)</label>
          <input
            id="securityDeposit"
            type="number"
            min="0"
            step="0.01"
            value={form.securityDeposit}
            onChange={set("securityDeposit")}
            placeholder="150"
            className="input w-full"
          />
        </div>

        <div className={field}>
          <label htmlFor="maxCapacity" className={label}>Max capacity (people)</label>
          <input
            id="maxCapacity"
            type="number"
            min="1"
            step="1"
            value={form.maxCapacity}
            onChange={set("maxCapacity")}
            required
            placeholder="10"
            className="input w-full"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className={`${field} md:col-span-2`}>
          <label htmlFor="image" className={label}>Cover image URL</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="image"
              value={form.image}
              onChange={set("image")}
              required
              placeholder="https://... or upload a file"
              className="input w-full"
            />
            <label className="btn btn-outline shrink-0">
              {uploading === "cover" ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <LuImagePlus className="h-4 w-4" />
              )}
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => upload(e, "cover")}
                disabled={Boolean(uploading)}
              />
            </label>
          </div>
          {form.image && (
            <img
              key={form.image}
              src={form.image}
              alt="Cover preview"
              className="mt-2 aspect-[4/3] w-full max-w-xs rounded-lg border border-base-300 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        <div className={`${field} md:col-span-2`}>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="gallery" className={label}>
              Gallery image URLs <span className="font-normal text-base-content/50">(optional, one per line, up to 6)</span>
            </label>
            <label className="btn btn-ghost btn-xs">
              {uploading === "gallery" ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <LuImagePlus className="h-4 w-4" />
              )}
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => upload(e, "gallery")}
                disabled={Boolean(uploading)}
              />
            </label>
          </div>
          <textarea
            id="gallery"
            value={form.gallery}
            onChange={set("gallery")}
            rows={3}
            placeholder="https://example.com/photo-2.jpg"
            className="textarea w-full"
          />
        </div>
      </div>

      <fieldset className={field}>
        <legend className={label}>Amenities</legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Amenities">
          {amenityOptions.map((name) => {
            const on = amenities.includes(name);
            return (
              <button
                key={name}
                type="button"
                aria-pressed={on}
                onClick={() => toggleAmenity(name)}
                className={`btn btn-sm ${on ? "btn-primary" : "btn-ghost border border-base-300"}`}
              >
                {name}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2 sm:max-w-md">
          <input
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomAmenity();
              }
            }}
            placeholder="Add your own amenity"
            aria-label="Add your own amenity"
            className="input input-sm w-full"
          />
          <button type="button" onClick={addCustomAmenity} className="btn btn-sm btn-outline">
            <LuPlus className="h-4 w-4" /> Add
          </button>
        </div>
      </fieldset>

      <div className={field}>
        <label htmlFor="overview" className={label}>Detailed overview</label>
        <textarea
          id="overview"
          value={form.overview}
          onChange={set("overview")}
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          placeholder="Describe the space, the equipment, house rules and what makes it great for creators."
          className="textarea w-full"
        />
        <p className="text-xs text-base-content/50">{form.overview.length} / 2000</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className={field}>
          <label htmlFor="hostName" className={label}>Host name</label>
          <input
            id="hostName"
            value={hostName ?? ""}
            readOnly
            className="input w-full cursor-not-allowed bg-base-200"
          />
        </div>
        <div className={field}>
          <label htmlFor="hostEmail" className={label}>Host email</label>
          <input
            id="hostEmail"
            value={hostEmail ?? ""}
            readOnly
            className="input w-full cursor-not-allowed bg-base-200"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary" disabled={busy || Boolean(uploading)}>
          {busy ? <span className="loading loading-spinner loading-sm" /> : <LuSave className="h-4 w-4" />}
          {isEdit ? "Save changes" : "List my studio"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => router.push("/my-listings")} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  );
}
