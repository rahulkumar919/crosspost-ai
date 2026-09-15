import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CrossPost AI",
    template: "%s · CrossPost AI",
  },
  description: "Publish your content to every platform, instantly — powered by AI.",
  keywords: ["cross-posting", "social media", "AI", "YouTube", "Instagram", "LinkedIn"],
  // Google Search Console domain verification — set GOOGLE_SITE_VERIFICATION env var on Vercel
  // to verify domain ownership for YouTube OAuth consent screen approval.
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),

  // ── PWA / App metadata ────────────────────────────────────────────────
  applicationName: "CrossPost AI",
  appleWebApp: {
    capable: true,
    title: "CrossPost AI",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png" },
    ],
    shortcut: "/favicon.ico",
  },
};

/**
 * Viewport export (separate from metadata per Next.js 14+ recommendation).
 * Sets theme-color for Chrome mobile address bar and viewport-fit for notched devices.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#6C5CE7" },
    { media: "(prefers-color-scheme: light)", color: "#6C5CE7" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased font-sans dark`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

