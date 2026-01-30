import { cn } from "@/lib/utils";
import bookStackImage from "@/assets/book-stack.png";

interface ClassFundraisingStackProps {
  fundedAmount: number;
  goalAmount: number;
  className?: string;
  classLabel?: string;
  rewardLabel?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/**
 * A vertical book stack progress indicator for class fundraising.
 * Shows colored portion for funded amount and grayscale for unfunded portion.
 */
export function ClassFundraisingStack({
  fundedAmount,
  goalAmount,
  className,
  classLabel,
  rewardLabel,
  size = "md",
  showLabel = true,
}: ClassFundraisingStackProps) {
  const percentage = Math.min(100, Math.max(0, (fundedAmount / goalAmount) * 100));
  const isComplete = percentage >= 100;

  const sizeClasses = {
    sm: "h-16 w-12",
    md: "h-24 w-16",
    lg: "h-32 w-24",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {classLabel && (
        <span className={cn("text-muted-foreground font-medium", labelSizeClasses[size])}>
          {classLabel}
        </span>
      )}

      {/* Book Stack Container */}
      <div className={cn("relative", sizeClasses[size])}>
        {/* Grayscale background (unfunded portion) */}
        <img
          src={bookStackImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain filter grayscale"
        />

        {/* Colored overlay (funded portion) - clips from bottom up */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(${100 - percentage}% 0 0 0)`,
          }}
        >
          <img
            src={bookStackImage}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Celebration effect when complete */}
        {isComplete && (
          <div className="absolute -top-2 -right-2 text-lg animate-bounce">
            🎉
          </div>
        )}
      </div>

      {/* Amount label */}
      {showLabel && (
        <div className="text-center">
          <span className={cn(
            "font-handwritten font-bold",
            labelSizeClasses[size],
            isComplete ? "text-success" : "text-primary"
          )}>
            ${fundedAmount.toFixed(0)}
          </span>
          <span className={cn("text-muted-foreground", labelSizeClasses[size])}>
            {" / $"}{goalAmount.toFixed(0)}
          </span>
        </div>
      )}

      {/* Reward label */}
      {rewardLabel && (
        <span className={cn(
          "text-center text-muted-foreground max-w-20 truncate",
          size === "sm" ? "text-[10px]" : "text-xs"
        )}>
          {rewardLabel}
        </span>
      )}

      {/* Progress percentage for screen readers */}
      <span className="sr-only">
        Class fundraising progress: {percentage.toFixed(0)}% complete, ${fundedAmount} of ${goalAmount} raised
      </span>
    </div>
  );
}
