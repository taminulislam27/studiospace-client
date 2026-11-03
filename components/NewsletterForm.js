"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { LuSend } from "react-icons/lu";
import { api } from "@/lib/api";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      await api("/newsletter", { method: "POST", body: { email: value } });
      toast.success("Thanks for subscribing to StudioSpace updates.");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@studio.com"
        className="input w-full"
        autoComplete="email"
      />
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <LuSend className="h-4 w-4" />
        )}
        Subscribe
      </button>
    </form>
  );
}
