import type { LanguageCode } from "./index";

export const LanguageName: Record<LanguageCode, string> = {
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  "en-US": "English",
};

export const locales = Object.keys(LanguageName) as LanguageCode[];

export const defaultLocale: LanguageCode = "en-US";
