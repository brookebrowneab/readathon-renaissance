import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  BookOpen,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileStudentCardProps {
  name: string;
  gradeInfo: string;
  avatarUrl?: string;
  avatarInitials?: string;
  progress?: {
    current: number;
    goal: number;
  };
  lastActive?: string;
  status?: "exceeding" | "on-track" | "needs-attention";
  onViewDetails?: () => void;
  onLogReading?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function MobileStudentCard({
  name,
  gradeInfo,
  avatarUrl,
  avatarInitials,
  progress,
  lastActive,
  status,
  onViewDetails,
  onLogReading,
  onEdit,
  onDelete,
  className,
}: MobileStudentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef(0);
  const isSwipingRef = useRef(false);

  const progressPercentage = progress
    ? Math.min((progress.current / progress.goal) * 100, 100)
    : 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.touches[0].clientX;
    if (Math.abs(diff) > 10) {
      isSwipingRef.current = true;
    }
    // Only allow left swipe (positive diff)
    if (diff > 0 && diff < 120) {
      setSwipeOffset(-diff);
    } else if (diff < 0 && swipeOffset < 0) {
      setSwipeOffset(Math.min(0, swipeOffset - diff));
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -60) {
      setSwipeOffset(-100);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleCardClick = () => {
    if (!isSwipingRef.current && swipeOffset === 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "exceeding":
        return "bg-brand-green";
      case "on-track":
        return "bg-brand-blue";
      case "needs-attention":
        return "bg-amber-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {/* Swipe Actions Background */}
      <div className="absolute inset-y-0 right-0 flex items-stretch">
        {onEdit && (
          <button
            onClick={onEdit}
            className="w-[50px] bg-brand-blue text-white flex items-center justify-center touch-target"
          >
            <Edit2 className="h-5 w-5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="w-[50px] bg-destructive text-destructive-foreground flex items-center justify-center touch-target"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Card */}
      <div
        className={cn(
          "relative bg-card p-4 shadow-sm transition-transform duration-200 touch-action-pan-y",
          isExpanded && "rounded-b-none"
        )}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-foreground truncate">
                {name}
              </h3>
              {status && (
                <span
                  className={cn("h-2 w-2 rounded-full shrink-0", getStatusColor())}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{gradeInfo}</p>

            {/* Progress Bar (Compact) */}
            {progress && (
              <div className="mt-2 flex items-center gap-2">
                <Progress value={progressPercentage} className="h-2 flex-1" />
                <span className="text-xs font-medium text-primary shrink-0">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            )}
          </div>

          {/* Expand/Collapse Indicator */}
          <div className="shrink-0 text-muted-foreground">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>

          {/* Mobile Overflow Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              {onViewDetails && (
                <DropdownMenuItem onClick={onViewDetails}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {onLogReading && (
                <DropdownMenuItem onClick={onLogReading}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Log Reading
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="bg-card border-t border-border p-4 rounded-b-xl animate-fade-in">
          {progress && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-xs text-muted-foreground">Current</span>
                <p className="font-handwritten text-xl text-brand-blue">
                  {progress.current} min
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-xs text-muted-foreground">Goal</span>
                <p className="font-handwritten text-xl text-brand-blue">
                  {progress.goal} min
                </p>
              </div>
            </div>
          )}

          {lastActive && (
            <p className="text-sm text-muted-foreground mb-4">
              Last active: {lastActive}
            </p>
          )}

          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onViewDetails}
                className="flex-1 h-11 touch-target"
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            )}
            {onLogReading && (
              <Button
                size="sm"
                onClick={onLogReading}
                className="flex-1 h-11 touch-target"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Log Reading
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
