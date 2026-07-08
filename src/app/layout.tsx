import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open People Search — Free People Search Aggregator",
  description:
    "Search for people across multiple public sources simultaneously. Free, open, and source-attributed. Aggregates TruePeopleSearch, FastPeopleSearch, and FamilyTreeNow.",
  keywords: [
    "people search",
    "free people search",
    "person lookup",
    "public records",
    "people finder",
    "TruePeopleSearch",
    "FastPeopleSearch",
    "FamilyTreeNow",
  ],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔍</text></svg>",
  },
  openGraph: {
    title: "Open People Search",
    description: "Free, open people search aggregator with source attribution.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}