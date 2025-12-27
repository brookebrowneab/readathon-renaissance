import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, htmlFor, helperText, error, required, children, className },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={htmlFor}
            variant={error ? "error" : "default"}
            className="text-sm font-medium"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {children}
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };
