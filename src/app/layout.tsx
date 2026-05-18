import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/shared/client-layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Era OS - AI-Powered Cybersecurity Roadmap",
    template: "%s | Era OS",
  },
  description: "Your AI-powered roadmap operating system for the Hacker Era King cybersecurity journey. Track tasks, gain XP, and progress through structured learning phases.",
  keywords: ["cybersecurity", "roadmap", "learning", "pentesting", "AI mentor", "task tracking", "XP system"],
  authors: [{ name: "Tawhid" }],
  creator: "Era OS",
  publisher: "Era OS",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Era OS',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Era OS",
    title: "Era OS - AI-Powered Cybersecurity Roadmap",
    description: "Your AI-powered roadmap operating system for the Hacker Era King cybersecurity journey.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Era OS - AI-Powered Cybersecurity Roadmap",
    description: "Your AI-powered roadmap operating system for the Hacker Era King cybersecurity journey.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
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
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-zinc-200">
        <ClientLayout>{children}</ClientLayout>
        <div className="cyber-bg" />
      </body>
    </html>
  );
}