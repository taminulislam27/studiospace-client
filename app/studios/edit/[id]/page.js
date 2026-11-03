import PrivateRoute from "@/components/PrivateRoute";
import EditStudioView from "@/components/EditStudioView";

export const metadata = { title: "Update Studio" };

export default function EditStudioPage() {
  return (
    <PrivateRoute>
      <EditStudioView />
    </PrivateRoute>
  );
}
