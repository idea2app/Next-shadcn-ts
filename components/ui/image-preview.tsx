"use client";

import { observable, reaction as mobxReaction } from "mobx";
import { observer } from "mobx-react";
import { ObservedComponent } from "mobx-react-helper";
import { ImgHTMLAttributes } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { Spinner } from "./spinner";

export interface ImagePreviewProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

@observer
export class ImagePreview extends ObservedComponent<ImagePreviewProps> {
  static readonly displayName = "ImagePreview";

  @observable
  downloading = false;

  @observable
  loadedPath = "";

  @observable
  viewing = false;

  private _disposeReaction?: () => void;

  componentDidMount() {
    const { src } = this.observedProps;

    this.loadedPath = "";

    if (src) this.load(src);

    this._disposeReaction = mobxReaction(
      () => this.observedProps.src,
      (src) => {
        this.loadedPath = "";

        if (src) this.load(src);
      },
    );
  }

  componentWillUnmount() {
    this._disposeReaction?.();
  }

  async load(path: string) {
    this.downloading = true;

    try {
      await new Promise((resolve, reject) => {
        const image = new globalThis.Image();

        image.onload = resolve;
        image.onerror = reject;

        image.src = path;
      });

      this.loadedPath = path;
    } finally {
      this.downloading = false;
    }
  }

  render() {
    const { downloading, loadedPath, viewing } = this;
    const { className, src, ...props } = this.props;

    const fileName = loadedPath
      ? decodeURI(loadedPath.split("/").pop() || "image")
      : "image";

    return (
      <div
        className={cn(
          "m-0",
          downloading && "flex min-h-[100px] items-center justify-center",
          className,
        )}
        {...props}
      >
        {downloading ? (
          <Spinner className="text-muted-foreground" />
        ) : (
          loadedPath && (
            <img
              className="h-auto max-w-full cursor-pointer object-contain"
              src={loadedPath}
              loading="lazy"
              alt="Preview"
              onClick={() => (this.viewing = true)}
            />
          )
        )}
        <Dialog open={viewing} onOpenChange={(open) => (this.viewing = open)}>
          <DialogContent className="max-w-4xl">
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            <div className="text-center">
              <img
                className="mx-auto h-auto max-w-full"
                src={loadedPath}
                alt="Preview"
              />
            </div>
            <DialogFooter className="justify-center">
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href={loadedPath}
                target="_blank"
                rel="noopener noreferrer"
                download={fileName}
              >
                {fileName}
              </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
