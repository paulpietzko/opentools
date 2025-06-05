import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenTools - Simple Web-Based Utilities",
  description:
    "An open-source collection of simple, useful web-based tools. Fast, lightweight, and privacy-friendly utilities for developers and designers.",
  keywords:
    "web tools, utilities, open source, developer tools, image resize, diff checker",
  authors: [{ name: "Paul Pietzko" }],
  openGraph: {
    title: "OpenTools - Simple Web-Based Utilities",
    description:
      "Fast, lightweight, and privacy-friendly web tools for developers and designers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
