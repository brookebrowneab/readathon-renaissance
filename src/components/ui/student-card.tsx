import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Eye, BookOpen } from "lucide-react";

interface StudentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  gradeInfo: string;
  avatarUrl?: string;
  avatarInitials?: string;
  progress?: {
    current: number;
    goal: number;
  };
  onViewDetails?: () => void;
  onLogReading?: () => void;
}

const StudentCard = React.forwardRef<HTMLDivElement, StudentCardProps>(
  (
    {
      className,
      name,
      gradeInfo,
      avatarUrl,
      avatarInitials,
      progress,
      onViewDetails,
      onLogReading,
      ...props
    },
    ref
  ) => {
    const progressPercentage = progress
      ? Math.min((progress.current / progress.goal) * 100, 100)
      : 0;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium">
                {avatarInitials ||
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-foreground truncate">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">{gradeInfo}</p>
          </div>

          {/* Progress Circle */}
          {progress && (
            <div className="relative h-12 w-12 shrink-0">
              <svg
                className="h-12 w-12 -rotate-90 transform"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  className="stroke-primary transition-all duration-500"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage * 0.94} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {(onViewDetails || onLogReading) && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            {onViewDetails && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onViewDetails}
                className="flex-1"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            )}
            {onLogReading && (
              <Button
                variant="default"
                size="sm"
                onClick={onLogReading}
                className="flex-1"
              >
                <BookOpen className="h-4 w-4" />
                Log Reading
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
StudentCard.displayName = "StudentCard";

export { StudentCard };
