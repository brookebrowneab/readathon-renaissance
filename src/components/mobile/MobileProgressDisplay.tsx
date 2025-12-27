import { useState, useRef, useEffect } from "react";
import { ReadingGoalRing } from "@/components/legacy";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChildProgress {
  id: string;
  name: string;
  currentMinutes: number;
  goalMinutes: number;
}

interface MobileProgressDisplayProps {
  children: ChildProgress[];
  className?: string;
}

export function MobileProgressDisplay({ children, className }: MobileProgressDisplayProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  const scrollToChild = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
    }
  };

  const activeChild = children[activeIndex];

  return (
    <div className={cn("w-full", className)}>
      {/* Swipeable Progress Rings */}
      {children.length > 1 ? (
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide -mx-4 px-4"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {children.map((child) => (
              <div
                key={child.id}
                className="flex-shrink-0 w-full snap-center flex flex-col items-center"
              >
                <p className="font-handwritten text-xl text-brand-blue mb-2">
                  {child.name}
                </p>
                <ReadingGoalRing
                  progress={child.currentMinutes}
                  goal={child.goalMinutes}
                  size={160}
                  className="mx-auto"
                />
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {children.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToChild(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-200",
                  index === activeIndex
                    ? "w-6 bg-brand-blue"
                    : "w-2 bg-muted-foreground/30"
                )}
                aria-label={`Go to child ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows (visible on larger mobile) */}
          <div className="hidden sm:flex justify-between absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none px-2">
            <button
              onClick={() => scrollToChild(Math.max(0, activeIndex - 1))}
              className={cn(
                "pointer-events-auto h-10 w-10 rounded-full bg-background/80 shadow flex items-center justify-center",
                activeIndex === 0 && "opacity-50"
              )}
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollToChild(Math.min(children.length - 1, activeIndex + 1))}
              className={cn(
                "pointer-events-auto h-10 w-10 rounded-full bg-background/80 shadow flex items-center justify-center",
                activeIndex === children.length - 1 && "opacity-50"
              )}
              disabled={activeIndex === children.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          {activeChild && (
            <>
              <p className="font-handwritten text-xl text-brand-blue mb-2">
                {activeChild.name}
              </p>
              <ReadingGoalRing
                progress={activeChild.currentMinutes}
                goal={activeChild.goalMinutes}
                size={160}
                className="mx-auto"
              />
            </>
          )}
        </div>
      )}

      {/* Horizontal Scroll Stats */}
      {children.length > 0 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide mt-6 -mx-4 px-4 pb-2">
          {children.map((child) => {
            const percentage = Math.round((child.currentMinutes / child.goalMinutes) * 100);
            return (
              <div
                key={child.id}
                className={cn(
                  "flex-shrink-0 rounded-xl p-3 min-w-[120px] border transition-colors",
                  child.id === activeChild?.id
                    ? "bg-brand-blue/10 border-brand-blue/30"
                    : "bg-muted/50 border-transparent"
                )}
                onClick={() => {
                  const index = children.findIndex((c) => c.id === child.id);
                  scrollToChild(index);
                }}
              >
                <p className="text-xs text-muted-foreground truncate">{child.name}</p>
                <p className="font-handwritten text-lg text-brand-blue">
                  {child.currentMinutes} min
                </p>
                <p className="text-xs text-muted-foreground">{percentage}%</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
