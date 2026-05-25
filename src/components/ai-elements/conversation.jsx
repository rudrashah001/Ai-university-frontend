import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, DownloadIcon } from "lucide-react";
import { useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
const Conversation = ({ className, ...props }) => /* @__PURE__ */ jsx(
  StickToBottom,
  {
    className: cn("relative flex-1 overflow-y-hidden", className),
    initial: "smooth",
    resize: "smooth",
    role: "log",
    ...props
  }
);
const ConversationContent = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  StickToBottom.Content,
  {
    className: cn("flex flex-col gap-8 p-4", className),
    ...props
  }
);
const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
      className
    ),
    ...props,
    children: children ?? /* @__PURE__ */ jsxs(Fragment, { children: [
      icon && /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: icon }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-medium text-sm", children: title }),
        description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: description })
      ] })
    ] })
  }
);
const ConversationScrollButton = ({
  className,
  ...props
}) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);
  return !isAtBottom && /* @__PURE__ */ jsx(
    Button,
    {
      className: cn(
        "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full dark:bg-background dark:hover:bg-muted",
        className
      ),
      onClick: handleScrollToBottom,
      size: "icon",
      type: "button",
      variant: "outline",
      ...props,
      children: /* @__PURE__ */ jsx(ArrowDownIcon, { className: "size-4" })
    }
  );
};
const getMessageText = (message) => message.parts.filter((part) => part.type === "text").map((part) => part.text).join("");
const defaultFormatMessage = (message) => {
  const roleLabel = message.role.charAt(0).toUpperCase() + message.role.slice(1);
  return `**${roleLabel}:** ${getMessageText(message)}`;
};
const messagesToMarkdown = (messages, formatMessage = defaultFormatMessage) => messages.map((msg, i) => formatMessage(msg, i)).join("\n\n");
const ConversationDownload = ({
  messages,
  filename = "conversation.md",
  formatMessage = defaultFormatMessage,
  className,
  children,
  ...props
}) => {
  const handleDownload = useCallback(() => {
    const markdown = messagesToMarkdown(messages, formatMessage);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [messages, filename, formatMessage]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      className: cn(
        "absolute top-4 right-4 rounded-full dark:bg-background dark:hover:bg-muted",
        className
      ),
      onClick: handleDownload,
      size: "icon",
      type: "button",
      variant: "outline",
      ...props,
      children: children ?? /* @__PURE__ */ jsx(DownloadIcon, { className: "size-4" })
    }
  );
};
export {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
  messagesToMarkdown
};
