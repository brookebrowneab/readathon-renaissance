import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BookContainer, ReadingGoalRing, Logo } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { 
  CreditCard, 
  Mail, 
  FileText, 
  Calculator, 
  ChevronDown,
  ChevronUp,
  Check,
  Heart,
  Users
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
});

const AMOUNT_OPTIONS = [25, 50, 100];

type PaymentMethod = "card" | "later" | "check" | null;

const SponsorLandingPage = () => {
  const { token, code } = useParams<{ token?: string; code?: string }>();
  const identifier = token || code || "demo";
  
  const [data] = useState(() => getMockData(identifier));
  const [sponsorName, setSponsorName] = useState(data.inviteeName);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [showPerMinute, setShowPerMinute] = useState(false);
  const [perMinuteRate, setPerMinuteRate] = useState("0.05");
  const [usePerMinute, setUsePerMinute] = useState(false);
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
      {/* Header */}
      <header className="bg-card border-b py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo size="header" />
          <p className="text-lg text-muted-foreground">
            Invited by <span className="text-foreground font-medium">{data.parentFirstName}</span>
          </p>
        </div>
      </header>

      <main className="px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
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
                <span>Goal: <strong className="text-foreground">{data.readingGoal} minutes</strong></span>
                <span className="hidden sm:inline">•</span>
                <span><strong className="text-foreground">{data.daysLeft}</strong> days left</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-lg text-brand-blue">
                <Users className="h-5 w-5" />
                <span><strong>{data.sponsorCount}</strong> sponsors cheering them on!</span>
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

              {/* Pledge Amount */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-foreground">
                  How much would you like to pledge?
                </label>
                
                {/* Amount Buttons */}
                <div className="grid grid-cols-4 gap-3">
                  {AMOUNT_OPTIONS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                        setUsePerMinute(false);
                      }}
                      className={cn(
                        "h-16 rounded-xl text-2xl font-bold transition-all border-2",
                        selectedAmount === amount && !customAmount && !usePerMinute
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      ${amount}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAmount(null);
                      setUsePerMinute(false);
                      // Focus the custom input
                    }}
                    className={cn(
                      "h-16 rounded-xl text-lg font-medium transition-all border-2",
                      customAmount && !usePerMinute
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    Other
                  </button>
                </div>

                {/* Custom Amount Input */}
                {(selectedAmount === null || customAmount) && !usePerMinute && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min={1}
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      placeholder="Enter amount"
                      className="h-14 text-xl pl-10"
                      autoFocus
                    />
                  </div>
                )}

                {/* Per Minute Option */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPerMinute(!showPerMinute)}
                    className="flex items-center gap-2 text-primary hover:underline text-lg"
                  >
                    {showPerMinute ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    More options
                  </button>

                  {showPerMinute && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-xl space-y-4">
                      <button
                        type="button"
                        onClick={() => setUsePerMinute(!usePerMinute)}
                        className={cn(
                          "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3",
                          usePerMinute
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                          usePerMinute ? "border-primary" : "border-muted-foreground"
                        )}>
                          {usePerMinute && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                        <span className="text-lg">Pledge per minute read</span>
                      </button>

                      {usePerMinute && (
                        <div className="space-y-4 pl-9">
                          <div className="flex items-center gap-3">
                            <span className="text-lg text-muted-foreground">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              min={0.01}
                              value={perMinuteRate}
                              onChange={(e) => setPerMinuteRate(e.target.value)}
                              className="h-12 text-lg w-24"
                            />
                            <span className="text-lg text-muted-foreground">per minute</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-lg text-muted-foreground">
                            <Calculator className="h-5 w-5" />
                            <span>
                              At {data.readingGoal} minutes = <strong className="text-foreground">${calculatedPerMinute.toFixed(2)}</strong>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              {effectiveAmount && effectiveAmount > 0 && (
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-foreground">
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