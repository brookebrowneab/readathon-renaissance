import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
  fullScreen?: boolean;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
};

const textSizeClasses: Record<SpinnerSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        fullScreen && "min-h-screen",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={cn(
          "animate-spin text-brand-blue",
          sizeClasses[size]
        )}
      />
      <span className={cn("text-muted-foreground sr-only", textSizeClasses[size])}>
        {label}
      </span>
      {/* Visible label for larger spinners */}
      {(size === "lg" || size === "xl") && (
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          {label}
        </span>
      )}
    </div>
  );

  return spinner;
}

// Inline loading indicator for buttons/text
interface InlineLoadingProps {
  className?: string;
  label?: string;
}

export function InlineLoading({ className, label = "Loading" }: InlineLoadingProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

// Page loading overlay
interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({ message = "Loading...", className }: PageLoadingProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-card shadow-lg">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
        </div>
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
}

// Section loading wrapper
interface SectionLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  minHeight?: string;
}

export function SectionLoading({
  isLoading,
  children,
  skeleton,
  minHeight = "200px",
}: SectionLoadingProps) {
  if (isLoading) {
    return (
      <div style={{ minHeight }} className="flex items-center justify-center">
        {skeleton || <LoadingSpinner size="lg" />}
      </div>
    );
  }

  return <>{children}</>;
}

// Pulsing dot loader
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)} role="status">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-brand-blue animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
