import PrivateRoute from "@/components/PrivateRoute";
import MyListingsView from "@/components/MyListingsView";

export const metadata = { title: "My Studio Listings" };

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <MyListingsView />
    </PrivateRoute>
  );
}
