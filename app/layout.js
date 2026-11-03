import "./globals.css";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata = {
  title: {
    default: "StudioSpace | Book Creative Studios by the Hour",
    template: "%s | StudioSpace",
  },
  description:
    "StudioSpace is a peer-to-peer marketplace to discover and book photo studios, sound stages, podcast rooms and music suites by the hour.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-base-100 text-base-content antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
