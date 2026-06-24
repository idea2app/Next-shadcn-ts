import { CopyMarkdownTool as CMDT } from "edkit";

import { renderTool } from "../tool";

export class CopyMarkdownTool extends CMDT {
  icon = "FileText";
  render = renderTool;
}
