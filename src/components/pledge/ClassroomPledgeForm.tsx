import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField } from "@/components/ui/form-field";
import { DollarSign, Target, Plus, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

export type ClassroomPledgeType = "flat" | "milestone";

export interface MilestoneTier {
  id: string;
  amount: string;
  minutesTarget: string;
}

const FLAT_AMOUNT_OPTIONS = [25, 50, 100, 250];
const SUGGESTED_MILESTONES = [1000, 2000, 3000, 5000];

interface ClassroomPledgeFormProps {
  pledgeType: ClassroomPledgeType;
  onPledgeTypeChange: (type: ClassroomPledgeType) => void;
  flatAmount: string;
  onFlatAmountChange: (amount: string) => void;
  milestoneTiers: MilestoneTier[];
  onMilestoneTiersChange: (tiers: MilestoneTier[]) => void;
  className: string;
  teacherName?: string | null;
}

export function ClassroomPledgeForm({
  pledgeType,
  onPledgeTypeChange,
  flatAmount,
  onFlatAmountChange,
  milestoneTiers,
  onMilestoneTiersChange,
  className,
  teacherName,
}: ClassroomPledgeFormProps) {
  const addMilestoneTier = () => {
    const newTier: MilestoneTier = {
      id: crypto.randomUUID(),
      amount: "25",
      minutesTarget: "",
    };
    onMilestoneTiersChange([...milestoneTiers, newTier]);
  };

  const updateMilestoneTier = (id: string, field: keyof MilestoneTier, value: string) => {
    onMilestoneTiersChange(
      milestoneTiers.map((tier) =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    );
  };

  const removeMilestoneTier = (id: string) => {
    onMilestoneTiersChange(milestoneTiers.filter((tier) => tier.id !== id));
  };

  const totalMilestoneAmount = milestoneTiers.reduce(
    (sum, t) => sum + (parseFloat(t.amount) || 0),
    0
  );

  return (
    <div 
      className="bg-background p-6 md:p-8 shadow-md space-y-6"
      style={handDrawnBorder}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="font-serif text-2xl text-primary mb-2">
          Support {className}
        </h2>
        {teacherName && (
          <p className="text-muted-foreground">{teacherName}'s class</p>
        )}
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
          onValueChange={(value) => onPledgeTypeChange(value as ClassroomPledgeType)}
          className="space-y-3"
        >
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
                <span className="font-medium">Fixed Donation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Donate a specific amount to support the class
              </p>
            </div>
          </Label>

          <Label 
            htmlFor="milestone" 
            className={cn(
              "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
              pledgeType === "milestone" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="milestone" id="milestone" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-medium">Reading Milestone</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pledge unlocks when the class reads a target number of minutes
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
          <span>{pledgeType === "milestone" ? "Set Milestones" : "Choose Amount"}</span>
        </div>

        {pledgeType === "flat" ? (
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
              helperText="Your donation will be added to the class fundraising total"
            >
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="flatAmount"
                  type="number"
                  value={flatAmount}
                  onChange={(e) => onFlatAmountChange(e.target.value)}
                  min={1}
                  className="h-12 pl-8"
                  placeholder="50"
                />
              </div>
            </FormField>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Set reading goals for the class. Your pledge unlocks when they hit each milestone!
            </p>

            {milestoneTiers.map((tier, index) => (
              <div
                key={tier.id}
                className="p-4 rounded-lg border-2 border-border space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Milestone {index + 1}
                  </span>
                  {milestoneTiers.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestoneTier(tier.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="When class reads" htmlFor={`minutes-${tier.id}`}>
                    <div className="relative">
                      <Input
                        id={`minutes-${tier.id}`}
                        type="number"
                        value={tier.minutesTarget}
                        onChange={(e) =>
                          updateMilestoneTier(tier.id, "minutesTarget", e.target.value)
                        }
                        min={1}
                        className="h-12 pr-16"
                        placeholder="1000"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        minutes
                      </span>
                    </div>
                  </FormField>

                  <FormField label="I'll donate" htmlFor={`amount-${tier.id}`}>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id={`amount-${tier.id}`}
                        type="number"
                        value={tier.amount}
                        onChange={(e) =>
                          updateMilestoneTier(tier.id, "amount", e.target.value)
                        }
                        min={1}
                        className="h-12 pl-8"
                        placeholder="25"
                      />
                    </div>
                  </FormField>
                </div>

                {/* Quick milestone suggestions */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground mr-2">Quick set:</span>
                  {SUGGESTED_MILESTONES.map((mins) => (
                    <Button
                      key={mins}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() =>
                        updateMilestoneTier(tier.id, "minutesTarget", String(mins))
                      }
                    >
                      {mins.toLocaleString()} min
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addMilestoneTier}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Milestone
            </Button>
          </div>
        )}
      </div>

      {/* Summary */}
      {(pledgeType === "flat" ? parseFloat(flatAmount) > 0 : totalMilestoneAmount > 0) && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <p className="text-foreground">
              {pledgeType === "flat" ? (
                <>
                  You're pledging <strong>${parseFloat(flatAmount).toFixed(2)}</strong> to support {className}
                </>
              ) : (
                <>
                  Total potential pledge: <strong>${totalMilestoneAmount.toFixed(2)}</strong> across {milestoneTiers.length} milestone{milestoneTiers.length > 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}