import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface ReadingGoalRingProps {
  progress: number;
  goal: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

const CIRCUMFERENCE = 31.4; // radius 5 × 2π
const CIRCLE_OFFSET = 20; // px offset for overlapping circles

const ReadingGoalRing = ({
  progress,
  goal,
  size = 220,
  showLabel = true,
  className,
}: ReadingGoalRingProps) => {
  const percentage = useMemo(() => (progress / goal) * 100, [progress, goal]);

  // Calculate circles needed for overflow behavior
  const circles = useMemo(() => {
    const result: { dashArray: number; isComplete: boolean }[] = [];
    let remaining = percentage;

    while (remaining > 0) {
      const current = Math.min(remaining, 100);
      result.push({
        dashArray: (current * CIRCUMFERENCE) / 100,
        isComplete: current >= 100,
      });
      remaining -= 100;
    }

    // Always show at least one circle
    if (result.length === 0) {
      result.push({ dashArray: 0, isComplete: false });
    }

    return result;
  }, [percentage]);

  const containerWidth = circles.length * CIRCLE_OFFSET + size - CIRCLE_OFFSET + 6;

  return (
    <div
      className={cn("relative", className)}
      style={{ width: containerWidth, height: size + 6 }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-label={`Reading progress: ${progress} of ${goal} minutes`}
    >
      {circles.map((circle, index) => (
        <div
          key={index}
          className="progress-ring-container"
          style={{
            width: size,
            height: size,
            left: index * CIRCLE_OFFSET,
            zIndex: index + 1,
            top: 3,
          }}
        >
          <svg width={size} height={size} viewBox="0 0 20 20">
            {/* Background circle */}
            <circle r="10" cx="10" cy="10" fill="transparent" />
            {/* Progress arc */}
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke="hsl(var(--brand-blue))"
              strokeWidth="10"
              strokeDasharray={`${circle.dashArray} ${CIRCUMFERENCE}`}
              transform="rotate(-90) translate(-20)"
              className={cn(
                "transition-all duration-500 ease-out",
                circle.isComplete && "animate-draw-progress"
              )}
            />
          </svg>
        </div>
      ))}

      {/* Center label */}
      {showLabel && (
        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{
            left: 0,
            top: 3,
            width: size,
            height: size,
            zIndex: circles.length + 1,
          }}
        >
          <span className="font-handwritten text-4xl text-brand-blue">{Math.round(percentage)}%</span>
          <span className="text-sm text-muted-foreground">
            {progress}/{goal} min
          </span>
        </div>
      )}
    </div>
  );
};

export { ReadingGoalRing };
