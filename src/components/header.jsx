import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthDialog } from "@/components/auth-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap, Menu, Plus, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
function Header({ onMenuClick, onNewChat, showMenuButton = true }) {
  const { user, logout, loading } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const handleLogout = async () => {
    await logout();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("header", { className: "flex h-14 items-center justify-between border-b bg-background px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        showMenuButton && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "h-9 w-9", onClick: onMenuClick, children: [
          /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle menu" })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary", children: /* @__PURE__ */ jsx(GraduationCap, { className: "h-5 w-5 text-primary-foreground" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold hidden sm:inline-block", children: "SIT Assistant" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        onNewChat && /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: onNewChat, className: "hidden sm:flex", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "New Chat"
        ] }),
        onNewChat && /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "icon", onClick: onNewChat, className: "h-9 w-9 sm:hidden", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "New Chat" })
        ] }),
        /* @__PURE__ */ jsx(ThemeToggle, {}),
        loading ? /* @__PURE__ */ jsx("div", { className: "h-9 w-9 animate-pulse rounded-full bg-muted" }) : user ? /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-9 w-9 rounded-full", children: /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-xs", children: user.email.charAt(0).toUpperCase() }) }) }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: user.email }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground capitalize", children: user.role })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            user.role === "admin" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/admin", children: [
                /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
                "Admin Dashboard"
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {})
            ] }),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleLogout, children: [
              /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
              "Sign Out"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => setAuthDialogOpen(true), children: "Sign In" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AuthDialog, { open: authDialogOpen, onOpenChange: setAuthDialogOpen })
  ] });
}
export {
  Header
};
