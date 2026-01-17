import { cn } from "@/lib/utils";
import { useMemo, useEffect, useState } from "react";
import pencilPattern from "@/assets/pencil-pattern-blue.png";

interface ReadingGoalRingProps {
  progress: number;
  goal: number;
  size?: number;
  mobileSize?: number;
  showLabel?: boolean;
  className?: string;
}

const PATH_LENGTH = 100;
const CIRCLE_OFFSET = 20; // px offset for overlapping circles

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
    const result: { percent: number; isComplete: boolean; tierIndex: number }[] = [];
    let remaining = percentage;
    let tierIndex = 0;

    while (remaining > 0) {
      const current = Math.min(remaining, 100);
      result.push({
        percent: current,
        isComplete: current >= 100,
        tierIndex,
      });
      remaining -= 100;
      tierIndex++;
    }

    // Always show at least one circle
    if (result.length === 0) {
      result.push({ percent: 0, isComplete: false, tierIndex: 0 });
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#E6EAF1',
            borderRadius: '50%',
            border: 'solid 0.5px #41403E',
          }}
        >
          <svg 
            height={effectiveSize} 
            width={effectiveSize} 
            viewBox="0 0 20 20"
            style={{ width: effectiveSize, height: 'auto' }}
          >
            <defs>
              <pattern 
                id={`pencil-pattern-${index}`}
                patternUnits="objectBoundingBox" 
                x="0"
                y="0"
                width="1" 
                height="1"
              >
                <image 
                  href={pencilPattern} 
                  x="0"
                  y="-15"
                  width="20" 
                  height="20"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            </defs>
            {/* Background circle */}
            <circle r="10" cx="10" cy="10" fill="transparent" stroke="none" />
            {/* Progress arc */}
            <circle
              r="4.75"
              cx="10"
              cy="10"
              fill="transparent"
              stroke={`url(#pencil-pattern-${index})`}
              strokeWidth="9.5"
              pathLength={PATH_LENGTH}
              strokeDasharray={PATH_LENGTH}
              strokeDashoffset={PATH_LENGTH - circle.percent}
              transform="rotate(-90 10 10)"
              className="transition-all duration-500 ease-out"
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
            top: effectiveSize + 32,
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
