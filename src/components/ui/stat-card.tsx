import * as React from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, value, label, icon: Icon, trend, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-secondary p-4 transition-shadow duration-200 hover:shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-4xl font-semibold text-primary">{value}</span>
          <span className="text-sm text-muted-foreground mt-1">{label}</span>
          {trend && (
            <span
              className={cn(
                "text-xs mt-1",
                trend.isPositive ? "text-accent-green" : "text-destructive"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
);
StatCard.displayName = "StatCard";

export { StatCard };
