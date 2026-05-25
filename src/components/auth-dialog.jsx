import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { GraduationCap, Mail, Lock, User } from "lucide-react";
function AuthDialog({ open, onOpenChange, defaultTab = "login" }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      onOpenChange(false);
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (registerPassword !== registerConfirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (registerPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const result = await register(registerEmail, registerPassword, registerName);
    if (result.success) {
      onOpenChange(false);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
    } else {
      setError(result.error || "Registration failed");
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(GraduationCap, { className: "h-6 w-6 text-primary" }) }),
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-center text-xl", children: "Welcome to SIT Assistant" }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-center", children: "Sign in or create an account to save your chat history" })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { value: tab, onValueChange: (v) => {
      setTab(v);
      setError(null);
    }, children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "login", children: "Sign In" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "register", children: "Register" })
      ] }),
      error && /* @__PURE__ */ jsx(Alert, { variant: "destructive", className: "mt-4", children: /* @__PURE__ */ jsx(AlertDescription, { children: error }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "login", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4 pt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "login-email", children: "Email" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "login-email",
                type: "email",
                placeholder: "you@example.com",
                value: loginEmail,
                onChange: (e) => setLoginEmail(e.target.value),
                className: "pl-10",
                required: true,
                disabled: loading
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "login-password", children: "Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "login-password",
                type: "password",
                placeholder: "Enter your password",
                value: loginPassword,
                onChange: (e) => setLoginPassword(e.target.value),
                className: "pl-10",
                required: true,
                disabled: loading
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
          loading ? /* @__PURE__ */ jsx(Spinner, { className: "mr-2 h-4 w-4" }) : null,
          "Sign In"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "register", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleRegister, className: "space-y-4 pt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "register-name", children: "Full Name" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "register-name",
                type: "text",
                placeholder: "John Doe",
                value: registerName,
                onChange: (e) => setRegisterName(e.target.value),
                className: "pl-10",
                required: true,
                disabled: loading
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "register-email", children: "Email" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "register-email",
                type: "email",
                placeholder: "you@example.com",
                value: registerEmail,
                onChange: (e) => setRegisterEmail(e.target.value),
                className: "pl-10",
                required: true,
                disabled: loading
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "register-password", children: "Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "register-password",
                type: "password",
                placeholder: "At least 8 characters",
                value: registerPassword,
                onChange: (e) => setRegisterPassword(e.target.value),
                className: "pl-10",
                required: true,
                disabled: loading,
                minLength: 8
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "register-confirm-password", children: "Confirm Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "register-confirm-password",
                type: "password",
                placeholder: "Confirm your password",
                value: registerConfirmPassword,
                onChange: (e) => setRegisterConfirmPassword(e.target.value),
                className: "pl-10",
                required: true,
                disabled: loading,
                minLength: 8
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
          loading ? /* @__PURE__ */ jsx(Spinner, { className: "mr-2 h-4 w-4" }) : null,
          "Create Account"
        ] })
      ] }) })
    ] })
  ] }) });
}
export {
  AuthDialog
};
