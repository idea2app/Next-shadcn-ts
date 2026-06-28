"use client";

import { observer } from "mobx-react";
import { FC, useContext } from "react";

import { I18nContext } from "@/components/I18nProvider";
import { ScrollList } from "@/components/ui/mobx-restful-shadcn/scroll-list";
import { repositoryStore } from "@/models/Repository";

const ScrollListPage: FC = observer(() => {
  const i18n = useContext(I18nContext);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="my-4 text-2xl font-bold">{i18n.t("scroll_list")}</h1>

      <ScrollList
        className="h-[80vh] overflow-auto"
        translator={i18n}
        store={repositoryStore}
        renderList={(allItems) => (
          <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
            {allItems.map(
              ({ id, html_url, full_name, description, language }) => (
                <li key={id} className="rounded-lg border p-4 shadow-sm">
                  <h2 className="font-semibold">
                    <a
                      href={html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {full_name}
                    </a>
                  </h2>
                  {description && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {description}
                    </p>
                  )}
                  {language && (
                    <span className="text-muted-foreground mt-2 inline-block text-xs font-medium">
                      {language}
                    </span>
                  )}
                </li>
              ),
            )}
          </ul>
        )}
      />
    </main>
  );
});

export default ScrollListPage;
