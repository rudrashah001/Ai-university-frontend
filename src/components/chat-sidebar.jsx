import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MessageSquare, Trash2, X, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
function ChatSidebar({
  isOpen,
  onClose,
  selectedChatId,
  onSelectChat,
  onNewChat,
}) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const fetchChats = useCallback(async () => {
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }
    try {
      const res = await apiFetch("/api/chats");
      if (!res.ok) {
        throw new Error(`Failed to fetch chats: ${res.status}`);
      }
      const data = await res.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);
  const handleDelete = async (chatId) => {
    try {
      const res = await apiFetch(`/api/chats/${chatId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`Failed to delete chat: ${res.status}`);
      }
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (selectedChatId === chatId) {
        onNewChat();
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
    setDeleteId(null);
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      isOpen &&
        /* @__PURE__ */ jsx("div", {
          className:
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
          onClick: onClose,
        }),
      /* @__PURE__ */ jsxs("aside", {
        className: cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r bg-sidebar transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ),
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex h-14 items-center justify-between border-b px-4",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx("div", {
                    className:
                      "flex h-8 w-8 items-center justify-center rounded-lg bg-primary",
                    children: /* @__PURE__ */ jsx(GraduationCap, {
                      className: "h-5 w-5 text-primary-foreground",
                    }),
                  }),
                  /* @__PURE__ */ jsx("span", {
                    className: "font-semibold",
                    children: "Chat History",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxs(Button, {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 lg:hidden",
                onClick: onClose,
                children: [
                  /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", {
                    className: "sr-only",
                    children: "Close sidebar",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsx(ScrollArea, {
            className: "flex-1 p-2",
            children: !user
              ? /* @__PURE__ */ jsxs("div", {
                  className:
                    "flex flex-col items-center justify-center gap-2 p-4 text-center",
                  children: [
                    /* @__PURE__ */ jsx(MessageSquare, {
                      className: "h-8 w-8 text-muted-foreground",
                    }),
                    /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Sign in to save your chat history",
                    }),
                  ],
                })
              : loading
                ? /* @__PURE__ */ jsx("div", {
                    className: "space-y-2",
                    children: [...Array(5)].map((_, i) =>
                      /* @__PURE__ */ jsx(
                        Skeleton,
                        { className: "h-12 w-full" },
                        i,
                      ),
                    ),
                  })
                : chats.length === 0
                  ? /* @__PURE__ */ jsxs("div", {
                      className:
                        "flex flex-col items-center justify-center gap-2 p-4 text-center",
                      children: [
                        /* @__PURE__ */ jsx(MessageSquare, {
                          className: "h-8 w-8 text-muted-foreground",
                        }),
                        /* @__PURE__ */ jsx("p", {
                          className: "text-sm text-muted-foreground",
                          children: "No chat history yet",
                        }),
                        /* @__PURE__ */ jsx("p", {
                          className: "text-xs text-muted-foreground",
                          children: "Start a conversation to see it here",
                        }),
                      ],
                    })
                  : /* @__PURE__ */ jsx("div", {
                      className: "space-y-1",
                      children: chats.map((chat) =>
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: cn(
                              "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
                              selectedChatId === chat.id && "bg-sidebar-accent",
                            ),
                            children: [
                              /* @__PURE__ */ jsxs("button", {
                                onClick: () => onSelectChat(chat.id),
                                className:
                                  "flex flex-1 flex-col items-start gap-0.5 overflow-hidden text-left",
                                children: [
                                  /* @__PURE__ */ jsx("span", {
                                    className: "w-full truncate font-medium",
                                    children: chat.title,
                                  }),
                                  /* @__PURE__ */ jsx("span", {
                                    className: "text-xs text-muted-foreground",
                                    children: formatDistanceToNow(
                                      new Date(chat.updatedAt),
                                      { addSuffix: true },
                                    ),
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxs(Button, {
                                variant: "ghost",
                                size: "icon",
                                className:
                                  "h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  setDeleteId(chat.id);
                                },
                                children: [
                                  /* @__PURE__ */ jsx(Trash2, {
                                    className:
                                      "h-3.5 w-3.5 text-muted-foreground",
                                  }),
                                  /* @__PURE__ */ jsx("span", {
                                    className: "sr-only",
                                    children: "Delete chat",
                                  }),
                                ],
                              }),
                            ],
                          },
                          chat.id,
                        ),
                      ),
                    }),
          }),
        ],
      }),
      /* @__PURE__ */ jsx(AlertDialog, {
        open: !!deleteId,
        onOpenChange: () => setDeleteId(null),
        children: /* @__PURE__ */ jsxs(AlertDialogContent, {
          children: [
            /* @__PURE__ */ jsxs(AlertDialogHeader, {
              children: [
                /* @__PURE__ */ jsx(AlertDialogTitle, {
                  children: "Delete Chat",
                }),
                /* @__PURE__ */ jsx(AlertDialogDescription, {
                  children:
                    "Are you sure you want to delete this chat? This action cannot be undone.",
                }),
              ],
            }),
            /* @__PURE__ */ jsxs(AlertDialogFooter, {
              children: [
                /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsx(AlertDialogAction, {
                  onClick: () => deleteId && handleDelete(deleteId),
                  className:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  children: "Delete",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
export { ChatSidebar };
