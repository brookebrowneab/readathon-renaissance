import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pencil, DollarSign, Clock } from "lucide-react";

export interface EditablePledge {
  id: string;
  student_name: string;
  pledge_type: string;
  amount: number;
}

interface EditPledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pledge: EditablePledge | null;
  onSave: (id: string, pledgeType: string, amount: number) => void;
  isLoading?: boolean;
}

export function EditPledgeDialog({
  open,
  onOpenChange,
  pledge,
  onSave,
  isLoading = false,
}: EditPledgeDialogProps) {
  const [pledgeType, setPledgeType] = useState<string>("flat");
  const [amount, setAmount] = useState<string>("");

  // Reset form when pledge changes
  useEffect(() => {
    if (pledge) {
      setPledgeType(pledge.pledge_type);
      setAmount(pledge.amount.toString());
    }
  }, [pledge]);

  const handleSave = () => {
    if (!pledge) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    onSave(pledge.id, pledgeType, numAmount);
  };

  const isValid = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            Edit Pledge
          </DialogTitle>
          <DialogDescription>
            Update the pledge for {pledge?.student_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pledge Type */}
          <div className="space-y-3">
            <Label>Pledge Type</Label>
            <RadioGroup
              value={pledgeType}
              onValueChange={setPledgeType}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <RadioGroupItem
                  value="flat"
                  id="edit-flat"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="edit-flat"
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                >
                  <DollarSign className="h-5 w-5 mb-2" />
                  <span className="text-sm font-medium">Fixed Amount</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="per_minute"
                  id="edit-per-minute"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="edit-per-minute"
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                >
                  <Clock className="h-5 w-5 mb-2" />
                  <span className="text-sm font-medium">Per Minute</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="edit-amount">
              {pledgeType === "flat" ? "Amount ($)" : "Amount per minute ($)"}
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="edit-amount"
                type="number"
                step={pledgeType === "flat" ? "1" : "0.01"}
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9"
                placeholder={pledgeType === "flat" ? "25" : "0.05"}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {pledgeType === "flat"
                ? "A one-time donation amount"
                : "Amount donated for each minute read"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid() || isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
