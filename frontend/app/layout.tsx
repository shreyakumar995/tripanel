import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col bg-background font-sans text-text-primary">
        <header className="border-b border-border-subtle bg-surface px-6 py-4">
          <h1 className="font-heading text-lg font-semibold tracking-tight text-text-primary">
            TriPanel
          </h1>
          <p className="mt-0.5 text-sm text-text-muted">
            AI Mock Interview Panel with Multi-Rater Scoring
          </p>
        </header>
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
