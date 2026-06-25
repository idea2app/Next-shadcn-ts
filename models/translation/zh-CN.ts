import { IDType } from "mobx-restful";

export default {
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
};
