import type { Metadata } from "next";
import { ReactNode } from "react";
import NextAuthSessionProvider from "./SessionProvider";

export const metadata: Metadata = {
  title: "Cine Local",
  description: "Find movies, host screenings, and track your watchlist.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#000" }}>
      <NextAuthSessionProvider>
        {children}
      </NextAuthSessionProvider>
      </body>
    </html>
  );
}
