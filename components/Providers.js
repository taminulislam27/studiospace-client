"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      themes={["light", "dark"]}
    >
      {children}
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}
