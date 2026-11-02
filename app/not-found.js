import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-7xl font-extrabold text-primary">404</p>
      <h1 className="text-2xl font-bold">This set is empty</h1>
      <p className="max-w-md text-base-content/70">
        The page you are looking for has wrapped and left the studio.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Home
      </Link>
    </main>
  );
}
