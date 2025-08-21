import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Commissioner } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const font = Commissioner({ subsets: ["latin"] });

export const metadata: Metadata = {
  openGraph: {
    title: "Triager - Automated Patient Intake for Healthcare Teams",
    description:
      "Automated patient intake for healthcare teams and practices 2.",
  },
  title: "Triager - Automated Patient Intake",
  description: "Automated patient intake for healthcare teams and practices.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b1217" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1217" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <Analytics />
        <body
          className={`${font.className} antialiased bg-[#0b1217]`}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
