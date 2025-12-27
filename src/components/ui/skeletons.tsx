import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

// Card Skeleton
interface CardSkeletonProps {
  className?: string;
  hasAvatar?: boolean;
  hasActions?: boolean;
  lines?: number;
}

export function CardSkeleton({
  className,
  hasAvatar = true,
  hasActions = true,
  lines = 2,
}: CardSkeletonProps) {
  return (
    <div className={cn("rounded-xl bg-card p-4 shadow-sm", className)}>
      <div className="flex items-start gap-4">
        {hasAvatar && <Skeleton className="h-12 w-12 rounded-full shrink-0" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-4"
              style={{ width: `${60 + Math.random() * 30}%` }}
            />
          ))}
        </div>
      </div>
      {hasActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
      )}
    </div>
  );
}

// Table Skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex gap-4 p-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 flex-1"
            style={{ maxWidth: i === 0 ? "30%" : "20%" }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 p-4 border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-4 flex-1"
              style={{
                maxWidth: colIndex === 0 ? "30%" : "20%",
                width: `${50 + Math.random() * 40}%`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Progress Circle Skeleton
interface ProgressCircleSkeletonProps {
  size?: number;
  className?: string;
}

export function ProgressCircleSkeleton({
  size = 160,
  className,
}: ProgressCircleSkeletonProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className="rounded-full bg-muted animate-pulse"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted-foreground/20"
          />
        </svg>
      </div>
      <div className="mt-4 space-y-2 text-center">
        <Skeleton className="h-8 w-16 mx-auto" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
    </div>
  );
}

// Text Skeleton with realistic varying widths
interface TextSkeletonProps {
  lines?: number;
  className?: string;
  variant?: "heading" | "paragraph" | "label";
}

export function TextSkeleton({
  lines = 3,
  className,
  variant = "paragraph",
}: TextSkeletonProps) {
  const heights = {
    heading: "h-8",
    paragraph: "h-4",
    label: "h-3",
  };

  const widthPatterns = {
    heading: [80, 60],
    paragraph: [100, 95, 70, 85, 60],
    label: [40, 30, 50],
  };

  const pattern = widthPatterns[variant];

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={heights[variant]}
          style={{ width: `${pattern[i % pattern.length]}%` }}
        />
      ))}
    </div>
  );
}

// Student Card Skeleton
export function StudentCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl bg-card p-4 shadow-sm", className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full shrink-0" />
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

// Dashboard Skeleton - full page skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-card p-4 shadow-sm">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <StudentCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="rounded-xl bg-card p-6">
            <ProgressCircleSkeleton size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}
