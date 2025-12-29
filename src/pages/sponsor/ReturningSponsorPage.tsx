import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Mail, 
  FileText, 
  Calculator, 
  ChevronDown,
  ChevronUp,
  Check,
  Heart,
  Users,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import logoSvg from "@/assets/logo.svg";

type PledgeType = "flat" | "per-minute";
type PaymentMethod = "card" | "later" | "check" | null;

// Mock data for returning sponsor
const getMockReturningData = (code: string) => ({
  parentFirstName: "Sarah",
  childFirstName: "Emma",
  childLastInitial: "J",
  grade: "3rd",
  schoolName: "Lincoln Elementary",
  readingGoal: 500,
  minutesRead: 335,
  daysLeft: 12,
  sponsorCount: 4,
  // Returning sponsor data
  sponsorName: "Grandma Betty",
  sponsorEmail: "grandma.betty@email.com",
  lastYearPledge: 50,
  lastYearPledgeType: "flat" as PledgeType,
  lastYearMinutesRead: 485,
  lastYearPaymentMethod: "card" as PaymentMethod,
  lastEventName: "Fall Read-a-thon 2024",
});

const AMOUNT_OPTIONS = [25, 50, 75, 100];

const ReturningSponsorPage = () => {
  const { token, code } = useParams<{ token?: string; code?: string }>();
  const navigate = useNavigate();
  const identifier = token || code || "demo";
  
  const [data] = useState(() => getMockReturningData(identifier));
  
  // Pre-select last year's amount
  const [selectedAmount, setSelectedAmount] = useState<number | null>(data.lastYearPledge);
  const [customAmount, setCustomAmount] = useState("");
  const [showPerMinute, setShowPerMinute] = useState(false);
  const [perMinuteRate, setPerMinuteRate] = useState("0.05");
  const [usePerMinute, setUsePerMinute] = useState(data.lastYearPledgeType === "per-minute");
  
  // Pre-select last payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(data.lastYearPaymentMethod);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  
  // Card form fields
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

  const isSameAsLastYear = selectedAmount === data.lastYearPledge && !customAmount && !usePerMinute;

  const isFormValid = useMemo(() => {
    if (!effectiveAmount || effectiveAmount <= 0) return false;
    if (!paymentMethod) return false;
    if (paymentMethod === "card") {
      return cardNumber.length >= 15 && cardExpiry.length >= 4 && cardCvv.length >= 3 && cardZip.length >= 5;
    }
    return true;
  }, [effectiveAmount, paymentMethod, cardNumber, cardExpiry, cardCvv, cardZip]);

  const handleQuickPledge = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`Thank you for your $${data.lastYearPledge} pledge!`);
    navigate("/sponsor/thank-you");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`Thank you for your $${effectiveAmount?.toFixed(2)} pledge!`);
    navigate("/sponsor/thank-you");
  };

  const progress = Math.round((data.minutesRead / data.readingGoal) * 100);

  return (
    <div className="min-h-screen bg-background-warm">
      {/* Header */}
      <header className="bg-card border-b py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <img src={logoSvg} alt="Read-a-thon" className="h-10" />
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Returning Sponsor
          </Badge>
        </div>
      </header>

      <main className="px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Hero Section - Personalized Welcome */}
          <section className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome back, {data.sponsorName}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Support {data.childFirstName}'s Reading Again!
            </p>
            
            <div className="flex justify-center">
              <ReadingGoalRing 
                progress={data.minutesRead} 
                goal={data.readingGoal} 
                size={180}
                mobileSize={160}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-lg text-muted-foreground">
              <span>Goal: <strong className="text-foreground">{data.readingGoal} minutes</strong></span>
              <span className="hidden sm:inline">•</span>
              <span><strong className="text-foreground">{data.daysLeft}</strong> days left</span>
            </div>
          </section>

          {/* Last Year Stats */}
          <BookContainer variant="warm" className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Your support last year made a difference!
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <Heart className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">You pledged</p>
                      <p className="text-xl font-bold text-foreground">
                        ${data.lastYearPledge}
                        {data.lastYearPledgeType === "per-minute" && <span className="text-sm font-normal">/min</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{data.childFirstName} read</p>
                      <p className="text-xl font-bold text-foreground">{data.lastYearMinutesRead} minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BookContainer>

          {/* One-Click Pledge Option */}
          {!showFullForm && (
            <BookContainer variant="default" className="p-6 md:p-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Pledge again with one click!
                </h2>
                <p className="text-lg text-muted-foreground">
                  Same amount as last year, same payment method
                </p>
                
                <Button
                  onClick={handleQuickPledge}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full h-20 text-2xl font-bold gap-3"
                >
                  <Heart className="h-7 w-7" />
                  Pledge ${data.lastYearPledge} Again
                </Button>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFullForm(true)}
                  className="text-lg"
                >
                  Choose a different amount
                </Button>
              </div>
            </BookContainer>
          )}

          {/* Full Pledge Form (when expanded) */}
          {showFullForm && (
            <BookContainer variant="default" className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Amount Selection */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-foreground">
                    How much would you like to pledge?
                  </label>
                  
                  {/* Amount Buttons with last year highlight */}
                  <div className="grid grid-cols-4 gap-3">
                    {AMOUNT_OPTIONS.map((amount) => {
                      const isLastYear = amount === data.lastYearPledge;
                      return (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                            setUsePerMinute(false);
                          }}
                          className={cn(
                            "relative h-16 rounded-xl text-2xl font-bold transition-all border-2",
                            selectedAmount === amount && !customAmount && !usePerMinute
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-primary/50"
                          )}
                        >
                          ${amount}
                          {isLastYear && (
                            <span className="absolute -top-2 -right-2 bg-success text-success-foreground text-xs px-1.5 py-0.5 rounded-full">
                              Last year
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Other amount */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAmount(null);
                      setUsePerMinute(false);
                    }}
                    className={cn(
                      "w-full h-14 rounded-xl text-lg font-medium transition-all border-2",
                      customAmount && !usePerMinute
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    Other amount
                  </button>

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
                      Per-minute pledge option
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CreditCard className="h-7 w-7 text-primary" />
                            <span className="text-xl font-medium">Pay now by card</span>
                          </div>
                          {data.lastYearPaymentMethod === "card" && (
                            <Badge variant="outline" className="text-xs">Last used</Badge>
                          )}
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
                            <FormField label="ZIP">
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Mail className="h-7 w-7 text-primary" />
                            <div>
                              <span className="text-xl font-medium">Pay later</span>
                              <p className="text-muted-foreground">We'll email you when it's time</p>
                            </div>
                          </div>
                          {data.lastYearPaymentMethod === "later" && (
                            <Badge variant="outline" className="text-xs">Last used</Badge>
                          )}
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <FileText className="h-7 w-7 text-primary" />
                            <span className="text-xl font-medium">Mail a check</span>
                          </div>
                          {data.lastYearPaymentMethod === "check" && (
                            <Badge variant="outline" className="text-xs">Last used</Badge>
                          )}
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
                  <Heart className="h-6 w-6 mr-2" />
                  Complete My ${effectiveAmount?.toFixed(2) || "0"} Pledge
                </Button>

                {/* Back to quick option */}
                <button
                  type="button"
                  onClick={() => setShowFullForm(false)}
                  className="w-full text-center text-muted-foreground hover:text-foreground text-lg"
                >
                  ← Back to quick pledge
                </button>
              </form>
            </BookContainer>
          )}

          {/* Sponsor info reminder */}
          <div className="text-center text-muted-foreground">
            <p>
              Pledging as <strong className="text-foreground">{data.sponsorName}</strong>
              <br />
              <span className="text-sm">{data.sponsorEmail}</span>
            </p>
          </div>

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

export default ReturningSponsorPage;
