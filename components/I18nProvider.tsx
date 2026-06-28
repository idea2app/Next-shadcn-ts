"use client";

import { TranslationMap } from "mobx-i18n";
import { createContext, FC, PropsWithChildren, useMemo } from "react";

import {
  createI18nStore,
  i18n,
  LanguageCode,
  TranslationKey,
} from "@/translation/index";

export const I18nContext = createContext(i18n);

type I18nProviderProps = PropsWithChildren<{
  language: LanguageCode;
  languageMap: TranslationMap<TranslationKey>;
}>;

export const I18nProvider: FC<I18nProviderProps> = ({
  language,
  languageMap,
  children,
}) => {
  const i18n = useMemo(
    () => createI18nStore(language, languageMap),
    [language, languageMap],
  );

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
};
