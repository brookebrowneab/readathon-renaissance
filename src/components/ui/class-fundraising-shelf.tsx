import { cn } from "@/lib/utils";
import bookStackImage from "@/assets/book-stack.png";

interface ClassFundraisingShelfProps {
  currentMinutes: number;
  goalMinutes: number;
  className?: string;
  rewardLabel?: string;
}

/**
 * A horizontal book shelf progress indicator for class fundraising.
 * Shows colored portion for progress and grayscale for remaining portion.
 * Designed to fit within cards as a compact horizontal element.
 */
export function ClassFundraisingShelf({
  currentMinutes,
  goalMinutes,
  className,
  rewardLabel,
}: ClassFundraisingShelfProps) {
  const percentage = Math.min(100, Math.max(0, (currentMinutes / goalMinutes) * 100));
  const isComplete = percentage >= 100;

  return (
    <div className={cn("w-full", className)}>
      {/* Shelf Container */}
      <div className="relative h-12 w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-success/10 border border-primary/20">
        {/* Background shelf texture */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.05)_50%,transparent_100%)]" />
        
        {/* Grayscale books (unfilled portion) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={bookStackImage}
            alt=""
            aria-hidden="true"
            className="h-10 w-auto object-contain filter grayscale opacity-40 rotate-90"
          />
        </div>

        {/* Colored progress overlay - clips from left to right */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - percentage}% 0 0)`,
          }}
        >
          {/* Gradient background for progress */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-success/30" />
          
          {/* Colored books */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={bookStackImage}
              alt=""
              aria-hidden="true"
              className="h-10 w-auto object-contain rotate-90"
            />
          </div>
        </div>

        {/* Progress bar overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted/30">
          <div 
            className="h-full bg-gradient-to-r from-primary via-accent to-success transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Celebration effect when complete */}
        {isComplete && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg animate-bounce">
            🎉
          </div>
        )}
      </div>

      {/* Labels below shelf */}
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{currentMinutes.toLocaleString()}</span>
          <span className="mx-0.5">/</span>
          <span>{goalMinutes.toLocaleString()} min</span>
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
        Class goal progress: {percentage.toFixed(0)}% complete, {currentMinutes} of {goalMinutes} minutes read
      </span>
    </div>
  );
}
