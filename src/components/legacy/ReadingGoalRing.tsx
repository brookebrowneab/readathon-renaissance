import { cn } from "@/lib/utils";
import { useMemo, useEffect, useState } from "react";

interface ReadingGoalRingProps {
  progress: number;
  goal: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

const CIRCUMFERENCE = 28.27; // radius 4.5 × 2π
const CIRCLE_OFFSET = 5; // px offset for overlapping circles

// Color tiers: blue (0-100%), green (100-200%), gold (200-300%), rainbow (300%+)
const getTierColor = (tierIndex: number): string => {
  const colors = [
    "hsl(var(--brand-blue))",    // 0-100%
    "hsl(142 76% 45%)",          // 100-200% (green)
    "hsl(45 93% 55%)",           // 200-300% (gold)
    "url(#rainbow-gradient)",     // 300%+ (rainbow)
  ];
  return colors[Math.min(tierIndex, colors.length - 1)];
};

const ReadingGoalRing = ({
  progress,
  goal,
  size = 220,
  showLabel = true,
  className,
}: ReadingGoalRingProps) => {
  const percentage = useMemo(() => (progress / goal) * 100, [progress, goal]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);

  // Check for milestone crossings
  const currentMilestone = Math.floor(percentage / 100);
  
  useEffect(() => {
    if (currentMilestone > lastMilestone && currentMilestone > 0) {
      setShowConfetti(true);
      setLastMilestone(currentMilestone);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentMilestone, lastMilestone]);

  // Calculate circles needed for overflow behavior
  const circles = useMemo(() => {
    const result: { dashArray: number; isComplete: boolean; tierIndex: number }[] = [];
    let remaining = percentage;
    let tierIndex = 0;

    while (remaining > 0) {
      const current = Math.min(remaining, 100);
      result.push({
        dashArray: (current * CIRCUMFERENCE) / 100,
        isComplete: current >= 100,
        tierIndex,
      });
      remaining -= 100;
      tierIndex++;
    }

    // Always show at least one circle
    if (result.length === 0) {
      result.push({ dashArray: 0, isComplete: false, tierIndex: 0 });
    }

    return result;
  }, [percentage]);

  const containerWidth = circles.length * CIRCLE_OFFSET + size - CIRCLE_OFFSET + 6;

  return (
    <div
      className={cn("relative", className)}
      style={{ width: containerWidth, height: size + 70 }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-label={`Reading progress: ${progress} of ${goal} minutes`}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 30}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 6],
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}

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
            {/* Rainbow gradient definition */}
            <defs>
              <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="25%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#4ECDC4" />
                <stop offset="75%" stopColor="#45B7D1" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            {/* Background circle */}
            <circle r="10" cx="10" cy="10" fill="transparent" />
            {/* Progress arc */}
            <circle
              r="4.5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke={getTierColor(circle.tierIndex)}
              strokeWidth="9"
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

      {/* Label below circle */}
      {showLabel && (
        <div
          className="absolute flex flex-col items-center text-center"
          style={{
            left: 0,
            top: size + 12,
            width: size,
            zIndex: circles.length + 1,
          }}
        >
          <span 
            className="font-handwritten text-4xl"
            style={{ color: getTierColor(Math.min(circles.length - 1, 2)) === "url(#rainbow-gradient)" ? "#A855F7" : getTierColor(circles.length - 1) }}
          >
            {Math.round(percentage)}%
          </span>
          <span className="text-sm text-muted-foreground">
            {progress}/{goal} min
          </span>
        </div>
      )}
    </div>
  );
};

export { ReadingGoalRing };
