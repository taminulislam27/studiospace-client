"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { issueJwt } from "@/lib/jwt-client";
import { safeRedirect } from "@/lib/safe-redirect";
import { useAuth } from "./AuthProvider";
import { PageSpinner } from "./Skeletons";

// Landing page after Google sign-in: set the JWT cookie, then continue.
export default function CallbackHandler() {
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get("redirect"));
  const { user, isPending } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (isPending || ran.current) return;
    ran.current = true;

    (async () => {
      if (user) {
        await issueJwt();
        toast.success(`Signed in as ${user.name || user.email}`);
        router.replace(next);
      } else {
        toast.error("Google sign-in did not complete. Please try again.");
        router.replace("/login");
      }
    })();
  }, [isPending, user, next, router]);

  return <PageSpinner label="Finishing sign-in..." />;
}
