import { cn } from "@/lib/utils";
import { forwardRef, SVGAttributes } from "react";

interface BookIconProps extends SVGAttributes<SVGSVGElement> {
  size?: "small" | "medium" | "large";
  variant?: "white" | "primary" | "accent";
  animated?: boolean;
}

const BookIcon = forwardRef<SVGSVGElement, BookIconProps>(
  ({ className, size = "medium", variant = "white", animated = false, ...props }, ref) => {
    const sizeMap = {
      small: { width: 24, height: 18 },
      medium: { width: 32, height: 24 },
      large: { width: 48, height: 36 },
    };

    const { width, height } = sizeMap[size];

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox="0 0 32 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "transition-opacity duration-150",
          variant === "white" && "text-white",
          variant === "primary" && "text-brand-blue",
          variant === "accent" && "text-brand-yellow",
          animated && "hover:opacity-80",
          className
        )}
        aria-label="Open book icon"
        {...props}
      >
        {/* Left page */}
        <path d="M14.7,19.9c-2.5-4.8-6.8-6.7-11.8-7.5c0.3-0.7,0.6-1.3,0.8-1.9c0.8-1.9,1.7-3.8,2.5-5.7c0.6-1.4,1.2-2.8,1.9-4.2c0.1-0.1,0.3-0.2,0.4-0.2c0.6,0.1,1.3,0.1,1.9,0.2c3,0.6,5.3,2.4,7.3,4.7c0.6,0.8,0.7,1.4,0.5,2.4c-1.2,3.9-2.2,7.9-3.3,11.8C14.8,19.5,14.8,19.6,14.7,19.9z" />
        {/* Right page */}
        <path d="M26.2,15.1c-4.6-0.8-8.3,0.2-10.6,4.6c0,0-0.1,0-0.1-0.1c0.3-1.2,0.7-2.4,1-3.5c0.8-3.1,1.7-6.1,2.5-9.2c0.1-0.2,0.2-0.4,0.3-0.6c1-1.2,2.2-2.3,3.6-3.1c1.7-1,3.6-1.4,5.6-1.3c0.1,0,0.1,0,0.2,0C27.9,6.2,27.1,10.7,26.2,15.1z" />
        {/* Binding details */}
        <path d="M29.4,5.2c0.6,0.5,1.1,1,1.6,1.5c0.1,0.1,0,0.3,0,0.4c-0.2,1.6-0.5,3.2-0.7,4.8c-0.2,1.6-0.5,3.1-0.7,4.7c-0.1,1-0.3,2-0.4,3c-0.5-0.3-1-0.5-1.5-0.7c-2.4-1.1-4.9-1.6-7.6-1c-1.5,0.3-2.8,1-4,1.8c-0.1,0.1-0.3,0.2-0.4,0.3c0.1-0.5,1.2-1.7,2.2-2.4c0.9-0.6,1.9-1.1,3-1.3c1.1-0.3,2.2-0.4,3.3-0.2c1.1,0.1,2.1,0.3,3.3,0.5C28.1,12.8,28.8,9.1,29.4,5.2z" />
        <path d="M31.3,9.7c0.5,0.3,0.7,0.7,0.6,1.2c-0.2,1.5-0.4,3.1-0.6,4.6c-0.3,2.6-0.7,5.3-1,7.9c0,0.1-0.1,0.3-0.1,0.5c-0.2-0.1-0.3-0.2-0.5-0.3c-2-1.4-4.2-2.5-6.6-3.1c-2.2-0.6-4.5-0.5-6.7,0c-0.2,0-0.4,0.1-0.7,0.1c0,0,0,0-0.1,0c1.1-1,4.7-1.8,7-1.6c2,0.2,2.6,0.3,7.1,2.1C30.3,17.2,30.8,13.5,31.3,9.7z" />
        <path d="M6.6,2.7C5,6.3,3.5,9.9,1.9,13.5c5.3,0.1,9.5,2,12.4,6.6c-4-3.8-8.6-5.4-14.2-4.5c0.4-1,0.8-1.8,1.2-2.7c1-2.3,2-4.6,3.1-6.9c0.4-0.9,0.8-1.8,1.2-2.7C5.7,2.8,6.1,2.7,6.6,2.7z" />
      </svg>
    );
  }
);

BookIcon.displayName = "BookIcon";

export { BookIcon };
