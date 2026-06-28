"use client";

import { createContext, FC, PropsWithChildren, useMemo } from "react";

import { instantiateFunctionMembers, SerializedFunctions } from "@/lib/utils";
import {
  createI18nStore,
  i18n,
  LanguageCode,
  LanguageMap,
} from "@/translation/index";

export const I18nContext = createContext(i18n);

type I18nProviderProps = PropsWithChildren<{
  language: LanguageCode;
  languageMap: SerializedFunctions<LanguageMap>;
}>;

export const I18nProvider: FC<I18nProviderProps> = ({
  language,
  languageMap,
  children,
}) => {
  const i18n = useMemo(
    () =>
      createI18nStore(
        language,
        instantiateFunctionMembers<LanguageMap>(languageMap),
      ),
    [language, languageMap],
  );

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
};
