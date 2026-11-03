"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { clearJwt, issueJwt } from "@/lib/jwt-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const user = session?.user ?? null;
  const email = user?.email ?? null;
  const syncedFor = useRef(null);
  const loggingOut = useRef(false);

  // Keep the HTTPOnly JWT cookie in step with the BetterAuth session, so a
  // returning user (or a Google sign-in) always has a token for the Express API.
  useEffect(() => {
    if (!email) {
      syncedFor.current = null;
      return;
    }
    if (syncedFor.current !== email) {
      syncedFor.current = email;
      issueJwt();
    }
  }, [email]);

  const logout = useCallback(async () => {
    loggingOut.current = true;
    try {
      await clearJwt();
      const { error } = await authClient.signOut();
      if (error) {
        toast.error("We could not log you out. Please try again.");
        return;
      }
      toast.success("Logged out. See you at the next shoot!");
      router.push("/");
    } catch {
      toast.error("We could not log you out. Please try again.");
    } finally {
      setTimeout(() => {
        loggingOut.current = false;
      }, 1500);
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isPending, logout, loggingOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
