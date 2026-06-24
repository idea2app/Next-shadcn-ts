"use client";

import {
  ComponentProps,
  FC,
  FocusEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { uniqueID } from "web-utility";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SelectOption
  extends Partial<Pick<HTMLOptionElement, "text" | "label" | "disabled">> {
  value: string;
}

export type FormFieldProps = ComponentProps<typeof Input> &
  Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> & {
    label?: ReactNode;
    options?: SelectOption[];
    multiple?: boolean;
    contentEditable?: boolean;
  };

export const FormField: FC<FormFieldProps> = ({
  className,
  style,
  name,
  id = name || `form-field-${uniqueID()}`,
  label,
  placeholder = typeof label === "string" ? label : id,
  options,
  multiple,
  rows,
  contentEditable: _contentEditable,
  onBlur,
  ...controlProps
}) => (
  <div
    className={cn("grid w-full gap-1.5", className)}
    style={style}
    onBlur={(event) => {
      if ((event.target as HTMLInputElement).checkValidity()) {
        event.target.classList.remove("border-destructive");
      } else {
        event.target.classList.add("border-destructive");
      }
      onBlur?.(event as unknown as FocusEvent<HTMLInputElement>);
    }}
  >
    {label && <Label htmlFor={id}>{label}</Label>}
    {options ? (
      <select
        {...{ id, name, multiple }}
        size={rows}
        className={cn(
          "border-input flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          multiple && rows ? "h-auto" : "h-9",
        )}
        {...(controlProps as object)}
      >
        {options.map(({ value, text, label, disabled }) => (
          <option key={value} {...{ value, label, disabled }}>
            {text || value}
          </option>
        ))}
      </select>
    ) : rows && rows > 1 ? (
      <textarea
        {...{ id, name, rows, placeholder }}
        className={cn(
          "border-input flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "resize-vertical",
        )}
        {...(controlProps as object)}
      />
    ) : (
      <Input {...{ id, name, placeholder }} {...controlProps} />
    )}
  </div>
);

FormField.displayName = "FormField";
