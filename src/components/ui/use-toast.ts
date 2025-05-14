
import { toast as sonnerToast } from "sonner";

// Configurando o toast para português por padrão
const toastPtBr = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message)
};

export { sonnerToast as toast, toastPtBr };
