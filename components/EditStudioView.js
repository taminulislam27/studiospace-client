"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LuLock, LuSearchX } from "react-icons/lu";
import { api } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import StudioForm from "./StudioForm";
import EmptyState from "./EmptyState";
import { PageSpinner } from "./Skeletons";

export default function EditStudioView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [state, setState] = useState({ status: "loading", studio: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", studio: null });
    api(`/studios/${id}`, { signal: controller.signal })
      .then((studio) => setState({ status: "ready", studio }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ status: "missing", studio: null });
      });
    return () => controller.abort();
  }, [id]);

  if (state.status === "loading") return <PageSpinner label="Loading your listing..." />;

  if (state.status === "missing") {
    return (
      <section className="page-container py-16">
        <EmptyState
          icon={LuSearchX}
          title="We could not find that studio"
          text="It may have been removed, or the link is incorrect."
          actionHref="/my-listings"
          actionLabel="Back to My Listings"
        />
      </section>
    );
  }

  if (state.studio.ownerEmail !== user?.email) {
    return (
      <section className="page-container py-16">
        <EmptyState
          icon={LuLock}
          title="You can only edit your own studios"
          text="This listing belongs to another host."
          actionHref="/my-listings"
          actionLabel="Back to My Listings"
        />
      </section>
    );
  }

  return (
    <section className="page-container py-12 sm:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="section-eyebrow">Update listing</p>
        <h1 className="section-title mt-2">Edit {state.studio.title}</h1>
        <p className="section-lead mt-3">
          Changes go live as soon as you save. Host details stay locked to your account.
        </p>
      </div>
      <div className="max-w-4xl">
        <StudioForm studio={state.studio} />
      </div>
    </section>
  );
}
