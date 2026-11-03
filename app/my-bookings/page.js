import PrivateRoute from "@/components/PrivateRoute";
import MyBookingsView from "@/components/MyBookingsView";

export const metadata = { title: "My Bookings" };

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <MyBookingsView />
    </PrivateRoute>
  );
}
