import { PageSpinner } from "@/components/Skeletons";

// Shown during route transitions and while a page streams in.
export default function Loading() {
  return <PageSpinner label="Setting up the lights..." />;
}
