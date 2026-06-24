"use client";

import { GitRepository } from "mobx-github";
import { observer } from "mobx-react";
import { FC } from "react";

import { ScrollList } from "@/components/ui/scroll-list";
import { repositoryStore } from "@/models/Repository";
import { i18n } from "@/models/Translation";

const ScrollListPage: FC = observer(() => (
    <main className="container mx-auto px-4 py-8">
      <h1 className="my-4 text-2xl font-bold">{i18n.t("load_more")}</h1>

      <ScrollList
        className="h-[80vh] overflow-auto"
        translator={i18n}
        store={repositoryStore}
        renderList={(allItems: GitRepository[]) => (
          <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
            {allItems.map((item) => (
              <li key={item.id} className="rounded-lg border p-4 shadow-sm">
                <h2 className="font-semibold">
                  <a
                    href={item.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {item.full_name}
                  </a>
                </h2>
                {item.description && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {item.description}
                  </p>
                )}
                {item.language && (
                  <span className="text-muted-foreground mt-2 inline-block text-xs font-medium">
                    {item.language}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      />
    </main>
  ));

export default ScrollListPage;
