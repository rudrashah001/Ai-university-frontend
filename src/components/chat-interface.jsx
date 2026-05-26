import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useChat } from "@ai-sdk/react";
import { apiUrl } from "@/lib/api";
import { DefaultChatTransport } from "ai";
import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction
} from "@/components/ai-elements/message";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth-context";
import { GraduationCap, User, Copy, Check, Send } from "lucide-react";
import { cn } from "@/lib/utils";
const SUGGESTIONS = [
  "What CRICOS courses does SIT offer?",
  "How do I apply to Stanford Institute of Technology?",
  "Where are SIT campuses in Melbourne?",
  "Contact info and enquiry — sit.edu.au"
];
function getUIMessageText(message) {
  if (!message.parts || !Array.isArray(message.parts)) return "";
  return message.parts.filter((part) => part.type === "text").map((part) => part.text).join("");
}
function ChatInterface({ chatId: initialChatId, initialMessages = [], onNewChat }) {
  const { user } = useAuth();
  const [chatId] = useState(() => initialChatId || nanoid());
  const [copiedId, setCopiedId] = useState(null);
  const inputRef = useRef(null);
  const convertedInitialMessages = useMemo(
    () => initialMessages.map((m, i) => ({
      id: `initial-${i}`,
      role: m.role,
      parts: [{ type: "text", text: m.content }]
    })),
    [initialMessages]
  );
  const transport = useMemo(
    () => new DefaultChatTransport({
      api: apiUrl("/api/chat"),
      body: { chatId }
    }),
    [chatId]
  );
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } = useChat({
    transport,
    initialMessages: convertedInitialMessages
  });
  const isLoading = status === "streaming" || status === "submitted";
  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput("");
    await sendMessage({ text: message });
  }, [input, isLoading, sendMessage]);
  const handleSuggestionClick = useCallback((suggestion) => {
    setInput(suggestion);
    setTimeout(async () => {
      await sendMessage({ text: suggestion });
      setInput("");
    }, 0);
  }, [sendMessage]);
  const handleCopy = useCallback((text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  }, []);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxs(Conversation, { className: "flex-1", children: [
      /* @__PURE__ */ jsx(ConversationContent, { className: "mx-auto max-w-3xl px-4 py-6", children: messages.length === 0 ? /* @__PURE__ */ jsx(
        ConversationEmptyState,
        {
          title: "Welcome to SIT Assistant",
          description: "Ask me about Stanford Institute of Technology (Melbourne) — courses, CRICOS codes, how to apply, campuses, and more. Official site: www.sit.edu.au",
          icon: /* @__PURE__ */ jsx(GraduationCap, { className: "h-12 w-12" }),
          children: /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Try asking:" }),
            /* @__PURE__ */ jsx(Suggestions, { className: "justify-center flex-wrap", children: SUGGESTIONS.map((suggestion) => /* @__PURE__ */ jsx(
              Suggestion,
              {
                suggestion,
                onClick: handleSuggestionClick
              },
              suggestion
            )) })
          ] })
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        messages.map((message) => {
          const text = getUIMessageText(message);
          const isUser = message.role === "user";
          return /* @__PURE__ */ jsx(Message, { from: message.role, children: /* @__PURE__ */ jsxs("div", { className: cn("flex gap-3", isUser && "flex-row-reverse"), children: [
            /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8 shrink-0", children: /* @__PURE__ */ jsx(AvatarFallback, { className: cn(
              isUser ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
            ), children: isUser ? /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-1", isUser && "items-end"), children: [
              /* @__PURE__ */ jsx(MessageContent, { children: message.parts.map((part, i) => {
                if (part.type === "text") {
                  return /* @__PURE__ */ jsx(
                    MessageResponse,
                    {
                      isAnimating: !isUser && status === "streaming" && message.id === messages[messages.length - 1]?.id,
                      children: part.text
                    },
                    `${message.id}-${i}`
                  );
                }
                return null;
              }) }),
              !isUser && text && /* @__PURE__ */ jsx(MessageActions, { className: "opacity-0 transition-opacity group-hover:opacity-100", children: /* @__PURE__ */ jsx(
                MessageAction,
                {
                  tooltip: copiedId === message.id ? "Copied!" : "Copy",
                  onClick: () => handleCopy(text, message.id),
                  children: copiedId === message.id ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" })
                }
              ) })
            ] })
          ] }) }, message.id);
        }),
        isLoading && messages[messages.length - 1]?.role === "user" && /* @__PURE__ */ jsx(Message, { from: "assistant", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8 shrink-0", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Spinner, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Thinking..." })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(ConversationScrollButton, {})
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t bg-background p-4", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
      /* @__PURE__ */ jsx("form", { onSubmit: (e) => {
        e.preventDefault();
        handleSubmit();
      }, className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2 rounded-lg border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            ref: inputRef,
            value: input,
            onChange: (e) => setInput(e.target.value),
            onKeyDown: handleKeyDown,
            placeholder: "Ask me anything about SIT...",
            className: "min-h-[44px] max-h-[200px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground",
            rows: 1,
            disabled: isLoading
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: isLoading ? /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            size: "icon",
            variant: "ghost",
            onClick: stop,
            className: "h-9 w-9",
            children: [
              /* @__PURE__ */ jsx("div", { className: "h-4 w-4 rounded-sm bg-foreground" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Stop generating" })
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          Button,
          {
            type: "submit",
            size: "icon",
            disabled: !input.trim(),
            className: "h-9 w-9",
            children: [
              /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Send message" })
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-xs text-muted-foreground", children: "Answers based on www.sit.edu.au — enquiries: info@sit.edu.au | +61 410 055 201" })
    ] }) })
  ] });
}
export {
  ChatInterface
};
