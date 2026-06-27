"use client";

import { TranslationMap } from "mobx-i18n";
import { PropsWithChildren, useMemo } from "react";

import { I18nContext } from "@/translation/context";
import {
  createI18nStore,
  LanguageCode,
  TranslationKey,
} from "@/translation/index";

interface I18nProviderProps extends PropsWithChildren {
  language: LanguageCode;
  languageMap: TranslationMap<TranslationKey>;
}

export const I18nProvider = ({
  language,
  languageMap,
  children,
}: I18nProviderProps) => {
  const i18n = useMemo(
    () => createI18nStore(language, languageMap),
    [language, languageMap],
  );

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
};
