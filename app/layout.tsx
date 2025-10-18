import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const font = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  openGraph: {
    title: 'Intakely - Easy Digital Intake Forms',
    description: 'No more clipboards. Create and share digital intake forms in minutes.',
    url: 'https://qr-intake.vercel.app',
    siteName: 'Intakely',
    images: [
      {
        url: 'https://qr-intake.vercel.app/og.webp',
        width: 1920,
        height: 1163,
      },
    ],
  },
  title: "Intakely - Easy Digital Intake Forms",
  description: "No more clipboards. Create and share digital intake forms in minutes.",
  keywords: ['Healthcare', 'SaaS', 'AI', 'Patient Intake', 'Triage', 'QR Code Patient Intake', 'Healthcare Automation', 'Healthcare Software', 'Healthcare Technology', 'Healthcare Solutions', 'Healthcare Services', 'Healthcare Products', 'Healthcare Equipment', 'Healthcare Supplies', 'Healthcare Services', 'Healthcare Products', 'Healthcare Equipment', 'Healthcare Supplies'],
  authors: [{ name: 'Brian Pluhar', url: 'https://brianpluhar.com' }],
  creator: 'Brian Pluhar',
  publisher: 'Brian Pluhar',
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
          <ConvexClientProvider>{children}<SpeedInsights /></ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
