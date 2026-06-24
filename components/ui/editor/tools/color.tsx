import {
  BackColorTool as BCT,
  ColorName,
  ColorTool,
  ForeColorTool as FCT,
} from "edkit";
import { FileText, Type } from "lucide-react";
import { FC, RefObject } from "react";

import { Button } from "@/components/ui/button";

export interface ColorSelectorProps
  extends Partial<Record<"className" | "title" | "value", string>> {
  icon: "Type" | "FileText";
  type: ColorName;
  onChange?: (color: string) => any;
}

export const ColorSelector: FC<ColorSelectorProps> = ({
  className = "",
  title,
  type,
  value,
  onChange,
  icon,
}) => (
  <span
    className={`relative inline-block align-middle ${className}`}
    title={title}
  >
    <input
      className="absolute top-0 left-0 -z-10 h-full w-full cursor-pointer rounded-md opacity-0"
      type="color"
      value={value}
      onChange={onChange && (({ target: { value } }) => onChange(value))}
    />
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className="p-2"
      style={{
        color: type === "color" ? value : undefined,
        backgroundColor: type === "color" ? undefined : value,
        borderColor: value,
      }}
      onClick={(event) => {
        event.preventDefault();

        const input = event.currentTarget
          .previousElementSibling as HTMLInputElement;

        input.click();
      }}
    >
      {icon === "Type" ? (
        <Type
          className="size-4"
          style={type !== "color" ? { filter: "invert(1)" } : undefined}
        />
      ) : (
        <FileText
          className="size-4"
          style={type !== "color" ? { filter: "invert(1)" } : undefined}
        />
      )}
    </Button>
  </span>
);

export function renderColorTool(
  this: ColorTool,
  editor: RefObject<HTMLElement>,
) {
  const { icon, name, colorName } = this;

  return (
    <ColorSelector
      key={icon}
      className="mr-2 mb-2"
      title={name}
      icon={icon as ColorSelectorProps["icon"]}
      type={colorName}
      value={this.getColor()}
      onChange={(color) =>
        editor.current && this.execute(editor.current, color)
      }
    />
  );
}

export class ForeColorTool extends FCT {
  icon = "Type";
  render = renderColorTool;
}

export class BackColorTool extends BCT {
  icon = "FileText";
  render = renderColorTool;
}
