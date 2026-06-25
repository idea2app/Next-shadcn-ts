"use client";

import { configure } from "mobx";
import { TranslationModel } from "mobx-i18n";

import enUS from "./translation/en-US";
import zhCN from "./translation/zh-CN";
import zhTW from "./translation/zh-TW";

configure({ enforceActions: "never" });

export const i18n = new TranslationModel({
  "en-US": enUS,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
});
