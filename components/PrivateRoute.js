"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { PageSpinner } from "./Skeletons";

export default function PrivateRoute({ children }) {
  const { user, isPending, loggingOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !user && !loggingOut.current) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, user, pathname, router, loggingOut]);

  if (isPending || !user) return <PageSpinner label="Checking your session..." />;
  return children;
}
