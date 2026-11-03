import { Suspense } from "react";
import CallbackHandler from "@/components/CallbackHandler";
import { PageSpinner } from "@/components/Skeletons";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<PageSpinner label="Finishing sign-in..." />}>
      <CallbackHandler />
    </Suspense>
  );
}
