
import { useState } from "react";

type ToastType = "default" | "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: React.ReactNode;
}

interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: React.ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = {
      id,
      title: options.title,
      description: options.description,
      type: options.type || "default",
      duration: options.duration || 5000,
      action: options.action,
    };

    setToasts((prevToasts) => [...prevToasts, toast]);

    if (toast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    toast: {
      success: (options: ToastOptions) => addToast({ ...options, type: "success" }),
      error: (options: ToastOptions) => addToast({ ...options, type: "error" }),
      warning: (options: ToastOptions) => addToast({ ...options, type: "warning" }),
      info: (options: ToastOptions) => addToast({ ...options, type: "info" }),
      default: (options: ToastOptions) => addToast(options),
    },
    dismiss: removeToast,
  };
}

type ToastFunction = (options: string | ToastOptions) => string;

interface ToastAPI {
  success: ToastFunction;
  error: ToastFunction;
  warning: ToastFunction;
  info: ToastFunction;
  default: ToastFunction;
}

// Helper para facilitar o uso
export const toast: ToastAPI = {
  success: (options) => {
    if (typeof options === "string") {
      return "" // No-op em ambiente mock
    }
    return "" // No-op em ambiente mock
  },
  error: (options) => {
    if (typeof options === "string") {
      return "" // No-op em ambiente mock
    }
    return "" // No-op em ambiente mock
  },
  warning: (options) => {
    if (typeof options === "string") {
      return "" // No-op em ambiente mock
    }
    return "" // No-op em ambiente mock
  },
  info: (options) => {
    if (typeof options === "string") {
      return "" // No-op em ambiente mock
    }
    return "" // No-op em ambiente mock
  },
  default: (options) => {
    if (typeof options === "string") {
      return "" // No-op em ambiente mock
    }
    return "" // No-op em ambiente mock
  }
};
