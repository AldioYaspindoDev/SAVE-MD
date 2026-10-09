import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import {
  APP_NAME,
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_KEYWORDS,
  SITE_URL,
  THEME_COLOR,
} from "@/lib/site";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} | Never write it twice.`,
    template: `%s | ${APP_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: SITE_KEYWORDS,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    locale: "id_ID",
    alternateLocale: ["en_US"],
    title: `${APP_NAME} — Snippet, Markdown & Prompt AI dalam Satu Tempat`,
    description: SITE_DESCRIPTION_EN,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Snippet, Markdown & Prompt AI dalam Satu Tempat`,
    description: SITE_DESCRIPTION_EN,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jetbrainsMono.variable} font-mono h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
