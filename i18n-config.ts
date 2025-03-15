export const i18n = {
  defaultLocale: "en-US",
  locales: ["en-US", "zh-CN", "zh-TW"],
} as const;

export const LanguageMap = {
  "en-US": "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
} as const;

export type Locale = (typeof i18n)["locales"][number];
