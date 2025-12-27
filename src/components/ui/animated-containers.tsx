import { cn } from "@/lib/utils";
import { useInViewAnimation, useStaggeredAnimation } from "@/hooks/use-animations";
import { forwardRef, Children, cloneElement, isValidElement, ReactNode } from "react";

// Animated container that fades in when entering viewport
interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-in" | "fade-in-up" | "scale-in" | "slide-in-right" | "slide-in-left";
  delay?: number;
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, animation = "fade-in-up", delay = 0 }, forwardedRef) => {
    const { ref, isInView } = useInViewAnimation();

    return (
      <div
        ref={(node) => {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        className={cn(
          "motion-reduce:opacity-100 motion-reduce:transform-none",
          isInView ? `animate-${animation}` : "opacity-0",
          className
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </div>
    );
  }
);
AnimatedContainer.displayName = "AnimatedContainer";

// Staggered list animation
interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggeredList({ children, className, staggerDelay = 50 }: StaggeredListProps) {
  const childArray = Children.toArray(children);
  const { getDelay, shouldAnimate } = useStaggeredAnimation(childArray.length, staggerDelay);
  const { ref, isInView } = useInViewAnimation();

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, index) => {
        if (!isValidElement(child)) return child;

        return cloneElement(child as React.ReactElement<{ className?: string; style?: React.CSSProperties }>, {
          className: cn(
            (child.props as { className?: string }).className,
            shouldAnimate && !isInView && "opacity-0",
            shouldAnimate && isInView && "animate-fade-in-up"
          ),
          style: {
            ...(child.props as { style?: React.CSSProperties }).style,
            animationDelay: `${getDelay(index)}ms`,
          },
        });
      })}
    </div>
  );
}

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div
      className={cn(
        "animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}

// Hover lift effect wrapper
interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function HoverLift({ children, className, as: Component = "div" }: HoverLiftProps) {
  return (
    <Component
      className={cn(
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-lg",
        "active:translate-y-0 active:shadow-md",
        "motion-reduce:transform-none motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </Component>
  );
}

// Click flash effect
interface ClickFlashProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ClickFlash({ children, className, onClick }: ClickFlashProps) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.currentTarget;
    target.classList.add("animate-flash");
    setTimeout(() => target.classList.remove("animate-flash"), 300);
    onClick?.();
  };

  return (
    <div className={cn("cursor-pointer", className)} onClick={handleClick}>
      {children}
    </div>
  );
}

// Sliding underline for navigation
interface SlidingUnderlineProps {
  isActive: boolean;
  className?: string;
}

export function SlidingUnderline({ isActive, className }: SlidingUnderlineProps) {
  return (
    <span
      className={cn(
        "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
        "motion-reduce:transition-none",
        isActive ? "w-full" : "w-0",
        className
      )}
    />
  );
}
