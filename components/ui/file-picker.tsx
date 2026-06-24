"use client";

import { X } from "lucide-react";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { FormComponent, FormComponentProps } from "mobx-react-helper";
import { blobOf } from "web-utility";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { FilePreview } from "./file-preview";

export type FilePickerProps = FormComponentProps<string | File>;

const blobCache = new WeakMap<File, string>();

@observer
export class FilePicker extends FormComponent<FilePickerProps> {
  static readonly displayName = "FilePicker";

  @observable
  file: File | undefined;

  @computed
  get fileType() {
    const { accept } = this.observedProps,
      { file } = this;

    return file?.type || file?.name.match(/\.\w+$/)?.[0] || accept;
  }

  @computed
  get filePath() {
    const { value } = this;

    return typeof value === "string" ? value : value && blobCache.get(value);
  }

  protected async restoreFile(data: FilePickerProps["value"]) {
    if (typeof data === "string")
      try {
        const blob = await blobOf(data),
          name = data.split("/").at(-1);
        const file = new File([blob], name!, { type: blob.type });

        blobCache.set(file, data);

        return (this.file = file);
      } catch (_) {
        // ignore URL parsing errors
      }

    if (data instanceof File) {
      if (!blobCache.has(data)) blobCache.set(data, URL.createObjectURL(data));

      return (this.file = data);
    }

    return (this.file = undefined);
  }

  private changeFile = (data?: File) => {
    this.file = data;

    if (data) {
      this.innerValue = data;

      blobCache.set(data, URL.createObjectURL(data));
    } else if (this.value) {
      const { innerValue } = this;

      if (typeof innerValue === "string" && innerValue.startsWith("blob:"))
        URL.revokeObjectURL(innerValue);
      else if (innerValue instanceof File) blobCache.delete(innerValue);

      this.innerValue = "";
    }
  };

  componentDidMount() {
    super.componentDidMount();

    this.restoreFile(this.value);
  }

  componentDidUpdate(prevProps: FilePickerProps) {
    super.componentDidUpdate(prevProps, this.state);

    if (prevProps.value !== this.props.value) {
      this.restoreFile(this.value);
    }
  }

  renderInput() {
    const { id, name, value, required, disabled, accept, multiple } =
      this.props;
    const { filePath } = this;

    return (
      <>
        <input
          ref={this.ref}
          className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
          type="file"
          name={value ? undefined : name}
          required={!value && required}
          {...{ id, disabled, accept, multiple }}
          onChange={({ currentTarget: { files } }) =>
            this.changeFile(files?.[0])
          }
        />
        {filePath && <input type="hidden" name={name} value={filePath} />}
      </>
    );
  }

  render() {
    const { filePath, fileType } = this,
      { className = "", style } = this.props;

    return (
      <div
        className={cn("relative inline-block rounded-md border", className)}
        style={{ width: "10rem", height: "10rem", ...style }}
      >
        {filePath ? (
          <FilePreview
            className="h-full w-full"
            type={fileType}
            path={filePath}
          />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center text-6xl">
            +
          </div>
        )}
        {this.renderInput()}
        {filePath && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute top-0 right-0 h-6 w-6"
            onClick={() => this.changeFile()}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }
}
