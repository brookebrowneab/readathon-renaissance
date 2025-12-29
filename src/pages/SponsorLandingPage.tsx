import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { 
  CreditCard, 
  Mail, 
  FileText, 
  Check,
  Users,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data - in real app this would come from API based on token/code
const getMockData = (code: string) => ({
  parentFirstName: "Sarah",
  childFirstName: "Emma",
  childLastInitial: "J",
  grade: "3rd",
  schoolName: "Lincoln Elementary",
  readingGoal: 500,
  minutesRead: 335,
  daysLeft: 12,
  sponsorCount: 4,
  inviteeName: code.includes("grandma") ? "Grandma Betty" : "",
  // TODO: Calculate from historical reading event data
  // These stats should be fetched from the database based on:
  // - Previous year(s) reading logs for this grade level
  // - Could aggregate across all past events or just most recent year
  gradeStats: {
    avgMinutes: 412,      // TODO: AVG(total_minutes) WHERE grade = student.grade
    maxMinutes: 687,      // TODO: MAX(total_minutes) WHERE grade = student.grade
    participantCount: 48, // TODO: COUNT(*) WHERE grade = student.grade
  },
});

const AMOUNT_OPTIONS = [25, 50, 100];

type PaymentMethod = "card" | "later" | "check" | null;

const SponsorLandingPage = () => {
  const { token, code } = useParams<{ token?: string; code?: string }>();
  const identifier = token || code || "demo";
  
  const [data] = useState(() => getMockData(identifier));
  const [sponsorName, setSponsorName] = useState(data.inviteeName);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [perMinuteRate, setPerMinuteRate] = useState("0.10");
  const [usePerMinute, setUsePerMinute] = useState(true); // Default to per-minute
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Card form fields (mock - would use Square SDK in production)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardZip, setCardZip] = useState("");

  const effectiveAmount = useMemo(() => {
    if (usePerMinute) {
      return parseFloat(perMinuteRate) * data.readingGoal;
    }
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  }, [selectedAmount, customAmount, usePerMinute, perMinuteRate, data.readingGoal]);

  const calculatedPerMinute = useMemo(() => {
    return parseFloat(perMinuteRate || "0") * data.readingGoal;
  }, [perMinuteRate, data.readingGoal]);

  const isFormValid = useMemo(() => {
    if (!sponsorName.trim()) return false;
    if (!effectiveAmount || effectiveAmount <= 0) return false;
    if (!paymentMethod) return false;
    if (paymentMethod === "card") {
      return cardNumber.length >= 15 && cardExpiry.length >= 4 && cardCvv.length >= 3 && cardZip.length >= 5;
    }
    return true;
  }, [sponsorName, effectiveAmount, paymentMethod, cardNumber, cardExpiry, cardCvv, cardZip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Thank you for your $${effectiveAmount?.toFixed(2)} pledge!`);
    setIsSubmitting(false);
  };

  const progress = Math.round((data.minutesRead / data.readingGoal) * 100);

  return (
    <div className="min-h-screen bg-background-warm">
      <PageHeader 
        rightContent={
          <p className="text-lg text-muted-foreground">
            Invited by <span className="text-foreground font-medium">{data.parentFirstName}</span>
          </p>
        }
      />

      <main className="px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground">
              Support {data.childFirstName}'s Reading!
            </h1>
            
            <div className="flex justify-center">
              <ReadingGoalRing 
                progress={data.minutesRead} 
                goal={data.readingGoal} 
                size={200}
                mobileSize={180}
              />
            </div>

            <div className="space-y-2">
              <p className="text-xl text-foreground">
                <span className="font-medium">{data.childFirstName}</span> is a {data.grade} grader at {data.schoolName}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-lg text-muted-foreground">
                <span>Goal: <span className="font-handwritten text-2xl text-brand-blue">{data.readingGoal} min</span></span>
                <span className="hidden sm:inline">•</span>
                <span><span className="font-handwritten text-2xl text-brand-blue">{data.daysLeft}</span> days left</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-lg text-brand-blue">
                <Users className="h-5 w-5" />
                <span><span className="font-handwritten text-2xl">{data.sponsorCount}</span> sponsors cheering them on!</span>
              </div>
            </div>
          </section>

          {/* Pledge Section */}
          <BookContainer variant="default" className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Sponsor Name */}
              <FormField 
                label="Your name" 
                htmlFor="sponsorName"
                className="text-lg"
              >
                <Input
                  id="sponsorName"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-14 text-lg"
                  required
                />
              </FormField>

              {/* Pledge Type Selection */}
              <div className="space-y-4">
                <label className="block font-serif text-xl text-foreground">
                  Choose how you'd like to pledge
                </label>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Per Minute Option - First/Prominent */}
                  <button
                    type="button"
                    onClick={() => {
                      setUsePerMinute(true);
                      setSelectedAmount(null);
                      setCustomAmount("");
                    }}
                    className={cn(
                      "p-5 rounded-xl border-2 text-left transition-all",
                      usePerMinute
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0",
                        usePerMinute ? "border-primary" : "border-muted-foreground"
                      )}>
                        {usePerMinute && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-lg text-foreground mb-1">Per minute read</p>
                        <p className="text-muted-foreground text-sm mb-3">
                          The more they read, the more they earn!
                        </p>
                        <p className="font-handwritten text-2xl text-brand-blue">
                          e.g. $0.10/min → ${(0.10 * data.readingGoal).toFixed(0)} if goal met
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Flat Amount Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setUsePerMinute(false);
                      if (!selectedAmount && !customAmount) {
                        setSelectedAmount(50);
                      }
                    }}
                    className={cn(
                      "p-5 rounded-xl border-2 text-left transition-all",
                      !usePerMinute
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0",
                        !usePerMinute ? "border-primary" : "border-muted-foreground"
                      )}>
                        {!usePerMinute && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-lg text-foreground mb-1">Flat amount</p>
                        <p className="text-muted-foreground text-sm mb-3">
                          A simple, one-time gift
                        </p>
                        <p className="font-handwritten text-2xl text-brand-blue">
                          e.g. $25, $50, $100
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount Configuration */}
              <div className="space-y-4">
                <label className="block font-serif text-xl text-foreground">
                  {usePerMinute ? "Set your per-minute rate" : "Choose your amount"}
                </label>

                {usePerMinute ? (
                  /* Per Minute Rate Selection */
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      {[0.05, 0.10, 0.15, 0.25].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setPerMinuteRate(rate.toString())}
                          className={cn(
                            "h-16 rounded-xl font-handwritten text-2xl transition-all border-2",
                            parseFloat(perMinuteRate) === rate
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-primary/50"
                          )}
                        >
                          ${rate.toFixed(2)}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-muted-foreground">Or enter custom:</span>
                      <div className="relative w-28">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          min={0.01}
                          value={perMinuteRate}
                          onChange={(e) => setPerMinuteRate(e.target.value)}
                          className="h-12 text-lg pl-8"
                        />
                      </div>
                      <span className="text-lg text-muted-foreground">/min</span>
                    </div>

                    {/* Calculation Display */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-muted-foreground">
                          If {data.childFirstName} reaches their goal ({data.readingGoal} min):
                        </span>
                        <span className="font-handwritten text-3xl text-brand-blue">
                          ${calculatedPerMinute.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="border-t border-border pt-3 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Last year's {data.grade} graders ({data.gradeStats.participantCount} students):
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-background rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Average read</p>
                            <p className="font-handwritten text-xl text-foreground">
                              {data.gradeStats.avgMinutes} min
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ≈ ${(parseFloat(perMinuteRate) * data.gradeStats.avgMinutes).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-background rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Top reader</p>
                            <p className="font-handwritten text-xl text-foreground">
                              {data.gradeStats.maxMinutes} min
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ≈ ${(parseFloat(perMinuteRate) * data.gradeStats.maxMinutes).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Flat Amount Selection */
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      {AMOUNT_OPTIONS.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                          }}
                          className={cn(
                            "h-16 rounded-xl font-handwritten text-3xl transition-all border-2",
                            selectedAmount === amount && !customAmount
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-primary/50"
                          )}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg text-muted-foreground">Or enter custom:</span>
                      <div className="relative flex-1 max-w-[160px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">$</span>
                        <Input
                          type="number"
                          min={1}
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                          placeholder="Amount"
                          className="h-12 text-lg pl-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              {effectiveAmount && effectiveAmount > 0 && (
                <div className="space-y-4">
                  <label className="block font-serif text-xl text-foreground">
                    How would you like to pay?
                  </label>

                  <div className="space-y-3">
                    {/* Pay Now */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={cn(
                        "w-full p-5 rounded-xl border-2 text-left transition-all",
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-7 w-7 text-primary" />
                        <span className="text-xl font-medium">Pay now by card</span>
                      </div>
                    </button>

                    {paymentMethod === "card" && (
                      <div className="ml-4 p-4 bg-muted/30 rounded-xl space-y-4">
                        <FormField label="Card number">
                          <Input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                            className="h-14 text-lg"
                          />
                        </FormField>
                        <div className="grid grid-cols-3 gap-3">
                          <FormField label="Expiry">
                            <Input
                              type="text"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                              className="h-14 text-lg"
                            />
                          </FormField>
                          <FormField label="CVV">
                            <Input
                              type="text"
                              placeholder="123"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              className="h-14 text-lg"
                            />
                          </FormField>
                          <FormField label="ZIP Code">
                            <Input
                              type="text"
                              placeholder="12345"
                              value={cardZip}
                              onChange={(e) => setCardZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                              className="h-14 text-lg"
                            />
                          </FormField>
                        </div>
                      </div>
                    )}

                    {/* Pay Later */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("later")}
                      className={cn(
                        "w-full p-5 rounded-xl border-2 text-left transition-all",
                        paymentMethod === "later"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <Mail className="h-7 w-7 text-primary" />
                        <div>
                          <span className="text-xl font-medium">Pay later</span>
                          <p className="text-muted-foreground">We'll email you when it's time</p>
                        </div>
                      </div>
                    </button>

                    {/* Mail a Check */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("check")}
                      className={cn(
                        "w-full p-5 rounded-xl border-2 text-left transition-all",
                        paymentMethod === "check"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-7 w-7 text-primary" />
                        <span className="text-xl font-medium">Mail a check</span>
                      </div>
                    </button>

                    {paymentMethod === "check" && (
                      <div className="ml-4 p-4 bg-muted/30 rounded-xl">
                        <p className="text-lg text-foreground mb-2">Make check payable to:</p>
                        <p className="font-medium text-lg">{data.schoolName} PTA</p>
                        <p className="text-muted-foreground">Memo: Read-a-thon - {data.childFirstName} {data.childLastInitial}.</p>
                        <p className="text-muted-foreground mt-2">Mail to:</p>
                        <p className="text-foreground">
                          {data.schoolName}<br />
                          123 Education Lane<br />
                          Anytown, CA 90210
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                loading={isSubmitting}
                className="w-full h-16 text-xl font-bold"
              >
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <>
                    <Heart className="h-6 w-6 mr-2" />
                    Complete My ${effectiveAmount?.toFixed(2) || "0"} Pledge
                  </>
                )}
              </Button>
            </form>
          </BookContainer>

          {/* Footer */}
          <footer className="text-center text-lg text-muted-foreground pb-8">
            <p>
              Questions? Contact {data.parentFirstName} or email{" "}
              <a href="mailto:help@school.org" className="text-primary hover:underline">
                help@school.org
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default SponsorLandingPage;