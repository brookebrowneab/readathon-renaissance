import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

export type PledgeType = "per_minute" | "flat";

const PER_MINUTE_OPTIONS = ["0.03", "0.05", "0.10", "0.25"];
const FLAT_AMOUNT_OPTIONS = [10, 25, 50, 100];

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

  const projectedAmount = calculateProjected();

  return (
    <div 
      className="bg-background p-6 md:p-8 shadow-md space-y-6"
      style={handDrawnBorder}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="font-serif text-2xl text-primary mb-2">Set Your Pledge</h2>
        <p className="text-muted-foreground">
          Choose how much to pledge for {recipientName}
        </p>
      </div>

      {/* Step 1: Pledge Type */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-medium">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            1
          </div>
          <span>Choose Pledge Type</span>
        </div>

        <RadioGroup
          value={pledgeType}
          onValueChange={(value) => onPledgeTypeChange(value as PledgeType)}
          className="space-y-3"
        >
          <Label 
            htmlFor="per_minute" 
            className={cn(
              "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
              pledgeType === "per_minute" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="per_minute" id="per_minute" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-medium">Per Minute</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pledge per minute read — grows with their progress!
              </p>
            </div>
          </Label>

          <Label 
            htmlFor="flat" 
            className={cn(
              "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
              pledgeType === "flat" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="flat" id="flat" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium">Flat Amount</span>
              </div>
              <p className="text-sm text-muted-foreground">
                One-time gift regardless of minutes read
              </p>
            </div>
          </Label>
        </RadioGroup>
      </div>

      {/* Step 2: Amount */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-lg font-medium">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            2
          </div>
          <span>{pledgeType === "per_minute" ? "Set Your Rate" : "Choose Amount"}</span>
        </div>

        {pledgeType === "per_minute" ? (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-4 gap-3">
              {PER_MINUTE_OPTIONS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => onPerMinuteChange(amount)}
                  className={cn(
                    "h-14 rounded-lg border-2 font-medium text-lg transition-all",
                    perMinuteAmount === amount
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <FormField 
              label="Or enter a custom amount ($0.01 - $1.00)" 
              htmlFor="perMinuteAmount"
            >
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="perMinuteAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1.00"
                  className="h-12 pl-8"
                  value={perMinuteAmount}
                  onChange={(e) => onPerMinuteChange(e.target.value)}
                />
              </div>
            </FormField>

            <FormField 
              label="Maximum cap (optional)" 
              htmlFor="maxCap"
              helperText="Limit your total pledge amount"
            >
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="maxCap"
                  type="number"
                  step="1"
                  min="1"
                  className="h-12 pl-8"
                  placeholder="No limit"
                  value={maxPledgeCap}
                  onChange={(e) => onMaxCapChange(e.target.value)}
                />
              </div>
            </FormField>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-4 gap-3">
              {FLAT_AMOUNT_OPTIONS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => onFlatAmountChange(String(amount))}
                  className={cn(
                    "h-14 rounded-lg border-2 font-medium text-lg transition-all",
                    flatAmount === String(amount)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <FormField 
              label="Or enter a custom amount" 
              htmlFor="flatAmount"
            >
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="flatAmount"
                  type="number"
                  step="1"
                  min="1"
                  className="h-12 pl-8"
                  value={flatAmount}
                  onChange={(e) => onFlatAmountChange(e.target.value)}
                />
              </div>
            </FormField>
          </div>
        )}
      </div>

      {/* Summary */}
      {projectedAmount > 0 && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <p className="text-foreground">
              {pledgeType === "per_minute" ? (
                <>
                  Projected pledge at goal ({projectedMinutes.toLocaleString()} min): <strong>${projectedAmount.toFixed(2)}</strong>
                  {maxPledgeCap && <span className="text-muted-foreground"> (capped at ${maxPledgeCap})</span>}
                </>
              ) : (
                <>
                  You're pledging <strong>${projectedAmount.toFixed(2)}</strong> for {recipientName}
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}