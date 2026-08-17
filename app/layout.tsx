import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Madni Education Platform",
  description: "Advanced Institutional & Alumni Management System for Madni Education Trust",
  manifest: "/manifest.json",
  themeColor: "#1b4a50",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Madni Portal",
  },
  icons: {
    icon: "/madni-logo.png",
    shortcut: "/madni-logo.png",
    apple: "/madni-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased font-outfit`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1b4a50" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/madni-logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50">
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
