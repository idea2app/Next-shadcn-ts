import "./globals.css";

import { SerwistProvider } from "@serwist/next/react";
import { encodeFunctions } from "mobx-i18n";
import type { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";

import { I18nProvider } from "@/components/I18nProvider";
import { MainNav } from "@/components/MainNav";
import { description, siteName } from "@/config";
import { LanguageCode } from "@/translation";
import { loadSSRI18nFromRequest } from "@/translation/server";

export const metadata: Metadata = {
  applicationName: siteName,
  description,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  const { currentLanguage, currentMap } = await loadSSRI18nFromRequest({
    language: lang as LanguageCode,
  });

  return (
    <html lang={currentLanguage}>
      <body className="antialiased">
        <SerwistProvider swUrl="/sw.js">
          <I18nProvider
            language={currentLanguage}
            languageMap={JSON.stringify(currentMap, encodeFunctions)}
          >
            <MainNav />
            {children}
          </I18nProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
