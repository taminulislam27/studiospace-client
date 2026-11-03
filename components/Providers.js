"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./AuthProvider";

export const THEMES = { light: "studiolight", dark: "studiodark" };

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme={THEMES.light}
      themes={[THEMES.light, THEMES.dark]}
      enableSystem={false}
    >
      <AuthProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "var(--color-base-100)",
              color: "var(--color-base-content)",
              border: "1px solid var(--color-base-300)",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
