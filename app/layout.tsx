import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import ClientWrapper from "@/utils/ClientWrapper";
import ClientThemeWrapper from "@/utils/ClientThemeWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'MyStore – Your One‑Stop Shop',
  description: 'Browse top-quality products and shop effortlessly on MyStore.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}>
        <ClientWrapper>
          <ClientThemeWrapper />
          <Header />
          <Navigation />
          <main className="flex flex-1">
            <div className="flex-1">{children}</div>
          </main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  );
}
