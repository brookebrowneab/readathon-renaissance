import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Lock, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SquareCardFormProps {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  cardholderName: string;
  onCardholderNameChange: (name: string) => void;
  zipCode: string;
  onZipCodeChange: (zip: string) => void;
}

export function SquareCardForm({
  isLoading,
  isReady,
  error,
  cardholderName,
  onCardholderNameChange,
  zipCode,
  onZipCodeChange,
}: SquareCardFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-destructive">Payment form unavailable</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormField label="Cardholder Name" htmlFor="cardName" required>
        <Input
          id="cardName"
          placeholder="Name on card"
          value={cardholderName}
          onChange={(e) => onCardholderNameChange(e.target.value)}
        />
      </FormField>

      <FormField label="Card Details" htmlFor="square-card" required>
        <div className="relative">
          {isLoading && (
            <Skeleton className="h-12 w-full rounded-lg" />
          )}
          <div
            id="square-card-container"
            ref={containerRef}
            className={`min-h-[48px] ${isLoading ? "hidden" : ""}`}
          />
        </div>
      </FormField>

      <FormField label="Billing ZIP Code" htmlFor="zip" required>
        <Input
          id="zip"
          placeholder="12345"
          value={zipCode}
          onChange={(e) => onZipCodeChange(e.target.value.replace(/\D/g, "").substring(0, 5))}
          maxLength={5}
        />
      </FormField>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Your payment info is secure and encrypted by Square</span>
      </div>
    </div>
  );
}

export default SquareCardForm;