import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField } from "@/components/ui/form-field";
import { DollarSign, Target, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ClassroomPledgeType = "flat" | "milestone";

export interface MilestoneTier {
  id: string;
  amount: string;
  minutesTarget: string;
}

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

  const suggestedMilestones = [1000, 2000, 3000, 5000];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">
          Support {className}
        </h2>
        {teacherName && (
          <p className="text-muted-foreground">{teacherName}'s class</p>
        )}
      </div>

      {/* Pledge Type Selection */}
      <RadioGroup
        value={pledgeType}
        onValueChange={(value) => onPledgeTypeChange(value as ClassroomPledgeType)}
        className="grid gap-4 md:grid-cols-2"
      >
        <Label htmlFor="flat" className="cursor-pointer">
          <Card
            className={cn(
              "transition-all hover:shadow-md",
              pledgeType === "flat" && "ring-2 ring-primary"
            )}
          >
            <CardContent className="p-4 flex items-start gap-4">
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
            </CardContent>
          </Card>
        </Label>

        <Label htmlFor="milestone" className="cursor-pointer">
          <Card
            className={cn(
              "transition-all hover:shadow-md",
              pledgeType === "milestone" && "ring-2 ring-primary"
            )}
          >
            <CardContent className="p-4 flex items-start gap-4">
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
            </CardContent>
          </Card>
        </Label>
      </RadioGroup>

      {/* Flat Donation Form */}
      {pledgeType === "flat" && (
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <FormField
              label="Donation Amount"
              htmlFor="flatAmount"
              helperText="Your donation will be added to the class fundraising total"
            >
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="flatAmount"
                  type="number"
                  value={flatAmount}
                  onChange={(e) => onFlatAmountChange(e.target.value)}
                  min={1}
                  className="pl-7"
                  placeholder="50"
                />
              </div>
            </FormField>

            {/* Quick amount buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[10, 25, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant={flatAmount === String(amount) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFlatAmountChange(String(amount))}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestone Tiers Form */}
      {pledgeType === "milestone" && (
        <Card className="animate-fade-in">
          <CardContent className="p-6 space-y-6">
            <p className="text-sm text-muted-foreground">
              Set reading goals for the class. Your pledge unlocks when they hit each milestone!
            </p>

            {milestoneTiers.map((tier, index) => (
              <div
                key={tier.id}
                className="p-4 border rounded-lg space-y-4 relative"
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
                        className="pl-7"
                        placeholder="25"
                      />
                    </div>
                  </FormField>
                </div>

                {/* Quick milestone suggestions */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground mr-2">Quick set:</span>
                  {suggestedMilestones.map((mins) => (
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
