import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "StudioSpace | Book Creative Studios",
  description:
    "StudioSpace is a peer-to-peer marketplace to discover and book photo studios, sound stages, podcast rooms and music suites.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-base-100 text-base-content antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
