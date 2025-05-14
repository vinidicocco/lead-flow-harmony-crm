
import { useState } from "react";

// Definir os tipos corretos para o toast
type ToastVariant = "default" | "destructive";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
}

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (options: ToastOptions | string) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Converter string em objeto de opções se necessário
    const toastOptions = typeof options === 'string' ? { description: options } : options;
    
    const toast = {
      id,
      title: toastOptions.title,
      description: toastOptions.description,
      variant: toastOptions.variant || "default",
      duration: toastOptions.duration || 5000,
      action: toastOptions.action,
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
    toast: addToast,
    dismiss: removeToast,
  };
}

// Helper para facilitar o uso
export const toast = (props: ToastOptions | string): string => {
  // Esta é uma implementação simulada para uso fora do componente
  // Na versão real, isso seria implementado usando contexto do React
  console.log('Toast:', typeof props === 'string' ? props : props.description);
  return Math.random().toString(36).substring(2, 9);
};
