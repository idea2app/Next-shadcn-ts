"use client";

import { observable } from "mobx";
import { observer } from "mobx-react";
import { FormComponent, FormComponentProps } from "mobx-react-helper";
import { BaseModel } from "mobx-restful";
import { DragEvent } from "react";

import { FilePicker } from "./file-picker";

export abstract class FileModel extends BaseModel {
  @observable
  files: string[] = [];

  clear() {
    super.clear();

    this.files = [];
  }

  async upload(file: string | Blob) {
    if (file instanceof Blob) file = URL.createObjectURL(file);

    const { files } = this;

    if (!files.includes(file)) this.files = [...files, file];

    return file;
  }

  async delete(file: string) {
    const { files } = this;
    const index = files.indexOf(file);

    this.files = [...files.slice(0, index), ...files.slice(index + 1)];
  }

  move(sourceIndex: number, targetIndex: number) {
    const { files } = this;
    const sourceFile = files[sourceIndex],
      targetFile = files[targetIndex];
    const frontIndex = Math.min(sourceIndex, targetIndex),
      backIndex = Math.max(sourceIndex, targetIndex);

    const front = files.slice(0, frontIndex),
      middle = files.slice(frontIndex + 1, backIndex),
      back = files.slice(backIndex + 1);

    this.files =
      sourceIndex < targetIndex
        ? [...front, ...middle, targetFile, sourceFile, ...back]
        : [...front, sourceFile, targetFile, ...middle, ...back];
  }
}

export interface FileUploaderProps extends FormComponentProps<string[]> {
  store: FileModel;
}

@observer
export class FileUploader extends FormComponent<FileUploaderProps> {
  static readonly displayName = "FileUploader";

  @observable
  pickIndex: number | undefined;

  componentDidMount() {
    super.componentDidMount();

    const { store } = this.props;

    store.files = this.value || [];
  }

  componentDidUpdate(prevProps: FileUploaderProps) {
    super.componentDidUpdate(prevProps, this.state);

    if (prevProps.value !== this.props.value) {
      const { store } = this.props;

      store.files = this.value || [];
    }
  }

  handleDrop = (index: number) => (event: DragEvent<HTMLElement>) => {
    event.preventDefault();

    const { props, pickIndex } = this;

    if (!(pickIndex != null)) return;

    props.store.move(pickIndex, index);

    this.innerValue = props.store.files;
  };

  handleChange =
    (oldURI = "") =>
    async (file: string | File) => {
      const { store } = this.props;

      if (oldURI) await store.delete(oldURI);
      if (file) await store.upload(file);

      this.innerValue = store.files;
    };

  render() {
    const {
      className = "",
      style,
      multiple,
      store,
      value: _,
      defaultValue,
      onChange,
      ...props
    } = this.props;

    const { value } = this;

    return (
      <ol
        className={`m-0 flex list-none flex-wrap gap-2 ${className}`}
        style={style}
        onDragOver={(event) => event.preventDefault()}
      >
        {value?.map((file, index) => (
          <li
            key={file}
            className="inline-block"
            draggable
            onDragStart={() => (this.pickIndex = index)}
            onDrop={this.handleDrop(index)}
          >
            <FilePicker
              {...props}
              value={file}
              onChange={this.handleChange(file)}
            />
          </li>
        ))}
        {(multiple || !value?.[0]) && (
          <li className="inline-block">
            <FilePicker
              {...props}
              name={undefined}
              value=""
              required={!value?.[0] && props.required}
              onChange={this.handleChange()}
            />
          </li>
        )}
      </ol>
    );
  }
}
