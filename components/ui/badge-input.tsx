"use client";

import { observer } from "mobx-react";
import { FormComponent, FormComponentProps } from "mobx-react-helper";
import { KeyboardEvent } from "react";
import { isEmpty } from "web-utility";

import { cn } from "@/lib/utils";

import { BadgeBar } from "./badge-bar";

export const TextInputTypes = [
  "text",
  "number",
  "tel",
  "email",
  "url",
] as const;

export type TextInputType = (typeof TextInputTypes)[number];

export interface BadgeInputProps extends FormComponentProps<string[]> {
  type?: TextInputType;
}

@observer
export class BadgeInput extends FormComponent<BadgeInputProps> {
  static readonly displayName = "BadgeInput";

  static match(type: string): type is TextInputType {
    return TextInputTypes.includes(type as TextInputType);
  }

  handleInput = (event: KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const { value } = input,
      innerValue = this.innerValue || [];

    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        input.value = "";

        if (value) this.innerValue = [...innerValue, value];

        break;
      }
      case "Backspace": {
        if (!value) this.innerValue = innerValue.slice(0, -1);
      }
    }
  };

  delete(index: number) {
    const innerValue = this.innerValue || [];

    this.innerValue = [
      ...innerValue.slice(0, index),
      ...innerValue.slice(index + 1),
    ];
  }

  render() {
    const { value } = this,
      { className, style, type, name, required, placeholder } = this.props;

    return (
      <div
        className={cn(
          "border-input focus-within:border-ring focus-within:ring-ring/50 flex min-h-9 w-full flex-wrap items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-within:ring-[3px]",
          className,
        )}
        style={style}
      >
        <BadgeBar
          list={(value || []).map((text) => ({ text }))}
          onDelete={({}, index) => this.delete(index)}
        />
        <input
          className="min-w-[80px] flex-1 border-0 bg-transparent outline-none"
          type={type}
          required={isEmpty(value) ? required : undefined}
          placeholder={placeholder}
          onKeyDown={this.handleInput}
        />
        <input type="hidden" name={name} value={JSON.stringify(value)} />
      </div>
    );
  }
}
