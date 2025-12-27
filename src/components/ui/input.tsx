import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border border-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
        error:
          "border-2 border-destructive focus:outline-none focus:border-destructive focus:ring-2 focus:ring-destructive/20",
      },
      inputSize: {
        default: "h-11 px-4 py-3",
        sm: "h-9 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({
            variant: error ? "error" : variant,
            inputSize,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
