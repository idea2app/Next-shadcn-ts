"use client";

import { observer } from "mobx-react";
import dynamic from "next/dynamic";
import { FC, useContext } from "react";

import { I18nContext } from "@/components/I18nProvider";

const HTMLEditor = dynamic(
  () =>
    import("@/components/ui/mobx-restful-shadcn/editor").then(
      ({ Editor }) => Editor,
    ),
  { ssr: false },
);

const EditorPage: FC = observer(() => {
  const { t } = useContext(I18nContext);
  const title = `HTML ${t("editor")}`;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="my-4 text-center text-2xl font-semibold">{title}</h1>

      <HTMLEditor defaultValue="Hello, HTML!" />
    </main>
  );
});

export default EditorPage;
