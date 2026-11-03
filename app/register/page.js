import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";
import { PageSpinner } from "@/components/Skeletons";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <section className="page-container flex justify-center py-12 sm:py-16">
      <Suspense fallback={<PageSpinner label="Loading..." />}>
        <RegisterForm />
      </Suspense>
    </section>
  );
}
