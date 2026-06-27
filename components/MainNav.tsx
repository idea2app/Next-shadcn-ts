"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

import { siteName } from "@/config";
import { I18nContext } from "@/translation/context";
import {
  defaultLocale,
  LanguageCode,
  LanguageName,
  locales,
} from "@/translation/index";

export const MainNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const i18n = useContext(I18nContext);
  const { t } = i18n;
  const currentLanguage = i18n.currentLanguage || defaultLocale;

  const navLinks = [
    { href: `/${currentLanguage}`, label: siteName },
    {
      href: `/${currentLanguage}/pagination`,
      label: t("pagination") as string,
    },
    {
      href: `/${currentLanguage}/scroll-list`,
      label: t("scroll_list") as string,
    },
    { href: `/${currentLanguage}/editor`, label: t("editor") as string },
  ];

  const switchLanguage = (language: LanguageCode) => {
    const segments = pathname.split("/").filter(Boolean);

    if (locales.includes(segments[0] as LanguageCode)) segments[0] = language;
    else segments.unshift(language);

    router.push(`/${segments.join("/")}`);
  };

  return (
    <header className="border-b px-4 py-3">
      <div className="container mx-auto flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:bg-accent hover:text-accent-foreground rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <label className="flex items-center gap-2 text-sm font-medium">
          <span>{t("language") as string}</span>
          <select
            className="rounded-md border bg-transparent px-2 py-1"
            value={currentLanguage}
            onChange={({ currentTarget }) =>
              switchLanguage(currentTarget.value as LanguageCode)
            }
          >
            {locales.map((language) => (
              <option key={language} value={language}>
                {LanguageName[language]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
};
