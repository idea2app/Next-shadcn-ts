"use client";

import dynamic from "next/dynamic";
import { observer } from "mobx-react";
import { FC } from "react";

import { i18n } from "@/translation";

const HTMLEditor = dynamic(
  () =>
    import("@/components/ui/mobx-restful-shadcn/editor").then(
      ({ Editor }) => Editor,
    ),
  { ssr: false },
);

const EditorPage: FC = observer(() => {
  const title = `HTML ${i18n.t("editor")}`;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="my-4 text-center text-2xl font-semibold">{title}</h1>

      <HTMLEditor defaultValue="Hello, HTML!" onChange={console.info} />
    </main>
  );
});

export default EditorPage;
