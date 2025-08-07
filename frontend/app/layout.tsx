import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { Toaster } from "sonner";
import { QueryProviders } from "../providers/queryProvider";
import { AuthProvider } from "@/context/AuthContext";
import NextTopLoader from "nextjs-toploader";
export const metadata: Metadata = {
  title: "Dejen RBDC",
  description: "Dynamic role based access using Next.JS and Express.JS",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <NextTopLoader color="oklch(0.705 0.213 47.604)" />
        <QueryProviders>
          <AuthProvider>{children}</AuthProvider>
        </QueryProviders>
        <Toaster />
      </body>
    </html>
  );
}
