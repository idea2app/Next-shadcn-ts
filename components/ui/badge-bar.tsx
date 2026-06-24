import { X } from "lucide-react";
import { FC } from "react";
import { sum } from "web-utility";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const VariantColors = [
  "default",
  "secondary",
  "outline",
  "destructive",
] as const;

export type BadgeVariant = (typeof VariantColors)[number];

export const text2color = (raw: string) =>
  VariantColors[
    sum(...Array.from(raw, (char) => char.charCodeAt(0))) % VariantColors.length
  ];

export interface BadgeItem {
  text: string;
  link?: string;
}

export interface BadgeBarProps extends React.HTMLAttributes<HTMLUListElement> {
  list: BadgeItem[];
  bgResolver?: (text: string) => BadgeVariant;
  onCheck?: (item: BadgeItem, index: number) => void;
  onDelete?: (item: BadgeItem, index: number) => void;
}

export const BadgeBar: FC<BadgeBarProps> = ({
  className,
  list,
  bgResolver = text2color,
  onCheck,
  onDelete,
  ...props
}) => (
  <ul
    className={cn("m-0 flex list-none flex-wrap gap-2", className)}
    {...props}
  >
    {list.map(({ text, link }, index) => (
      <Badge
        key={`${text}-${index}`}
        variant={bgResolver(text)}
        className="flex items-center gap-2 px-2 py-1"
      >
        {link || URL.canParse(text) ? (
          <a className="no-underline" href={link || text}>
            {text}
          </a>
        ) : onCheck ? (
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0"
            onClick={onCheck && (() => onCheck({ text, link }, index))}
          >
            {text}
          </button>
        ) : (
          text
        )}
        {onDelete && (
          <button
            type="button"
            className="hover:bg-background/20 ml-1 rounded-full"
            aria-label="Remove badge"
            onClick={onDelete && (() => onDelete({ text, link }, index))}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </Badge>
    ))}
  </ul>
);

BadgeBar.displayName = "BadgeBar";
