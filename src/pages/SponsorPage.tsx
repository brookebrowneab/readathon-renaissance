import { useState, useMemo } from "react";
import { PublicLayout } from "@/components/layout";
import { BookContainer, ReadingGoalRing, BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Users,
  Target,
  Clock,
  Heart,
  Share2,
  Mail,
  CreditCard,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Copy,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock data for the child being sponsored
const mockChildData = {
  firstName: "Emma",
  grade: "3rd Grade",
  minutesRead: 245,
  goalMinutes: 300,
  eventName: "Spring Read-a-thon 2024",
  eventEndDate: "April 15, 2024",
  daysRemaining: 12,
  sponsorCount: 4,
  teacherName: "Mrs. Anderson",
  classroom: "Room 204",
};

type PledgeType = "per-minute" | "flat";
type PaymentOption = "now" | "later";
type Step = 1 | 2 | 3 | 4 | 5; // 1: Info, 2: Pledge Type, 3: Review, 4: Payment, 5: Confirmation

const relationshipOptions = [
  { value: "grandparent", label: "Grandparent" },
  { value: "aunt-uncle", label: "Aunt/Uncle" },
  { value: "family-friend", label: "Family Friend" },
  { value: "neighbor", label: "Neighbor" },
  { value: "coworker", label: "Parent's Colleague" },
  { value: "other", label: "Other" },
];

const SponsorPage = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  // Step 1: Sponsor Info
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [otherRelationship, setOtherRelationship] = useState("");
  
  // Step 2: Pledge Type
  const [pledgeType, setPledgeType] = useState<PledgeType>("per-minute");
  const [perMinuteAmount, setPerMinuteAmount] = useState("0.05");
  const [flatAmount, setFlatAmount] = useState("25");
  const [maxPledgeCap, setMaxPledgeCap] = useState("");
  
  // Step 3: Payment Option
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("now");
  
  // Step 4: Payment Details (mock)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardZip, setCardZip] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const percentage = Math.round((mockChildData.minutesRead / mockChildData.goalMinutes) * 100);

  // Calculate projected amounts
  const calculations = useMemo(() => {
    const perMin = parseFloat(perMinuteAmount) || 0;
    const flat = parseFloat(flatAmount) || 0;
    const cap = parseFloat(maxPledgeCap) || Infinity;

    if (pledgeType === "flat") {
      return {
        atCurrent: flat,
        atGoal: flat,
        at500: flat,
        displayAmount: `$${flat.toFixed(2)}`,
        displayRange: `$${flat.toFixed(2)} (fixed)`,
      };
    }

    const atCurrent = Math.min(mockChildData.minutesRead * perMin, cap);
    const atGoal = Math.min(mockChildData.goalMinutes * perMin, cap);
    const at500 = Math.min(500 * perMin, cap);

    return {
      atCurrent,
      atGoal,
      at500,
      displayAmount: `$${perMin.toFixed(2)}/min`,
      displayRange: cap !== Infinity 
        ? `$${atCurrent.toFixed(2)} - $${cap.toFixed(2)} (capped)`
        : `$${atCurrent.toFixed(2)} - $${(atGoal * 1.5).toFixed(2)}+`,
    };
  }, [pledgeType, perMinuteAmount, flatAmount, maxPledgeCap]);

  const getRelationshipLabel = () => {
    if (relationship === "other") return otherRelationship || "Other";
    return relationshipOptions.find(r => r.value === relationship)?.label || "";
  };

  // Validation
  const isStep1Valid = sponsorName.trim() && sponsorEmail.trim() && relationship && 
    (relationship !== "other" || otherRelationship.trim());
  
  const isStep2Valid = pledgeType === "flat" 
    ? parseFloat(flatAmount) > 0 
    : parseFloat(perMinuteAmount) >= 0.01 && parseFloat(perMinuteAmount) <= 1;

  const isStep4Valid = cardNumber.length >= 15 && cardExpiry.length >= 4 && cardCvc.length >= 3;

  const handleNext = () => {
    if (currentStep === 3) {
      if (paymentOption === "later") {
        // Skip payment step, go to confirmation
        setCurrentStep(5);
      } else {
        setCurrentStep(4);
      }
    } else if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep === 5 && paymentOption === "later") {
      setCurrentStep(3);
    } else if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setCurrentStep(5);
    toast({
      title: "Payment Successful",
      description: "Your pledge and payment have been processed.",
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard!",
    });
  };

  // Progress indicator
  const steps = [
    { num: 1, label: "Your Info" },
    { num: 2, label: "Pledge Type" },
    { num: 3, label: "Review" },
    { num: 4, label: "Payment" },
  ];

  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
              currentStep >= step.num
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {currentStep > step.num ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              step.num
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-1 mx-2 rounded transition-colors",
                currentStep > step.num ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Step 1: Sponsor Info
  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Your Information</h2>
        <p className="text-muted-foreground">Tell us a bit about yourself</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name <span className="text-destructive">*</span></Label>
          <Input
            id="name"
            placeholder="John Smith"
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={sponsorEmail}
            onChange={(e) => setSponsorEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">
            Relationship to {mockChildData.firstName} <span className="text-destructive">*</span>
          </Label>
          <Select value={relationship} onValueChange={setRelationship}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationshipOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {relationship === "other" && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="otherRelationship">Please specify</Label>
            <Input
              id="otherRelationship"
              placeholder="e.g., Godparent, Coach"
              value={otherRelationship}
              onChange={(e) => setOtherRelationship(e.target.value)}
            />
          </div>
        )}
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={!isStep1Valid}
        onClick={handleNext}
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  // Step 2: Pledge Type
  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Choose Your Pledge</h2>
        <p className="text-muted-foreground">How would you like to support {mockChildData.firstName}?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Per-Minute Card */}
        <Card
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            pledgeType === "per-minute" && "ring-2 ring-primary"
          )}
          onClick={() => setPledgeType("per-minute")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Per Minute</h3>
                <p className="text-sm text-muted-foreground">Pledge per minute read</p>
              </div>
            </div>

            {pledgeType === "per-minute" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Amount per minute ($0.01 - $1.00)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="1.00"
                      className="pl-7"
                      value={perMinuteAmount}
                      onChange={(e) => setPerMinuteAmount(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {["0.03", "0.05", "0.10", "0.25"].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1",
                        perMinuteAmount === amount && "border-primary text-primary"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPerMinuteAmount(amount);
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">At 500 minutes =</p>
                  <p className="font-handwritten text-xl text-primary">
                    ${calculations.at500.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Maximum cap (optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="1"
                      min="1"
                      className="pl-7"
                      placeholder="No limit"
                      value={maxPledgeCap}
                      onChange={(e) => setMaxPledgeCap(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flat Amount Card */}
        <Card
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            pledgeType === "flat" && "ring-2 ring-primary"
          )}
          onClick={() => setPledgeType("flat")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Flat Amount</h3>
                <p className="text-sm text-muted-foreground">One-time gift</p>
              </div>
            </div>

            {pledgeType === "flat" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Donation amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="1"
                      min="1"
                      className="pl-7"
                      value={flatAmount}
                      onChange={(e) => setFlatAmount(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {["10", "25", "50", "100"].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1",
                        flatAmount === amount && "border-primary text-primary"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlatAmount(amount);
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-muted/50 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    This is a one-time gift regardless of minutes read
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!isStep2Valid}
          onClick={handleNext}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Step 3: Review & Payment Option
  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Review Your Pledge</h2>
        <p className="text-muted-foreground">Almost there! Review and choose when to pay</p>
      </div>

      {/* Summary Card */}
      <BookContainer variant="warm" className="p-6">
        <h3 className="font-medium text-foreground mb-4">Pledge Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Sponsor</span>
            <span className="font-medium">{sponsorName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{sponsorEmail}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Relationship</span>
            <span className="font-medium">{getRelationshipLabel()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Supporting</span>
            <span className="font-medium">{mockChildData.firstName} ({mockChildData.grade})</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Pledge Type</span>
            <span className="font-medium">
              {pledgeType === "per-minute" ? "Per Minute" : "Flat Amount"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-handwritten text-xl text-primary">
              {calculations.displayAmount}
            </span>
          </div>
          {pledgeType === "per-minute" && (
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Estimated Range</span>
              <span className="font-medium text-sm">{calculations.displayRange}</span>
            </div>
          )}
        </div>

        {/* Child's Goal */}
        <div className="mt-6 p-4 rounded-lg bg-background flex items-center gap-4">
          <div className="w-16 h-16">
            <ReadingGoalRing
              progress={mockChildData.minutesRead}
              goal={mockChildData.goalMinutes}
              size={64}
            />
          </div>
          <div>
            <p className="font-medium">{mockChildData.firstName}'s Goal</p>
            <p className="text-sm text-muted-foreground">
              {mockChildData.minutesRead} of {mockChildData.goalMinutes} minutes
            </p>
          </div>
        </div>
      </BookContainer>

      {/* Payment Options */}
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">When would you like to pay?</h3>
        
        <Card
          className={cn(
            "cursor-pointer transition-all",
            paymentOption === "now" && "ring-2 ring-primary"
          )}
          onClick={() => setPaymentOption("now")}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Pay Now</p>
              <p className="text-sm text-muted-foreground">
                Complete payment immediately with card
              </p>
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2",
              paymentOption === "now" ? "border-primary bg-primary" : "border-muted-foreground"
            )}>
              {paymentOption === "now" && (
                <CheckCircle className="w-full h-full text-primary-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all",
            paymentOption === "later" && "ring-2 ring-primary"
          )}
          onClick={() => setPaymentOption("later")}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Pay When Event Ends</p>
              <p className="text-sm text-muted-foreground">
                We'll send a payment reminder on {mockChildData.eventEndDate}
              </p>
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2",
              paymentOption === "later" ? "border-primary bg-primary" : "border-muted-foreground"
            )}>
              {paymentOption === "later" && (
                <CheckCircle className="w-full h-full text-primary-foreground" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button className="flex-1" onClick={handleNext}>
          {paymentOption === "now" ? "Continue to Payment" : "Complete Pledge"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Step 4: Payment (Square mock)
  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Payment Details</h2>
        <p className="text-muted-foreground">Secure payment powered by Square</p>
      </div>

      {/* Amount Display */}
      <div className="p-4 rounded-lg bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground mb-1">
          {pledgeType === "per-minute" ? "Estimated Amount" : "Amount Due"}
        </p>
        <p className="font-serif text-3xl text-primary">
          ${pledgeType === "flat" 
            ? parseFloat(flatAmount).toFixed(2) 
            : calculations.atGoal.toFixed(2)}
        </p>
        {pledgeType === "per-minute" && (
          <p className="text-xs text-muted-foreground mt-1">
            Based on {mockChildData.firstName}'s goal of {mockChildData.goalMinutes} minutes
          </p>
        )}
      </div>

      {/* Card Input (Mock Square SDK) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="cardNumber"
              placeholder="4242 4242 4242 4242"
              className="pl-10"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="123"
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              placeholder="12345"
              value={cardZip}
              onChange={(e) => setCardZip(e.target.value.slice(0, 5))}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Your payment is encrypted and secure</span>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!isStep4Valid || isProcessing}
          onClick={handlePayment}
          loading={isProcessing}
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </Button>
      </div>
    </div>
  );

  // Step 5: Confirmation
  const renderStep5 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center animate-scale-in">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <BookIcon size="medium" variant="primary" />
        <h1 className="font-serif text-3xl font-normal text-primary">
          Thank You, {sponsorName}!
        </h1>
        <p className="text-muted-foreground max-w-md">
          Your pledge to support {mockChildData.firstName}'s reading journey means the world!
          {paymentOption === "now" 
            ? " Your payment has been processed successfully."
            : ` We'll send you a payment reminder when the event ends on ${mockChildData.eventEndDate}.`}
        </p>

        {/* Pledge Summary */}
        <BookContainer variant="warm" className="w-full p-4">
          <h3 className="font-medium text-foreground mb-3">Your Pledge</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span>{pledgeType === "per-minute" ? "Per Minute" : "Flat Amount"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-handwritten text-lg text-primary">
                {calculations.displayAmount}
              </span>
            </div>
            {pledgeType === "per-minute" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">At Goal ({mockChildData.goalMinutes} min)</span>
                <span>${calculations.atGoal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Payment Status</span>
              <span className={cn(
                "font-medium",
                paymentOption === "now" ? "text-primary" : "text-muted-foreground"
              )}>
                {paymentOption === "now" ? "Paid" : "Pay Later"}
              </span>
            </div>
          </div>
        </BookContainer>

        {/* Child's Progress */}
        <div className="w-full p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20">
              <ReadingGoalRing
                progress={mockChildData.minutesRead}
                goal={mockChildData.goalMinutes}
                size={80}
              />
            </div>
            <div className="text-left">
              <p className="font-medium">{mockChildData.firstName}'s Progress</p>
              <p className="font-handwritten text-xl text-primary">
                {mockChildData.minutesRead} minutes
              </p>
              <p className="text-sm text-muted-foreground">
                {mockChildData.daysRemaining} days left in event
              </p>
            </div>
          </div>
        </div>

        {/* Share Actions */}
        <div className="space-y-3 w-full">
          <p className="text-sm font-medium text-foreground">
            Invite others to sponsor {mockChildData.firstName}!
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={copyShareLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          A confirmation email has been sent to {sponsorEmail}.
        </p>
      </div>
    </div>
  );

  return (
    <PublicLayout>
      {/* Hero Section with Child Info */}
      {currentStep !== 5 && (
        <section className="bg-background-warm py-8 md:py-12">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
              {/* Child Progress Card */}
              <BookContainer variant="default" className="w-full max-w-sm p-6">
                <div className="flex flex-col items-center gap-4">
                  <h2 className="w-full text-center font-serif text-2xl font-normal text-primary">
                    Sponsor {mockChildData.firstName}
                  </h2>
                  <p className="text-muted-foreground">{mockChildData.grade}</p>

                  <ReadingGoalRing
                    progress={mockChildData.minutesRead}
                    goal={mockChildData.goalMinutes}
                    size={160}
                  />

                  <p className="font-handwritten text-xl text-primary text-center">
                    {mockChildData.minutesRead} minutes read!
                  </p>

                  <div className="w-full grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Target className="h-4 w-4 text-primary mb-1" />
                      <span className="text-xs text-muted-foreground">Goal</span>
                      <span className="font-handwritten text-lg text-primary">
                        {mockChildData.goalMinutes} min
                      </span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Calendar className="h-4 w-4 text-primary mb-1" />
                      <span className="text-xs text-muted-foreground">Days Left</span>
                      <span className="font-handwritten text-lg text-primary">
                        {mockChildData.daysRemaining}
                      </span>
                    </div>
                  </div>
                </div>
              </BookContainer>
            </div>
          </div>
        </section>
      )}

      {/* Form Section */}
      <section className={cn(
        "py-8 md:py-12",
        currentStep === 5 ? "bg-background-warm min-h-[80vh] flex items-center" : "bg-background"
      )}>
        <div className="container">
          <div className="max-w-lg mx-auto">
            {currentStep !== 5 && (
              <BookContainer variant="warm" className="p-6 md:p-8">
                {renderProgressIndicator()}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </BookContainer>
            )}
            {currentStep === 5 && (
              <BookContainer variant="default" className="p-6 md:p-8">
                {renderStep5()}
              </BookContainer>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SponsorPage;
