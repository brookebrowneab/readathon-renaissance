import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookContainer } from "@/components/legacy";
import { TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export type PledgeType = "per_minute" | "flat";

interface PledgeAmountFormProps {
  pledgeType: PledgeType;
  perMinuteAmount: string;
  flatAmount: string;
  maxPledgeCap: string;
  projectedMinutes: number;
  onPledgeTypeChange: (type: PledgeType) => void;
  onPerMinuteChange: (value: string) => void;
  onFlatAmountChange: (value: string) => void;
  onMaxCapChange: (value: string) => void;
  recipientName?: string;
}

export function PledgeAmountForm({
  pledgeType,
  perMinuteAmount,
  flatAmount,
  maxPledgeCap,
  projectedMinutes,
  onPledgeTypeChange,
  onPerMinuteChange,
  onFlatAmountChange,
  onMaxCapChange,
  recipientName = "this reader",
}: PledgeAmountFormProps) {
  const calculateProjected = () => {
    if (pledgeType === "flat") return parseFloat(flatAmount) || 0;
    const perMin = parseFloat(perMinuteAmount) || 0;
    const cap = parseFloat(maxPledgeCap) || Infinity;
    return Math.min(projectedMinutes * perMin, cap);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Set Your Pledge</h2>
        <p className="text-muted-foreground">
          Choose how much to pledge for {recipientName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Per-Minute Card */}
        <Card
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            pledgeType === "per_minute" && "ring-2 ring-primary"
          )}
          onClick={() => onPledgeTypeChange("per_minute")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Per Minute</h3>
                <p className="text-sm text-muted-foreground">Pledge per minute read</p>
              </div>
            </div>

            {pledgeType === "per_minute" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Amount per minute ($0.01 - $1.00)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="1.00"
                      className="pl-7"
                      value={perMinuteAmount}
                      onChange={(e) => onPerMinuteChange(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {["0.03", "0.05", "0.10", "0.25"].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1",
                        perMinuteAmount === amount && "border-primary text-primary"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPerMinuteChange(amount);
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Maximum cap (optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="1"
                      min="1"
                      className="pl-7"
                      placeholder="No limit"
                      value={maxPledgeCap}
                      onChange={(e) => onMaxCapChange(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flat Amount Card */}
        <Card
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            pledgeType === "flat" && "ring-2 ring-primary"
          )}
          onClick={() => onPledgeTypeChange("flat")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Flat Amount</h3>
                <p className="text-sm text-muted-foreground">One-time gift</p>
              </div>
            </div>

            {pledgeType === "flat" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Donation amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="1"
                      min="1"
                      className="pl-7"
                      value={flatAmount}
                      onChange={(e) => onFlatAmountChange(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {["10", "25", "50", "100"].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1",
                        flatAmount === amount && "border-primary text-primary"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onFlatAmountChange(amount);
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Projected Amount */}
      <BookContainer variant="warm" className="p-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Projected pledge at goal ({projectedMinutes.toLocaleString()} min)
          </p>
          <p className="font-handwritten text-3xl text-primary">
            ${calculateProjected().toFixed(2)}
          </p>
        </div>
      </BookContainer>
    </div>
  );
}
