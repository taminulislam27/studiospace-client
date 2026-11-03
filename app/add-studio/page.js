import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";

export const metadata = { title: "Add New Studio" };

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <section className="page-container py-12 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="section-eyebrow">Host your space</p>
          <h1 className="section-title mt-2">Add a new studio</h1>
          <p className="section-lead mt-3">
            Tell creators what your room offers. You can update or remove the
            listing at any time from My Studio Listings.
          </p>
        </div>
        <div className="max-w-4xl">
          <StudioForm />
        </div>
      </section>
    </PrivateRoute>
  );
}
