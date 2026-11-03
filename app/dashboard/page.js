import PrivateRoute from "@/components/PrivateRoute";
import DashboardView from "@/components/DashboardView";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardView />
    </PrivateRoute>
  );
}
