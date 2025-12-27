import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataField {
  label: string;
  value: ReactNode;
  isPrimary?: boolean;
}

interface ActionItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface MobileDataCardProps {
  fields: DataField[];
  status?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "info" | "warning";
  };
  actions?: ActionItem[];
  expandedContent?: ReactNode;
  className?: string;
}

export function MobileDataCard({
  fields,
  status,
  actions,
  expandedContent,
  className,
}: MobileDataCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryFields = fields.filter((f) => f.isPrimary !== false).slice(0, 3);
  const secondaryFields = fields.filter((f) => !primaryFields.includes(f));

  const hasExpandableContent = expandedContent || secondaryFields.length > 0;

  return (
    <div
      className={cn(
        "rounded-xl bg-card shadow-sm border border-border overflow-hidden",
        className
      )}
    >
      {/* Main Card Content */}
      <div
        className={cn(
          "p-4",
          hasExpandableContent && "cursor-pointer"
        )}
        onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Primary Fields */}
          <div className="flex-1 min-w-0 space-y-1">
            {primaryFields.map((field, index) => (
              <div key={index}>
                {index === 0 ? (
                  <h3 className="font-medium text-foreground truncate">
                    {field.value}
                  </h3>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    <span className="text-xs opacity-70">{field.label}: </span>
                    {field.value}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Status Badge */}
          {status && (
            <Badge variant={status.variant || "secondary"} className="shrink-0">
              {status.label}
            </Badge>
          )}

          {/* Actions Menu */}
          {actions && actions.length > 0 && (
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
                {actions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                    className={cn(
                      action.variant === "destructive" && "text-destructive"
                    )}
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Expand Indicator */}
          {hasExpandableContent && (
            <div className="shrink-0 text-muted-foreground">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && hasExpandableContent && (
        <div className="border-t border-border p-4 bg-muted/30 animate-fade-in">
          {/* Secondary Fields */}
          {secondaryFields.length > 0 && (
            <dl className="grid grid-cols-2 gap-3 mb-4">
              {secondaryFields.map((field, index) => (
                <div key={index}>
                  <dt className="text-xs text-muted-foreground">{field.label}</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Custom Expanded Content */}
          {expandedContent}

          {/* Inline Actions for Expanded State */}
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {actions.slice(0, 3).map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === "destructive" ? "destructive" : "secondary"}
                  size="sm"
                  onClick={action.onClick}
                  className="flex-1 min-w-[100px] h-10 touch-target"
                >
                  {action.icon}
                  <span className="ml-1">{action.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Wrapper component for converting table data to mobile cards
interface MobileTableCardsProps<T> {
  data: T[];
  renderCard: (item: T, index: number) => ReactNode;
  className?: string;
}

export function MobileTableCards<T>({
  data,
  renderCard,
  className,
}: MobileTableCardsProps<T>) {
  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item, index) => renderCard(item, index))}
    </div>
  );
}
