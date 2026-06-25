import { IDType } from "mobx-restful";

export default {
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
};
