import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
const Suggestions = ({
  className,
  children,
  ...props
}) => /* @__PURE__ */ jsxs(ScrollArea, { className: "w-full overflow-x-auto whitespace-nowrap", ...props, children: [
  /* @__PURE__ */ jsx("div", { className: cn("flex w-max flex-nowrap items-center gap-2", className), children }),
  /* @__PURE__ */ jsx(ScrollBar, { className: "hidden", orientation: "horizontal" })
] });
const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}) => {
  const handleClick = useCallback(() => {
    onClick?.(suggestion);
  }, [onClick, suggestion]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      className: cn("cursor-pointer rounded-full px-4", className),
      onClick: handleClick,
      size,
      type: "button",
      variant,
      ...props,
      children: children || suggestion
    }
  );
};
export {
  Suggestion,
  Suggestions
};
