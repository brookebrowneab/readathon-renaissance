import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
}

interface MobileFormStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function MobileFormStepper({
  steps,
  currentStep,
  className,
}: MobileFormStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="relative h-1 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-brand-blue transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center",
                steps.length <= 4 && "flex-1"
              )}
            >
              {/* Step Circle */}
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  isCompleted && "bg-brand-blue text-white",
                  isCurrent && "bg-brand-blue text-white ring-4 ring-brand-blue/20",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "text-xs mt-1 text-center max-w-[60px] truncate",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Native-like form inputs for mobile
interface MobileNativeDateInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  min?: string;
  max?: string;
  className?: string;
}

export function MobileNativeDateInput({
  value,
  onChange,
  label,
  min,
  max,
  className,
}: MobileNativeDateInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground text-base touch-target"
      />
    </div>
  );
}

interface MobileNativeNumberInputProps {
  value: number | string;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function MobileNativeNumberInput({
  value,
  onChange,
  label,
  min,
  max,
  step = 1,
  placeholder,
  prefix,
  suffix,
  className,
}: MobileNativeNumberInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) {
              onChange(num);
            }
          }}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 rounded-lg border border-input bg-background text-foreground text-base text-center touch-target",
            prefix && "pl-8",
            suffix && "pr-12"
          )}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

interface MobileNativeSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export function MobileNativeSelect({
  value,
  onChange,
  options,
  label,
  placeholder,
  className,
}: MobileNativeSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground text-base touch-target appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          backgroundSize: "16px",
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
