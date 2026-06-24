import {
  ClearTool as CT,
  RedoTool as RDT,
  ResetTool as RST,
  UndoTool as UDT,
} from "edkit";

import { renderTool } from "../tool";

export class UndoTool extends UDT {
  icon = "Undo";
  render = renderTool;
}

export class RedoTool extends RDT {
  icon = "Redo";
  render = renderTool;
}

export class ResetTool extends RST {
  icon = "Eraser";
  render = renderTool;
}

export class ClearTool extends CT {
  icon = "X";
  render = renderTool;
}
