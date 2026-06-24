import { FC, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const SizeClass: Record<Required<SpinnerProps>["size"], string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export const Spinner: FC<SpinnerProps> = ({
  className,
  size = "md",
  ...props
}) => (
  <div
    className={cn(
      "inline-block animate-spin rounded-full border-solid border-current border-r-transparent",
      SizeClass[size],
      className,
    )}
    role="status"
    aria-label="Loading"
    {...props}
  />
);

Spinner.displayName = "Spinner";
