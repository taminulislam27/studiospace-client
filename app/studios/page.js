import { Suspense } from "react";
import StudiosExplorer from "@/components/StudiosExplorer";
import { PageSpinner } from "@/components/Skeletons";

export const metadata = { title: "Explore Studios" };

export default function StudiosPage() {
  return (
    <Suspense fallback={<PageSpinner label="Loading studios..." />}>
      <StudiosExplorer />
    </Suspense>
  );
}
