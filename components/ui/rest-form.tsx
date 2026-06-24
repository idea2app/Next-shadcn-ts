"use client";

import { computed, observable } from "mobx";
import { TranslationModel } from "mobx-i18n";
import { observer } from "mobx-react";
import { ObservedComponent } from "mobx-react-helper";
import { DataObject, Filter, IDType, ListModel } from "mobx-restful";
import {
  FormEvent,
  Fragment,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { formatDate, formToJSON, isEmpty } from "web-utility";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { BadgeInput } from "./badge-input";
import { Editor, EditorProps } from "./editor";
import { FilePreview } from "./file-preview";
import { FileModel, FileUploader } from "./file-uploader";
import { FormField, FormFieldProps } from "./form-field";

export interface Field<T extends DataObject>
  extends Pick<
      InputHTMLAttributes<HTMLInputElement>,
      | "type"
      | "readOnly"
      | "disabled"
      | "required"
      | "min"
      | "minLength"
      | "max"
      | "maxLength"
      | "step"
      | "pattern"
      | "multiple"
      | "accept"
      | "placeholder"
    >,
    Pick<FormFieldProps, "options" | "rows" | "contentEditable">,
    Pick<EditorProps, "tools"> {
  key?: keyof T;
  renderLabel?: ReactNode | ((key: keyof T) => ReactNode);
  renderInput?: (data: T, meta: Field<T>) => ReactNode;
  uploader?: FileModel;
  contentEditable?: boolean;
  validMessage?: ReactNode;
  invalidMessage?: ReactNode;
}

export interface FieldBoxProps<D extends DataObject>
  extends HTMLAttributes<HTMLDivElement>,
    Pick<Field<D>, "renderLabel" | `${"" | "in"}validMessage`> {
  name: Field<D>["key"];
}

export interface RestFormProps<
  D extends DataObject,
  F extends Filter<D> = Filter<D>,
> extends Omit<HTMLAttributes<HTMLFormElement>, "id" | "onSubmit" | "onReset"> {
  id?: IDType;
  fields: Field<D>[];
  store?: ListModel<D, F>;
  translator: TranslationModel<string, "submit" | "cancel">;
  size?: "default" | "sm" | "lg";
  onSubmit?: (data: D) => any;
  onReset?: (data: Partial<D>) => any;
}

@observer
export class RestForm<
  D extends DataObject,
  F extends Filter<D> = Filter<D>,
> extends ObservedComponent<RestFormProps<D, F>> {
  static readonly displayName = "RestForm";

  static dateValueOf = <D extends DataObject>(
    { type, step = "60" }: Field<D>,
    raw: D[keyof D],
  ) =>
    isEmpty(raw)
      ? raw
      : type === "month"
        ? formatDate(raw, "YYYY-MM")
        : type === "date"
          ? formatDate(raw, "YYYY-MM-DD")
          : type === "datetime-local"
            ? formatDate(raw, `YYYY-MM-DDTHH:mm${+step < 60 ? ":ss" : ""}`)
            : raw;

  static FieldBox = <D extends DataObject>({
    name,
    renderLabel,
    validMessage,
    invalidMessage,
    children,
    className,
    ...props
  }: FieldBoxProps<D>) => (
    <div className={cn("grid w-full gap-1.5", className)} {...props}>
      <Label>
        {typeof renderLabel === "function"
          ? name
            ? renderLabel(name)
            : ""
          : renderLabel || (name as string)}
      </Label>
      {children}
      {validMessage && (
        <div className="text-sm text-green-600">{validMessage}</div>
      )}
      {invalidMessage && (
        <div className="text-sm text-destructive">{invalidMessage}</div>
      )}
    </div>
  );

  @observable
  validated = false;

  componentDidMount() {
    const { id, store } = this.props;

    if (id) store?.getOne(id);
  }

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const valid = form.checkValidity();

    this.validated = true;

    if (valid) {
      const { id, store, onSubmit } = this.props;
      let data = formToJSON<D>(form);

      if (store) data = await store.updateOne(data, id);

      onSubmit?.(data);

      store?.clearCurrent();
    }
    this.validated = false;
  };

  handleReset = ({ currentTarget }: FormEvent<HTMLFormElement>) => {
    const { onReset, store } = this.props;

    onReset?.(formToJSON(currentTarget));
    store?.clearCurrent();
  };

  @computed
  get fields(): Field<D>[] {
    const { fields } = this.observedProps;

    return fields.map(({ renderInput, ...meta }) => ({
      ...meta,
      renderInput:
        renderInput ??
        (meta.type === "file"
          ? this.renderFile(meta)
          : (meta.type === "radio" || meta.type === "checkbox") && meta.options
            ? this.renderCheckGroup(meta)
            : meta.contentEditable
              ? this.renderHTMLEditor(meta)
              : !meta.options && meta.multiple
                ? this.renderMultipleInput(meta)
                : meta.key &&
                  this.renderField(
                    meta,
                    meta.rows && !meta.options ? { rows: meta.rows } : {},
                  )),
    }));
  }

  @computed
  get readOnly() {
    return this.fields.every(({ readOnly, disabled }) => readOnly || disabled);
  }

  @computed
  get customValidation() {
    return this.fields.some(
      ({ validMessage, invalidMessage }) => validMessage || invalidMessage,
    );
  }

  @computed
  get fieldReady() {
    const { id, store } = this.observedProps;

    return !id || !store || store.downloading < 1;
  }

  renderFile =
    ({ key, type, required, multiple, accept, uploader, ...meta }: Field<D>) =>
    ({ [key!]: paths }: D) => {
      const value = (
        (Array.isArray(paths) ? paths : [paths]) as string[]
      ).filter(Boolean);

      return (
        <RestForm.FieldBox name={key} {...meta}>
          {uploader ? (
            <FileUploader
              store={uploader}
              name={key?.toString()}
              {...{ required, multiple, accept }}
              defaultValue={value}
            />
          ) : (
            value.map((path) => <FilePreview key={path} {...{ type, path }} />)
          )}
        </RestForm.FieldBox>
      );
    };

  renderCheckGroup =
    ({ key, type, options, ...meta }: Field<D>) =>
    (data: D) => (
      <RestForm.FieldBox name={key} {...meta}>
        <div className="flex flex-col gap-2">
          {this.fieldReady &&
            options?.map(({ value, label = value }) => (
              <div key={value} className="flex items-center space-x-2">
                <input
                  className="h-4 w-4 rounded border-input"
                  id={[key, value] + ""}
                  type={type as "radio" | "checkbox"}
                  name={key?.toString()}
                  value={value}
                  defaultChecked={data[key!]?.includes(value)}
                  {...meta}
                />
                <Label
                  htmlFor={[key, value] + ""}
                  className="text-sm font-normal"
                >
                  {label}
                </Label>
              </div>
            ))}
        </div>
      </RestForm.FieldBox>
    );

  renderMultipleInput =
    ({ key, type, ...meta }: Field<D>) =>
    ({ [key!]: value }: D) => (
      <RestForm.FieldBox name={key} {...meta}>
        {this.fieldReady && (
          <BadgeInput {...meta} name={key?.toString()} defaultValue={value} />
        )}
      </RestForm.FieldBox>
    );

  renderHTMLEditor =
    ({ key, contentEditable, tools, ...meta }: Field<D>) =>
    ({ [key!]: value }: D) => (
      <RestForm.FieldBox name={key} {...meta}>
        {this.fieldReady && (
          <Editor tools={tools} name={key?.toString()} defaultValue={value} />
        )}
      </RestForm.FieldBox>
    );

  renderField = (
    {
      key,
      type,
      step,
      renderLabel,
      renderInput,
      validMessage,
      invalidMessage,
      ...meta
    }: Field<D>,
    props: Partial<FormFieldProps> = {},
  ) => {
    const label =
      typeof renderLabel === "function"
        ? key
          ? renderLabel(key)
          : ""
        : renderLabel || (key as string);

    return ({ [key!]: value }: D) => (
      <div className="grid w-full gap-1.5">
        {this.fieldReady && (
          <FormField
            {...props}
            {...meta}
            {...{ type, step, label }}
            name={key?.toString()}
            defaultValue={RestForm.dateValueOf({ type, step }, value)}
          />
        )}
        {validMessage && (
          <div className="text-sm text-green-600">{validMessage}</div>
        )}
        {invalidMessage && (
          <div className="text-sm text-destructive">{invalidMessage}</div>
        )}
      </div>
    );
  };

  render() {
    const { fields, readOnly, customValidation } = this,
      { id, className, size, store, translator, ...props } = this.props;
    const { downloading, uploading, currentOne = {} as D } = store || {},
      { t } = translator;
    const loading = downloading! > 0 || uploading! > 0;

    return (
      <form
        {...props}
        className={cn("flex flex-col gap-3", className)}
        noValidate={customValidation}
        onSubmit={this.handleSubmit}
        onReset={this.handleReset}
      >
        {fields.map(({ renderInput, ...meta }) => (
          <Fragment key={meta.key?.toString()}>
            {renderInput?.(currentOne, meta)}
          </Fragment>
        ))}
        {!readOnly && (
          <footer className="flex gap-3">
            <Button
              className="flex-1"
              size={size}
              type="submit"
              disabled={loading}
            >
              {t("submit")}
            </Button>
            <Button
              className="flex-1"
              size={size}
              type="reset"
              variant="destructive"
              disabled={loading}
            >
              {t("cancel")}
            </Button>
          </footer>
        )}
      </form>
    );
  }
}
