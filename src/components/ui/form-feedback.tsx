import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, X } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-animations";

interface FormFeedbackProps {
  type: "success" | "error" | "warning" | null;
  message?: string;
  className?: string;
}

export function FormFeedback({ type, message, className }: FormFeedbackProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!type) return null;

  const icons = {
    success: <Check className="h-4 w-4" />,
    error: <X className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
  };

  const styles = {
    success: "text-success bg-success/10 border-success/30",
    error: "text-destructive bg-destructive/10 border-destructive/30",
    warning: "text-warning bg-warning/10 border-warning/30",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
        styles[type],
        !prefersReducedMotion && "animate-fade-in",
        className
      )}
    >
      <span className={cn(!prefersReducedMotion && type === "success" && "animate-success-check")}>
        {icons[type]}
      </span>
      {message && <span>{message}</span>}
    </div>
  );
}

// Animated input wrapper with success/error states
interface AnimatedInputWrapperProps {
  children: React.ReactNode;
  state?: "success" | "error" | null;
  className?: string;
}

export function AnimatedInputWrapper({
  children,
  state,
  className,
}: AnimatedInputWrapperProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        state === "error" && !prefersReducedMotion && "animate-shake",
        className
      )}
    >
      {children}
      
      {/* Success indicator */}
      {state === "success" && (
        <div
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-success text-success-foreground",
            !prefersReducedMotion && "animate-success-check"
          )}
        >
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}

// Focus ring animation
interface FocusRingProps {
  isFocused: boolean;
  className?: string;
}

export function FocusRing({ isFocused, className }: FocusRingProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!isFocused) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-lg border-2 border-ring",
        !prefersReducedMotion && "animate-ring-expand",
        className
      )}
    />
  );
}

// Input with built-in validation states
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validationState?: "success" | "error" | null;
  errorMessage?: string;
}

export const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ className, validationState, errorMessage, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
      <div className="space-y-1">
        <div
          className={cn(
            "relative",
            validationState === "error" && !prefersReducedMotion && "animate-shake"
          )}
        >
          <input
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-lg border bg-background px-4 py-2 text-base ring-offset-background transition-all duration-200",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              validationState === "success" && "border-success pr-12",
              validationState === "error" && "border-destructive",
              className
            )}
            {...props}
          />
          
          {validationState === "success" && (
            <div
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground",
                !prefersReducedMotion && "animate-success-check"
              )}
            >
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
        
        {validationState === "error" && errorMessage && (
          <p
            className={cn(
              "text-sm text-destructive",
              !prefersReducedMotion && "animate-fade-in"
            )}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
ValidatedInput.displayName = "ValidatedInput";
