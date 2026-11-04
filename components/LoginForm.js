"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { LuLogIn } from "react-icons/lu";
import { authClient } from "@/lib/auth-client";
import { issueJwt } from "@/lib/jwt-client";
import { safeRedirect } from "@/lib/safe-redirect";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";
import { useAuth } from "./AuthProvider";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeRedirect(params.get("redirect"));
  const googleFailed = params.get("error") === "google";
  const { user, isPending } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(
    googleFailed ? "Google sign-in was cancelled or failed. Please try again." : ""
  );
  const forgotRef = useRef(null);

  useEffect(() => {
    if (!isPending && user && !busy) router.replace(next);
  }, [isPending, user, busy, next, router]);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    setError("");
    setBusy(true);
    try {
      const { error: authError } = await authClient.signIn.email({ email, password });
      if (authError) {
        const message = authError.message || "Incorrect email or password.";
        setError(message);
        toast.error(message);
        setBusy(false);
        return;
      }
      await issueJwt();
      toast.success("Welcome back to StudioSpace!");
      router.replace(next);
    } catch {
      const message = "We could not reach the server. Check your connection and retry.";
      setError(message);
      toast.error(message);
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold">Log in to StudioSpace</h1>
      <p className="mt-2 text-sm text-base-content/70">
        Pick up where you left off: your bookings and listings are waiting.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate={false}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@studio.com"
            className="input w-full"
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Your password"
        />

        <div className="-mt-1 flex justify-end">
          <button
            type="button"
            onClick={() => forgotRef.current?.showModal()}
            className="text-sm font-medium text-secondary hover:underline dark:text-primary"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <LuLogIn className="h-4 w-4" />
          )}
          Login
        </button>
      </form>

      <div className="divider my-5 text-xs text-base-content/50">OR</div>
      <GoogleButton next={next} />

      <p className="mt-6 text-center text-sm text-base-content/70">
        New to StudioSpace?{" "}
        <Link
          href={`/register${next !== "/" ? `?redirect=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-secondary hover:underline dark:text-primary"
        >
          Create an account
        </Link>
      </p>

      <dialog ref={forgotRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Password reset is not available yet</h3>
          <p className="py-3 text-sm text-base-content/70">
            Self-service password reset is not part of this release. Sign in
            with the account you registered, continue with Google, or create a
            new account in under a minute.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
            <Link href="/register" className="btn btn-primary">
              Create account
            </Link>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close dialog">close</button>
        </form>
      </dialog>
    </div>
  );
}
