
import { toast } from "sonner";

// Configurando o toast para português por padrão
const toastPtBr = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message)
};

export { toast, toastPtBr };
