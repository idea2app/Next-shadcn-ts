import { IDType } from "mobx-restful";

export default {
  hello_world: "Hello, World",
  pagination: "Pagination",
  scroll_list: "Scroll List",
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
};
