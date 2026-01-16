import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DollarSign, Calculator, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const FIXED_AMOUNTS = [25, 50, 100];

const OnboardingPledge = () => {
  const navigate = useNavigate();
  const [childData, setChildData] = useState<{
    firstName: string;
    lastInitial: string;
    readingGoal: number;
  } | null>(null);
  
  const [pledgeType, setPledgeType] = useState<"fixed" | "per-minute" | null>(null);
  const [fixedAmount, setFixedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [perMinuteRate, setPerMinuteRate] = useState("0.05");
  
  const [paymentTiming, setPaymentTiming] = useState<"now" | "later">("later");

  useEffect(() => {
    const stored = sessionStorage.getItem('childData');
    if (stored) {
      setChildData(JSON.parse(stored));
    } else {
      // Redirect if no child data
      navigate('/onboarding/add-child');
    }
  }, [navigate]);

  const effectiveAmount = useMemo(() => {
    if (pledgeType === "fixed") {
      return customAmount ? parseFloat(customAmount) : fixedAmount;
    }
    if (pledgeType === "per-minute") {
      return parseFloat(perMinuteRate);
    }
    return null;
  }, [pledgeType, fixedAmount, customAmount, perMinuteRate]);

  const calculatedPerMinute = useMemo(() => {
    if (!childData) return 0;
    return parseFloat(perMinuteRate) * childData.readingGoal;
  }, [perMinuteRate, childData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store pledge data
    const pledgeData = {
      type: pledgeType,
      amount: pledgeType === "fixed" ? effectiveAmount : null,
      perMinuteRate: pledgeType === "per-minute" ? parseFloat(perMinuteRate) : null,
      paymentTiming,
    };
    
    sessionStorage.setItem('pledgeData', JSON.stringify(pledgeData));
    navigate('/onboarding/complete');
  };

  const handleSkip = () => {
    sessionStorage.removeItem('pledgeData');
    navigate('/onboarding/complete');
  };

  if (!childData) return null;

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
        <div className="w-full max-w-lg">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= 2 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step < 2 ? <Check className="h-4 w-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 ${step < 2 ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          <div 
            className="animate-fade-in bg-card p-8 shadow-book"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="font-serif text-2xl text-foreground">
                  Be {childData.firstName}'s First Sponsor!
                </h1>
                <p className="font-handwritten text-lg text-brand-blue mt-2">
                  Many families start by making their own pledge, then share
                  the link with grandparents and friends.
                </p>
              </div>

              {/* Child Info */}
              <div className="flex items-center justify-center gap-6 py-4 bg-muted/30 rounded-xl">
                <ReadingGoalRing progress={0} goal={childData.readingGoal} size={80} />
                <div className="text-left">
                  <p className="font-medium text-foreground">
                    {childData.firstName} {childData.lastInitial}.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Goal: {childData.readingGoal} minutes
                  </p>
                </div>
              </div>

              {/* Pledge Type Selection */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  {/* Fixed Amount Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPledgeType("fixed");
                      if (!fixedAmount && !customAmount) setFixedAmount(50);
                    }}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      pledgeType === "fixed"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        pledgeType === "fixed" ? "border-primary" : "border-muted-foreground"
                      )}>
                        {pledgeType === "fixed" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Pledge a fixed amount</p>
                        <p className="text-sm text-muted-foreground">
                          One-time donation regardless of minutes read
                        </p>
                      </div>
                    </div>

                    {pledgeType === "fixed" && (
                      <div className="mt-4 pl-8 space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          {FIXED_AMOUNTS.map((amount) => (
                            <Button
                              key={amount}
                              type="button"
                              variant={fixedAmount === amount && !customAmount ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                setFixedAmount(amount);
                                setCustomAmount("");
                              }}
                              className="flex-1"
                            >
                              ${amount}
                            </Button>
                          ))}
                        </div>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            min={1}
                            placeholder="Other amount"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setFixedAmount(null);
                            }}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Per Minute Card */}
                  <button
                    type="button"
                    onClick={() => setPledgeType("per-minute")}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      pledgeType === "per-minute"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        pledgeType === "per-minute" ? "border-primary" : "border-muted-foreground"
                      )}>
                        {pledgeType === "per-minute" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Pledge per minute read</p>
                        <p className="text-sm text-muted-foreground">
                          Donate based on how much they read
                        </p>
                      </div>
                    </div>

                    {pledgeType === "per-minute" && (
                      <div className="mt-4 pl-8 space-y-3" onClick={(e) => e.stopPropagation()}>
                        <FormField label="Amount per minute">
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.01"
                              min={0.01}
                              value={perMinuteRate}
                              onChange={(e) => setPerMinuteRate(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </FormField>

                        {/* Calculator */}
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Calculator className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            At {childData.readingGoal} minutes, that's{" "}
                            <span className="font-medium text-foreground">
                              ${calculatedPerMinute.toFixed(2)}
                            </span>
                          </span>
                        </div>

                      </div>
                    )}
                  </button>
                </div>

                {/* Payment Timing */}
                {pledgeType && effectiveAmount && effectiveAmount > 0 && (
                  <div className="pt-4 border-t">
                    <FormField label="When would you like to pay?">
                      <RadioGroup 
                        value={paymentTiming} 
                        onValueChange={(v) => setPaymentTiming(v as "now" | "later")}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="later" id="later" />
                          <Label htmlFor="later" className="font-normal cursor-pointer">
                            Pay when read-a-thon ends
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="now" id="now" />
                          <Label htmlFor="now" className="font-normal cursor-pointer">
                            Pay now
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormField>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  {pledgeType && effectiveAmount && effectiveAmount > 0 && (
                    <Button type="submit" className="w-full">
                      {pledgeType === "per-minute"
                        ? `Pledge $${effectiveAmount.toFixed(2)} per minute`
                        : paymentTiming === "now" 
                          ? `Pay $${effectiveAmount.toFixed(2)} Now`
                          : `Pledge $${effectiveAmount.toFixed(2)}`
                      }
                    </Button>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Skip for now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default OnboardingPledge;