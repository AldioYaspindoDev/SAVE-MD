import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaults | Save Your Resource",
  description: "Save Your Resource Like markdown, prompt and snippets",
  icons: {
    icon: "/Images/VaultsLogo.jpeg",
    shortcut: "/Images/VaultsLogo.jpeg",
    apple: "/Images/VaultsLogo.jpeg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} font-mono h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
