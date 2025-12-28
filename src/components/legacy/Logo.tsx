import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";
import logoSvg from "@/assets/logo.svg";

interface LogoProps extends HTMLAttributes<HTMLImageElement> {
  size?: "favicon" | "small" | "medium" | "large" | "header" | "hero";
}

const sizeMap = {
  favicon: 16,
  small: 32,
  medium: 64,
  large: 128,
  header: 180,
  hero: 540,
};

const Logo = forwardRef<HTMLImageElement, LogoProps>(
  ({ className, size = "medium", ...props }, ref) => {
    const width = sizeMap[size];

    return (
      <img
        ref={ref}
        src={logoSvg}
        alt="Read-a-thon Logo"
        width={width}
        className={cn("h-auto", className)}
        {...props}
      />
    );
  }
);

Logo.displayName = "Logo";

export { Logo };
