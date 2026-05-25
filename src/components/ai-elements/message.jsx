import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupText
} from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Streamdown } from "streamdown";
const Message = ({ className, from, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "group flex w-full max-w-[95%] flex-col gap-2",
      from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
      className
    ),
    ...props
  }
);
const MessageContent = ({
  children,
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm",
      "group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
      "group-[.is-assistant]:text-foreground",
      className
    ),
    ...props,
    children
  }
);
const MessageActions = ({
  className,
  children,
  ...props
}) => /* @__PURE__ */ jsx("div", { className: cn("flex items-center gap-1", className), ...props, children });
const MessageAction = ({
  tooltip,
  children,
  label,
  variant = "ghost",
  size = "icon-sm",
  ...props
}) => {
  const button = /* @__PURE__ */ jsxs(Button, { size, type: "button", variant, ...props, children: [
    children,
    /* @__PURE__ */ jsx("span", { className: "sr-only", children: label || tooltip })
  ] });
  if (tooltip) {
    return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsx("p", { children: tooltip }) })
    ] }) });
  }
  return button;
};
const MessageBranchContext = createContext(
  null
);
const useMessageBranch = () => {
  const context = useContext(MessageBranchContext);
  if (!context) {
    throw new Error(
      "MessageBranch components must be used within MessageBranch"
    );
  }
  return context;
};
const MessageBranch = ({
  defaultBranch = 0,
  onBranchChange,
  className,
  ...props
}) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState([]);
  const handleBranchChange = useCallback(
    (newBranch) => {
      setCurrentBranch(newBranch);
      onBranchChange?.(newBranch);
    },
    [onBranchChange]
  );
  const goToPrevious = useCallback(() => {
    const newBranch = currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
    handleBranchChange(newBranch);
  }, [currentBranch, branches.length, handleBranchChange]);
  const goToNext = useCallback(() => {
    const newBranch = currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
    handleBranchChange(newBranch);
  }, [currentBranch, branches.length, handleBranchChange]);
  const contextValue = useMemo(
    () => ({
      branches,
      currentBranch,
      goToNext,
      goToPrevious,
      setBranches,
      totalBranches: branches.length
    }),
    [branches, currentBranch, goToNext, goToPrevious]
  );
  return /* @__PURE__ */ jsx(MessageBranchContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("grid w-full gap-2 [&>div]:pb-0", className),
      ...props
    }
  ) });
};
const MessageBranchContent = ({
  children,
  ...props
}) => {
  const { currentBranch, setBranches, branches } = useMessageBranch();
  const childrenArray = useMemo(
    () => Array.isArray(children) ? children : [children],
    [children]
  );
  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [childrenArray, branches, setBranches]);
  return childrenArray.map((branch, index) => /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "grid gap-2 overflow-hidden [&>div]:pb-0",
        index === currentBranch ? "block" : "hidden"
      ),
      ...props,
      children: branch
    },
    branch.key
  ));
};
const MessageBranchSelector = ({
  className,
  ...props
}) => {
  const { totalBranches } = useMessageBranch();
  if (totalBranches <= 1) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    ButtonGroup,
    {
      className: cn(
        "[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md",
        className
      ),
      orientation: "horizontal",
      ...props
    }
  );
};
const MessageBranchPrevious = ({
  children,
  ...props
}) => {
  const { goToPrevious, totalBranches } = useMessageBranch();
  return /* @__PURE__ */ jsx(
    Button,
    {
      "aria-label": "Previous branch",
      disabled: totalBranches <= 1,
      onClick: goToPrevious,
      size: "icon-sm",
      type: "button",
      variant: "ghost",
      ...props,
      children: children ?? /* @__PURE__ */ jsx(ChevronLeftIcon, { size: 14 })
    }
  );
};
const MessageBranchNext = ({
  children,
  ...props
}) => {
  const { goToNext, totalBranches } = useMessageBranch();
  return /* @__PURE__ */ jsx(
    Button,
    {
      "aria-label": "Next branch",
      disabled: totalBranches <= 1,
      onClick: goToNext,
      size: "icon-sm",
      type: "button",
      variant: "ghost",
      ...props,
      children: children ?? /* @__PURE__ */ jsx(ChevronRightIcon, { size: 14 })
    }
  );
};
const MessageBranchPage = ({
  className,
  ...props
}) => {
  const { currentBranch, totalBranches } = useMessageBranch();
  return /* @__PURE__ */ jsxs(
    ButtonGroupText,
    {
      className: cn(
        "border-none bg-transparent text-muted-foreground shadow-none",
        className
      ),
      ...props,
      children: [
        currentBranch + 1,
        " of ",
        totalBranches
      ]
    }
  );
};
const streamdownPlugins = { cjk, code, math, mermaid };
const MessageResponse = memo(
  ({ className, ...props }) => /* @__PURE__ */ jsx(
    Streamdown,
    {
      className: cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      ),
      plugins: streamdownPlugins,
      ...props
    }
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children && nextProps.isAnimating === prevProps.isAnimating
);
MessageResponse.displayName = "MessageResponse";
const MessageToolbar = ({
  className,
  children,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "mt-4 flex w-full items-center justify-between gap-4",
      className
    ),
    ...props,
    children
  }
);
export {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar
};
