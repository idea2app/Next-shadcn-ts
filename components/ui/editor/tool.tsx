import { Tool } from "edkit";
import * as Icons from "lucide-react";
import { ComponentType, RefObject, SVGProps } from "react";

import { Button } from "@/components/ui/button";

export function renderTool(this: Tool, editor: RefObject<HTMLElement>) {
  const { title, active, icon, usable } = this;

  const IconComponent =
    (Icons[icon as keyof typeof Icons] as ComponentType<
      SVGProps<SVGSVGElement>
    >) || Icons.Circle;

  return (
    <Button
      key={icon}
      type="button"
      title={title}
      variant={active ? "default" : "outline"}
      size="icon-sm"
      className="mr-2 mb-2 p-2"
      disabled={!usable}
      onClick={(event) => {
        event.preventDefault();

        if (editor.current) this.execute(editor.current);
      }}
    >
      <IconComponent className="size-4" />
    </Button>
  );
}
