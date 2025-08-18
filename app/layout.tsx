import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  openGraph: { 
  title: "Triager - Automated Patient Intake for Healthcare Teams",
  description: "Automated patient intake for healthcare teams and practices 2.",
  },
  title: "Triager - Automated Patient Intake",
  description: "Automated patient intake for healthcare teams and practices.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0b1217' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1217' },
  ],
}

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
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b1217]`}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
