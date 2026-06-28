import { toJS } from "mobx";
import { headers } from "next/headers";

import { SerializedFunctions, serializeFunctionMembers } from "@/lib/utils";

import { createI18nStore, LanguageMap, loadSSRLanguage } from "./index";

export const loadSSRI18nFromRequest = async (
  query?: Record<string, string | string[] | undefined>,
) => {
  const headerStore = await headers();

  const { language, languageMap } = await loadSSRLanguage({
    cookie: headerStore.get("cookie") ?? "",
    acceptLanguage: headerStore.get("accept-language") ?? "",
    query,
  });

  const store = createI18nStore(language, languageMap);

  return Object.assign(store, {
    currentMap: serializeFunctionMembers(toJS(store.currentMap)),
  }) as Omit<typeof store, "currentMap"> & {
    currentMap: SerializedFunctions<LanguageMap>;
  };
};
