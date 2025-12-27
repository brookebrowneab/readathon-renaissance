import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMinutesStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

// Attempt haptic feedback
const triggerHaptic = () => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
};

export function MobileMinutesStepper({
  value,
  onChange,
  min = 1,
  max = 180,
  className,
}: MobileMinutesStepperProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleIncrement = useCallback(
    (amount: number) => {
      triggerHaptic();
      onChange(Math.min(max, Math.max(min, value + amount)));
    },
    [value, onChange, min, max]
  );

  const handleDecrement = useCallback(
    (amount: number) => {
      triggerHaptic();
      onChange(Math.min(max, Math.max(min, value - amount)));
    },
    [value, onChange, min, max]
  );

  const handlePresetClick = (preset: number) => {
    triggerHaptic();
    onChange(preset);
  };

  const handleCustomSubmit = () => {
    const num = parseInt(customValue, 10);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)));
    }
    setShowCustomInput(false);
    setCustomValue("");
  };

  const presets = [
    { value: 15, size: "h-6 w-6" },
    { value: 30, size: "h-8 w-8" },
    { value: 45, size: "h-9 w-9" },
    { value: 60, size: "h-10 w-10" },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Large Stepper Buttons */}
      <div className="flex items-center justify-center gap-6">
        <Button
          variant="outline"
          className="h-14 w-14 rounded-full text-2xl font-bold border-2 hover:bg-brand-blue hover:text-white hover:border-brand-blue active:scale-95 touch-target"
          onClick={() => handleDecrement(5)}
        >
          <Minus className="h-7 w-7" />
        </Button>

        <div className="flex flex-col items-center min-w-[100px]">
          <span className="font-handwritten text-6xl text-brand-blue leading-none">
            {value}
          </span>
          <span className="text-muted-foreground text-lg">minutes</span>
        </div>

        <Button
          variant="outline"
          className="h-14 w-14 rounded-full text-2xl font-bold border-2 hover:bg-brand-blue hover:text-white hover:border-brand-blue active:scale-95 touch-target"
          onClick={() => handleIncrement(5)}
        >
          <Plus className="h-7 w-7" />
        </Button>
      </div>

      {/* 2x2 Preset Grid */}
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all touch-target active:scale-95",
              value === preset.value
                ? "border-brand-blue bg-brand-blue/10"
                : "border-border hover:border-brand-blue/50"
            )}
          >
            <BookOpen className={cn("text-brand-blue", preset.size)} />
            <span className="font-handwritten text-xl text-brand-blue">
              {preset.value} min
            </span>
          </button>
        ))}
      </div>

      {/* Custom Input Toggle */}
      {showCustomInput ? (
        <div className="flex gap-2">
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Enter minutes"
            className="h-12 text-lg text-center"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCustomSubmit();
            }}
          />
          <Button onClick={handleCustomSubmit} className="h-12 px-6">
            Set
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowCustomInput(false)}
            className="h-12"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full h-12 text-base"
          onClick={() => setShowCustomInput(true)}
        >
          Enter exact minutes
        </Button>
      )}
    </div>
  );
}
