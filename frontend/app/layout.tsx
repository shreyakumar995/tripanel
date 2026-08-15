import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TriPanel",
  description: "AI Mock Interview Panel with Multi-Rater Scoring",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
            TriPanel
          </h1>
          <p className="mt-0.5 text-sm text-zinc-400">
            AI Mock Interview Panel with Multi-Rater Scoring
          </p>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
