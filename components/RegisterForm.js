"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuCheck, LuCircle, LuUserPlus } from "react-icons/lu";
import { authClient } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/safe-redirect";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";

const RULES = [
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "length", label: "At least 6 characters", test: (p) => p.length >= 6 },
];

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function RegisterForm() {
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get("redirect"));
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const failing = RULES.filter((r) => !r.test(password));

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const photo = String(form.get("photo") || "").trim();

    setTouched(true);
    setError("");

    if (failing.length > 0) {
      const message = `Password needs: ${failing.map((r) => r.label.toLowerCase()).join(", ")}.`;
      setError(message);
      toast.error("Please choose a stronger password.");
      return;
    }
    if (photo && !isHttpUrl(photo)) {
      const message = "Photo URL must start with http:// or https://";
      setError(message);
      toast.error(message);
      return;
    }

    setBusy(true);
    try {
      const { error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photo || undefined,
      });
      if (authError) {
        const message = authError.message || "We could not create your account.";
        setError(message);
        toast.error(message);
        setBusy(false);
        return;
      }
      toast.success("Account created. Log in to start booking studios.");
      router.push(
        `/login${next !== "/" ? `?redirect=${encodeURIComponent(next)}` : ""}`
      );
    } catch {
      const message = "We could not reach the server. Check your connection and retry.";
      setError(message);
      toast.error(message);
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold">Create your StudioSpace account</h1>
      <p className="mt-2 text-sm text-base-content/70">
        Book creative spaces by the hour, or list your own and start hosting.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            autoComplete="name"
            placeholder="Your full name"
            className="input w-full"
          />
        </div>

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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="photo" className="text-sm font-medium">
            Photo URL <span className="font-normal text-base-content/50">(optional)</span>
          </label>
          <input
            id="photo"
            name="photo"
            type="url"
            autoComplete="photo"
            placeholder="https://example.com/your-photo.jpg"
            className="input w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <PasswordInput
            id="password"
            name="password"
            required
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setTouched(true);
            }}
          />
          <ul className="grid gap-1 text-xs" aria-label="Password requirements">
            {RULES.map((rule) => {
              const ok = rule.test(password);
              return (
                <li
                  key={rule.id}
                  className={`flex items-center gap-1.5 ${
                    ok
                      ? "text-success"
                      : touched
                        ? "text-error"
                        : "text-base-content/60"
                  }`}
                >
                  {ok ? <LuCheck className="h-3.5 w-3.5" /> : <LuCircle className="h-3.5 w-3.5" />}
                  {rule.label}
                </li>
              );
            })}
          </ul>
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
            <LuUserPlus className="h-4 w-4" />
          )}
          Register
        </button>
      </form>

      <div className="divider my-5 text-xs text-base-content/50">OR</div>
      <GoogleButton next={next} label="Sign up with Google" />

      <p className="mt-6 text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link
          href={`/login${next !== "/" ? `?redirect=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-secondary hover:underline dark:text-primary"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
