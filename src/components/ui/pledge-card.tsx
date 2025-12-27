import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { DollarSign } from "lucide-react";

type PledgeStatus = "pending" | "paid" | "cancelled";
type PledgeType = "per-minute" | "flat";

interface PledgeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  sponsorName: string;
  relationship: string;
  pledgeType: PledgeType;
  pledgeAmount: number;
  status: PledgeStatus;
  calculatedAmount?: number;
  minutesRead?: number;
  onPaymentAction?: () => void;
}

const statusConfig: Record<
  PledgeStatus,
  { label: string; variant: "pending" | "success" | "destructive" }
> = {
  pending: { label: "Pending", variant: "pending" },
  paid: { label: "Paid", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const PledgeCard = React.forwardRef<HTMLDivElement, PledgeCardProps>(
  (
    {
      className,
      sponsorName,
      relationship,
      pledgeType,
      pledgeAmount,
      status,
      calculatedAmount,
      minutesRead,
      onPaymentAction,
      ...props
    },
    ref
  ) => {
    const statusInfo = statusConfig[status];
    const showPaymentButton = status === "pending" && onPaymentAction;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-medium text-foreground">
              {sponsorName}
            </h3>
            <p className="text-sm text-muted-foreground">{relationship}</p>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        {/* Pledge Details */}
        <div className="space-y-2 py-3 border-t border-b border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pledge Type</span>
            <span className="font-medium text-foreground">
              {pledgeType === "per-minute" ? "Per Minute" : "Flat Amount"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {pledgeType === "per-minute" ? "Rate" : "Amount"}
            </span>
            <span className="font-medium text-foreground">
              ${pledgeAmount.toFixed(2)}
              {pledgeType === "per-minute" && "/min"}
            </span>
          </div>
          {pledgeType === "per-minute" && minutesRead !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minutes Read</span>
              <span className="font-medium text-foreground">{minutesRead}</span>
            </div>
          )}
        </div>

        {/* Calculated Amount */}
        {calculatedAmount !== undefined && (
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-muted-foreground">Total Pledge</span>
            <span className="text-xl font-semibold text-primary">
              ${calculatedAmount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Payment Action */}
        {showPaymentButton && (
          <div className="mt-4">
            <Button
              variant="default"
              size="sm"
              onClick={onPaymentAction}
              className="w-full"
            >
              <DollarSign className="h-4 w-4" />
              Record Payment
            </Button>
          </div>
        )}
      </div>
    );
  }
);
PledgeCard.displayName = "PledgeCard";

export { PledgeCard };
export type { PledgeStatus, PledgeType };
