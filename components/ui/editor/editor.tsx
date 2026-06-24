"use client";

import {
  AudioTool,
  DataTransferEvent,
  EditorComponent,
  ImageTool,
  Tool,
  VideoTool,
} from "edkit";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { FormComponent, FormComponentProps } from "mobx-react-helper";
import { createRef } from "react";
import { Constructor, insertToCursor, parseDOM } from "web-utility";

import { cn } from "@/lib/utils";

import {
  AudioTool as AudioToolImpl,
  DefaultTools,
  VideoTool as VideoToolImpl,
} from "./tools";

export interface EditorProps extends FormComponentProps {
  className?: string;
  tools?: Constructor<Tool>[];
}

@observer
export class Editor
  extends FormComponent<EditorProps>
  implements EditorComponent
{
  static displayName = "Editor";

  box = createRef<HTMLDivElement>();

  @observable
  cursorPoint = "";

  @computed
  get toolList(): Tool[] {
    return (this.observedProps.tools || DefaultTools).map(
      (ToolButton) => new ToolButton(),
    );
  }

  @computed
  get imageTool() {
    return this.toolList.find((tool) => tool instanceof ImageTool) as
      | ImageTool
      | undefined;
  }

  @computed
  get audioTool() {
    return this.toolList.find((tool) => tool instanceof AudioToolImpl) as
      | AudioTool
      | undefined;
  }

  @computed
  get videoTool() {
    return this.toolList.find((tool) => tool instanceof VideoToolImpl) as
      | VideoTool
      | undefined;
  }

  componentDidMount() {
    super.componentDidMount();

    const { defaultValue } = this.props;

    if (defaultValue != null) this.box.current!.innerHTML = defaultValue;

    document.addEventListener("selectionchange", this.updateCursor);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    document.removeEventListener("selectionchange", this.updateCursor);
  }

  updateCursor = () => {
    if (this.box.current !== document.activeElement) return;

    const { endContainer } = getSelection()?.getRangeAt(0) || {};
    const { x, y } =
      (endContainer instanceof Element
        ? endContainer
        : endContainer?.parentElement
      )?.getBoundingClientRect() || {};

    this.cursorPoint = [x, y] + "";
  };

  updateValue = (markup: string) => (this.innerValue = markup.trim());

  async uploadFile(
    tool: ImageTool | AudioTool | VideoTool,
    data: string | Blob,
  ): Promise<string> {
    if (typeof data === "string" && !/^(data|blob):/.test(data)) return data;

    try {
      const blob =
        typeof data === "string"
          ? await fetch(data).then((r) => r.blob())
          : data;

      return await (tool as unknown as { save(b: Blob): Promise<string> }).save(
        blob,
      );
    } catch (e) {
      console.error(e);

      return typeof data === "string" ? data : "";
    }
  }

  async clearHTML(markup: string): Promise<DocumentFragment> {
    const fragment = document.createDocumentFragment();

    fragment.append(...parseDOM(markup));

    return fragment;
  }

  async transferMedia(item: DataTransferItem): Promise<void> {
    const file = item.getAsFile();

    if (!file) return;

    const { imageTool, audioTool, videoTool } = this;

    const tool = item.type.startsWith("image/")
      ? imageTool
      : item.type.startsWith("audio/")
        ? audioTool
        : item.type.startsWith("video/")
          ? videoTool
          : null;

    if (!tool) return;

    const url = await this.uploadFile(tool, file);

    insertToCursor(...parseDOM(tool.codeOf(url)));
  }

  handlePasteDrop = async (event: DataTransferEvent): Promise<void> => {
    event.preventDefault();

    const el = event.currentTarget as HTMLElement;

    const items = Array.from(
      "clipboardData" in event
        ? event.clipboardData?.items || []
        : event.dataTransfer?.items || [],
    );

    el.focus();

    const textItems = items.filter((item) => item.type.startsWith("text/"));

    if (textItems.length > 0) {
      const text = await new Promise<string>((resolve) =>
        textItems[0].getAsString(resolve),
      );

      insertToCursor(document.createTextNode(text));
    } else {
      for (const item of items) {
        await this.transferMedia(item);
      }
    }

    this.updateValue(el.innerHTML);
  };

  render() {
    // biome-ignore lint/correctness/noUnusedVariables: triggers re-render
    const { cursorPoint, toolList, innerValue } = this;
    const { name, className } = this.props;

    return (
      <>
        <header className="mb-2 flex flex-wrap gap-1">
          {toolList.map((tool) => tool.render(this.box))}
        </header>
        <div
          ref={this.box}
          contentEditable
          tabIndex={0}
          role="textbox"
          aria-multiline="true"
          className={cn(
            "border-input bg-background min-h-[200px] w-full rounded-md border px-3 py-2",
            "text-base shadow-xs outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          onInput={({ currentTarget: { innerHTML } }) =>
            this.updateValue(innerHTML)
          }
          onPaste={this.handlePasteDrop as any}
          onDrop={this.handlePasteDrop as any}
        />
        <input type="hidden" name={name} value={innerValue} />
      </>
    );
  }
}
