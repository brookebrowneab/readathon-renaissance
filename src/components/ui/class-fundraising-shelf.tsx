import { cn } from "@/lib/utils";
import booksShelfImage from "@/assets/books-shelf-horizontal.png";

interface ClassFundraisingShelfProps {
  fundedAmount: number;
  goalAmount: number;
  className?: string;
  rewardLabel?: string;
}

/**
 * A horizontal book shelf progress indicator for class fundraising.
 * Shows grayscale image for unmet goal, with saturated overlay masked to progress %.
 * Tracks monetary fundraising progress, not reading minutes.
 */
export function ClassFundraisingShelf({
  fundedAmount,
  goalAmount,
  className,
  rewardLabel,
}: ClassFundraisingShelfProps) {
  const percentage = Math.min(100, Math.max(0, (fundedAmount / goalAmount) * 100));
  const isComplete = percentage >= 100;

  return (
    <div className={cn("w-full", className)}>
      {/* Shelf Container */}
      <div className="relative w-full overflow-hidden">
        {/* Grayscale base layer (unmet goal) */}
        <img
          src={booksShelfImage}
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain"
          style={{ filter: "saturate(0)" }}
        />

        {/* Full saturation overlay (met goal) - masked by percentage from left */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - percentage}% 0 0)`,
          }}
        >
          <img
            src={booksShelfImage}
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Celebration effect when complete */}
        {isComplete && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg animate-bounce">
            🎉
          </div>
        )}
      </div>

      {/* Thin progress bar for clarity */}
      <div className="mt-1 h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary via-accent to-success rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Labels below shelf */}
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">${fundedAmount.toLocaleString()}</span>
          <span className="mx-0.5">/</span>
          <span>${goalAmount.toLocaleString()}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">
            {Math.round(percentage)}%
          </span>
          {rewardLabel && (
            <span className="font-medium text-success truncate max-w-24">
              {rewardLabel}
            </span>
          )}
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">
        Class fundraising progress: {percentage.toFixed(0)}% complete, ${fundedAmount} of ${goalAmount} raised
      </span>
    </div>
  );
}
