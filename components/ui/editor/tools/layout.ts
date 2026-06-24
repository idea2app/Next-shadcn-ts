import {
  AlignCenterTool as ACT,
  AlignFullTool as AFT,
  AlignLeftTool as ALT,
  AlignRightTool as ART,
  HorizontalRuleTool as HRT,
  OrderedListTool as OLT,
  UnorderedListTool as ULT,
} from "edkit";

import { renderTool } from "../tool";

export class AlignLeftTool extends ALT {
  icon = "AlignLeft";
  render = renderTool;
}

export class AlignCenterTool extends ACT {
  icon = "AlignCenter";
  render = renderTool;
}

export class AlignRightTool extends ART {
  icon = "AlignRight";
  render = renderTool;
}

export class AlignFullTool extends AFT {
  icon = "AlignJustify";
  render = renderTool;
}

export class OrderedListTool extends OLT {
  icon = "ListOrdered";
  render = renderTool;
}

export class UnorderedListTool extends ULT {
  icon = "List";
  render = renderTool;
}

export class HorizontalRuleTool extends HRT {
  icon = "Minus";
  render = renderTool;
}
