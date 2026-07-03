import "./globals.css";

import { encodeFunctions } from "mobx-i18n";
import { PropsWithChildren } from "react";

import { I18nProvider } from "@/components/I18nProvider";
import { MainNav } from "@/components/MainNav";
import { LanguageCode } from "@/translation";
import { loadSSRI18nFromRequest } from "@/translation/server";

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
        <I18nProvider
          language={currentLanguage}
          languageMap={JSON.stringify(currentMap, encodeFunctions)}
        >
          <MainNav />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
