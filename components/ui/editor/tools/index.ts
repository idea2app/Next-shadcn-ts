import { BackColorTool, ForeColorTool } from "./color";
import { ClearTool, RedoTool, ResetTool, UndoTool } from "./control";
import { CopyMarkdownTool } from "./extra";
import {
  AlignCenterTool,
  AlignFullTool,
  AlignLeftTool,
  AlignRightTool,
  HorizontalRuleTool,
  OrderedListTool,
  UnorderedListTool,
} from "./layout";
import { AudioTool, IFrameTool, ImageTool, VideoTool } from "./media";
import {
  BoldTool,
  FontSizeDownTool,
  FontSizeUpTool,
  H1Tool,
  H2Tool,
  H3Tool,
  ItalicTool,
  LinkTool,
  StrikeThroughTool,
  SubscriptTool,
  SuperscriptTool,
  UnderlineTool,
} from "./text";

export * from "./color";
export * from "./control";
export * from "./extra";
export * from "./layout";
export * from "./media";
export * from "./text";

export const TextTools = [
  BoldTool,
  ItalicTool,
  UnderlineTool,
  StrikeThroughTool,
  H1Tool,
  H2Tool,
  H3Tool,
  FontSizeDownTool,
  FontSizeUpTool,
  SubscriptTool,
  SuperscriptTool,
  LinkTool,
];
export const ColorTools = [ForeColorTool, BackColorTool];
export const LayoutTools = [
  AlignLeftTool,
  AlignCenterTool,
  AlignRightTool,
  AlignFullTool,
  OrderedListTool,
  UnorderedListTool,
  HorizontalRuleTool,
];
export const MediaTools = [IFrameTool, ImageTool, AudioTool, VideoTool];
export const ControlTools = [UndoTool, RedoTool, ResetTool, ClearTool];
export const ExtraTools = [CopyMarkdownTool];

export const OriginalTools = [
  ...TextTools,
  ...ColorTools,
  ...LayoutTools,
  ...MediaTools,
  ...ControlTools,
];

export const DefaultTools = [
  BoldTool,
  ItalicTool,
  UnderlineTool,
  StrikeThroughTool,
  H1Tool,
  H2Tool,
  H3Tool,
  SubscriptTool,
  SuperscriptTool,
  ForeColorTool,
  BackColorTool,
  AlignLeftTool,
  AlignCenterTool,
  AlignRightTool,
  AlignFullTool,
  OrderedListTool,
  UnorderedListTool,
  HorizontalRuleTool,
  ImageTool,
  UndoTool,
  RedoTool,
  ClearTool,
];
