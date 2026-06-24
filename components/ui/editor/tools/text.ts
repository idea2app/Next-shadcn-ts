import {
  BoldTool as BT,
  FontSizeDownTool as FSDT,
  FontSizeUpTool as FSUT,
  H1Tool as H1T,
  H2Tool as H2T,
  H3Tool as H3T,
  ItalicTool as IT,
  LinkTool as LT,
  StrikeThroughTool as STT,
  SubscriptTool as SubST,
  SuperscriptTool as SupST,
  UnderlineTool as UT,
} from "edkit";

import { renderTool } from "../tool";

export class BoldTool extends BT {
  icon = "Bold";
  render = renderTool;
}

export class ItalicTool extends IT {
  icon = "Italic";
  render = renderTool;
}

export class UnderlineTool extends UT {
  icon = "Underline";
  render = renderTool;
}

export class StrikeThroughTool extends STT {
  icon = "Strikethrough";
  render = renderTool;
}

export class H1Tool extends H1T {
  icon = "Heading1";
  render = renderTool;
}

export class H2Tool extends H2T {
  icon = "Heading2";
  render = renderTool;
}

export class H3Tool extends H3T {
  icon = "Heading3";
  render = renderTool;
}

export class FontSizeDownTool extends FSDT {
  icon = "ArrowDownAZ";
  render = renderTool;
}

export class FontSizeUpTool extends FSUT {
  icon = "ArrowUpAZ";
  render = renderTool;
}

export class SubscriptTool extends SubST {
  icon = "ArrowDownRight";
  render = renderTool;
}

export class SuperscriptTool extends SupST {
  icon = "ArrowUpRight";
  render = renderTool;
}

export class LinkTool extends LT {
  icon = "Link";
  render = renderTool;
}
