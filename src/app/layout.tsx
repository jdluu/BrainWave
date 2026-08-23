import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "./ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrainWave - AI note-taking",
    template: "%s | BrainWave",
  },
  description:
    "Take notes, then ask an AI assistant questions about them. Notes are embedded and searched locally; answers stream from a free Groq model.",
  keywords: ["notes", "AI", "note-taking", "RAG", "Next.js", "portfolio"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#101418" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.variable} font-sans`}>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
