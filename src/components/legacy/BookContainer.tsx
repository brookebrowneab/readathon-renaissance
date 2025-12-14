import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

interface BookContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warm" | "accent";
  shadowLevel?: "subtle" | "normal" | "prominent";
}

const BookContainer = forwardRef<HTMLDivElement, BookContainerProps>(
  ({ className, variant = "default", shadowLevel = "normal", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "book-container relative box-border",
          variant === "warm" && "bg-background-warm",
          variant === "accent" && "bg-background-warmer",
          shadowLevel === "subtle" && "shadow-md",
          shadowLevel === "prominent" && "shadow-xl",
          className
        )}
        {...props}
      >
        <div className="book-container-content overflow-hidden pt-[max(2rem,3vw)]">
          {children}
        </div>
      </div>
    );
  }
);

BookContainer.displayName = "BookContainer";

export { BookContainer };
