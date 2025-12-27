import * as React from "react";
import { cn } from "@/lib/utils";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  headerAction?: React.ReactNode;
}

const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  ({ className, header, headerAction, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      {header && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
          <div className="font-medium text-foreground">{header}</div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  )
);
DataCard.displayName = "DataCard";

export { DataCard };
