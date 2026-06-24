"use client";

import { configure } from "mobx";
import { TranslationModel } from "mobx-i18n";
import { IDType } from "mobx-restful";

configure({ enforceActions: "never" });

export const i18n = new TranslationModel({
  "en-US": {
    load_more: "Load more...",
    no_more: "No more",
    create: "Create",
    view: "View",
    submit: "Submit",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    total_x_rows: ({ totalCount }: { totalCount: number }) =>
      `Total ${totalCount} rows`,
    sure_to_delete_x: ({ keys }: { keys: IDType[] }) =>
      `Are you sure to delete ${keys.join(", ")}?`,
    repository_name: "Repository Name",
    home_page: "Home Page",
    programming_language: "Programming Language",
    topic: "Topic",
    star_count: "Star Count",
    description: "Description",
  },
  "zh-CN": {
    load_more: "加载更多……",
    no_more: "没有更多",
    create: "新增",
    view: "查看",
    submit: "提交",
    cancel: "取消",
    edit: "编辑",
    delete: "删除",
    total_x_rows: ({ totalCount }: { totalCount: number }) =>
      `共 ${totalCount} 行`,
    sure_to_delete_x: ({ keys }: { keys: IDType[] }) =>
      `您确定删除 ${keys.join("、")} 吗？`,
    repository_name: "仓库名",
    home_page: "主页",
    programming_language: "编程语言",
    topic: "话题",
    star_count: "星标数",
    description: "描述",
  },
  "zh-TW": {
    load_more: "載入更多……",
    no_more: "沒有更多",
    create: "新增",
    view: "查看",
    submit: "提交",
    cancel: "取消",
    edit: "編輯",
    delete: "刪除",
    total_x_rows: ({ totalCount }: { totalCount: number }) =>
      `共 ${totalCount} 行`,
    sure_to_delete_x: ({ keys }: { keys: IDType[] }) =>
      `您確定刪除 ${keys.join("、")} 嗎？`,
    repository_name: "儲存庫名稱",
    home_page: "主頁",
    programming_language: "程式語言",
    topic: "話題",
    star_count: "星標數",
    description: "描述",
  },
});
