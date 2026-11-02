import ServerStatus from "@/components/ServerStatus";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold">StudioSpace</h1>
      <p className="text-base-content/70">
        Peer-to-peer creative workspace and production studio sharing platform.
        Phase 0 setup is running.
      </p>
      <ThemeToggle />
      <ServerStatus />
    </main>
  );
}
