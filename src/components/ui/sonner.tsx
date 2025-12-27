import { useTheme } from "next-themes";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={5000}
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-success/10 group-[.toaster]:border-success/30 group-[.toaster]:text-success",
          error: "group-[.toaster]:bg-destructive/10 group-[.toaster]:border-destructive/30 group-[.toaster]:text-destructive",
          warning: "group-[.toaster]:bg-warning/10 group-[.toaster]:border-warning/30 group-[.toaster]:text-warning",
          info: "group-[.toaster]:bg-info/10 group-[.toaster]:border-info/30 group-[.toaster]:text-info",
        },
      }}
      {...props}
    />
  );
};

// Enhanced toast functions with icons
const toast = {
  success: (message: string, options?: { description?: string; duration?: number }) => {
    sonnerToast.success(message, {
      ...options,
      icon: <CheckCircle className="h-5 w-5 text-success" />,
    });
  },
  error: (message: string, options?: { description?: string; duration?: number }) => {
    sonnerToast.error(message, {
      ...options,
      icon: <XCircle className="h-5 w-5 text-destructive" />,
    });
  },
  warning: (message: string, options?: { description?: string; duration?: number }) => {
    sonnerToast.warning(message, {
      ...options,
      icon: <AlertTriangle className="h-5 w-5 text-warning" />,
    });
  },
  info: (message: string, options?: { description?: string; duration?: number }) => {
    sonnerToast.info(message, {
      ...options,
      icon: <Info className="h-5 w-5 text-info" />,
    });
  },
  // Default toast
  default: sonnerToast,
  // Promise toast for async operations
  promise: sonnerToast.promise,
  // Dismiss toast
  dismiss: sonnerToast.dismiss,
  // Loading toast
  loading: (message: string) => sonnerToast.loading(message),
};

export { Toaster, toast };
