import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import { PageSpinner } from "@/components/Skeletons";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <section className="page-container flex justify-center py-12 sm:py-16">
      <Suspense fallback={<PageSpinner label="Loading..." />}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
