import "@fontsource-variable/vazirmatn";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,
  applicationName: siteConfig.name,

  authors: [
    {
      name: siteConfig.creator,
    },
  ],

  creator: siteConfig.creator,
  publisher: siteConfig.creator,

  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={siteConfig.language} dir="rtl">
      <body>{children}</body>
    </html>
  );
}