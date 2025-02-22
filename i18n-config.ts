export const i18n = {
  defaultLocale: "en",
  locales: ["en", "cn", "tw"],
} as const;

export const LanguageMap = {
  en: "English",
  cn: "简体中文",
  tw: "繁體中文",
} as const;

export type Locale = (typeof i18n)["locales"][number];
