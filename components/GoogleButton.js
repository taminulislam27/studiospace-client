"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function GoogleButton({ next = "/", label = "Continue with Google" }) {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `/auth/callback?redirect=${encodeURIComponent(next)}`,
        errorCallbackURL: "/login?error=google",
      });
      if (error) {
        toast.error(error.message || "Google sign-in could not start.");
        setBusy(false);
      }
    } catch {
      toast.error("Google sign-in could not start. Check your connection.");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="btn w-full border-base-300 bg-base-100"
    >
      {busy ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        <FcGoogle className="h-5 w-5" />
      )}
      {label}
    </button>
  );
}
