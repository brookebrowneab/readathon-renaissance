import { cn } from "@/lib/utils";
import { useMemo, useEffect, useState } from "react";

interface ReadingGoalRingProps {
  progress: number;
  goal: number;
  size?: number;
  mobileSize?: number;
  showLabel?: boolean;
  className?: string;
}

const CIRCUMFERENCE = 28.27; // radius 4.5 × 2π
const CIRCLE_OFFSET = 5; // px offset for overlapping circles


const ReadingGoalRing = ({
  progress,
  goal,
  size = 220,
  mobileSize,
  showLabel = true,
  className,
}: ReadingGoalRingProps) => {
  const percentage = useMemo(() => (progress / goal) * 100, [progress, goal]);
  
  // Responsive size: use mobileSize on small screens
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  const effectiveSize = isMobile && mobileSize ? mobileSize : size;
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

  const containerWidth = circles.length * CIRCLE_OFFSET + effectiveSize - CIRCLE_OFFSET + 6;

  return (
    <div
      className={cn("relative", className)}
      style={{ width: containerWidth, height: effectiveSize + 70 }}
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
            width: effectiveSize,
            height: effectiveSize,
            left: index * CIRCLE_OFFSET,
            zIndex: index + 1,
            top: 3,
          }}
        >
          <svg width={effectiveSize} height={effectiveSize} viewBox="0 0 32 32">
            {/* Background circle - light gray */}
            <circle r="16" cx="16" cy="16" fill="hsl(var(--muted))" />
            {/* Pie slice showing progress */}
            {circle.dashArray > 0 && (
              <path
                d={(() => {
                  const currentPercent = Math.min((circle.dashArray / CIRCUMFERENCE) * 100, 100);
                  const angle = (currentPercent / 100) * 360;
                  const startAngle = -90; // Start from top
                  const endAngle = startAngle + angle;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const x1 = 16 + 16 * Math.cos(startRad);
                  const y1 = 16 + 16 * Math.sin(startRad);
                  const x2 = 16 + 16 * Math.cos(endRad);
                  const y2 = 16 + 16 * Math.sin(endRad);
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  if (currentPercent >= 100) {
                    return `M 16 16 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0`;
                  }
                  return `M 16 16 L ${x1} ${y1} A 16 16 0 ${largeArc} 1 ${x2} ${y2} Z`;
                })()}
                fill="hsl(var(--brand-blue))"
                className="transition-all duration-500 ease-out"
              />
            )}
          </svg>
        </div>
      ))}

      {/* Label below circle */}
      {showLabel && (
        <div
          className="absolute flex flex-col items-center text-center"
          style={{
            left: 0,
            top: effectiveSize + 12,
            width: effectiveSize,
            zIndex: circles.length + 1,
          }}
        >
          <span className={cn(
            "font-handwritten text-brand-blue",
            effectiveSize < 180 ? "text-3xl" : "text-4xl"
          )}>
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
