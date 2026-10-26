import React from "react";
import "./Dividers.css";

export type DividerOrientation = "horizontal" | "vertical";

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Defaults to horizontal. */
  orientation?: DividerOrientation;
  /**
   * When true (default), the line is visual only and is removed from the accessibility tree.
   * Set false when the line separates meaningful regions.
   */
  decorative?: boolean;
};

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = "horizontal", decorative = true, className, ...props },
  ref,
) {
  const semantic = !decorative;
  return (
    <div
      ref={ref}
      role={semantic ? "separator" : "none"}
      aria-orientation={semantic && orientation === "vertical" ? "vertical" : undefined}
      data-orientation={orientation}
      className={["dvd", orientation === "vertical" ? "dvd--vertical" : "dvd--horizontal", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
});
