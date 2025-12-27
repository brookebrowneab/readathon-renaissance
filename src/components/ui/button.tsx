import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 min-h-[44px] min-w-[44px] motion-reduce:transform-none motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-primary-hover hover:shadow-md hover:scale-[1.02] active:bg-primary-active active:scale-[0.98] active:shadow-sm focus-visible:ring-[3px] focus-visible:ring-offset-2",
        secondary:
          "bg-transparent border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:scale-[1.02] active:bg-primary-hover active:text-primary-foreground active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-offset-2",
        accent:
          "bg-accent text-accent-foreground rounded-lg shadow-sm hover:bg-accent-hover hover:shadow-md hover:scale-[1.02] active:bg-accent-active active:scale-[0.98] active:shadow-sm focus-visible:ring-[3px] focus-visible:ring-accent focus-visible:ring-offset-2",
        destructive:
          "bg-destructive text-destructive-foreground rounded-lg shadow-sm hover:bg-destructive-hover hover:shadow-md hover:scale-[1.02] active:bg-destructive-active active:scale-[0.98] active:shadow-sm focus-visible:ring-[3px] focus-visible:ring-destructive focus-visible:ring-offset-2",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:scale-[1.02] active:scale-[0.98] rounded-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98] rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 min-h-8 px-3 text-sm [&_svg]:size-4",
        default: "h-10 min-h-10 px-6 py-3 text-sm [&_svg]:size-4",
        lg: "h-12 min-h-12 px-8 text-base [&_svg]:size-5",
        icon: "h-10 w-10 min-h-10 min-w-10 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            <span className="animate-pulse-subtle">{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
