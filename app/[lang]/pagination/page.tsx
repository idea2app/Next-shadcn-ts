"use client";

import { computed } from "mobx";
import { GitRepository } from "mobx-github";
import { observer } from "mobx-react";
import { ObservedComponent } from "mobx-react-helper";

import { BadgeBar } from "@/components/ui/badge-bar";
import { Column, RestTable } from "@/components/ui/rest-table";
import { repositoryStore } from "@/models/Repository";
import { i18n } from "@/models/Translation";

@observer
class RepositoryTable extends ObservedComponent<{}, typeof i18n> {
  @computed
  get columns(): Column<GitRepository>[] {
    const { t } = i18n;

    return [
      {
        key: "full_name",
        renderHead: t("repository_name"),
        renderBody: ({ html_url, full_name }) => (
          <a
            target="_blank"
            href={html_url}
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            {full_name}
          </a>
        ),
        required: true,
        minLength: 3,
        invalidMessage: "Input 3 characters at least",
      },
      { key: "homepage", type: "url", renderHead: t("home_page") },
      { key: "language", renderHead: t("programming_language") },
      {
        key: "topics",
        renderHead: t("topic"),
        renderBody: ({ topics }) => (
          <BadgeBar
            list={(topics || []).map((text) => ({
              text,
              link: `https://github.com/topics/${text}`,
            }))}
          />
        ),
      },
      {
        key: "stargazers_count",
        type: "number",
        renderHead: t("star_count"),
      },
      { key: "description", renderHead: t("description"), rows: 3 },
    ];
  }

  render() {
    return (
      <RestTable
        className="flex h-full flex-col gap-3 overflow-auto text-center"
        editable
        deletable
        columns={this.columns}
        store={repositoryStore}
        translator={i18n}
        onCheck={console.info}
      />
    );
  }
}

export default RepositoryTable;
