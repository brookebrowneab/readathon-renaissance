import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { toast } from "@/components/ui/sonner";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  DollarSign,
  TrendingUp,
  CheckCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Mock children data
const mockChildren = [
  {
    id: "1",
    name: "Emma Johnson",
    grade: "3rd Grade",
    teacher: "Mrs. Peterson",
    minutesRead: 245,
    goalMinutes: 300,
    existingSponsorships: 4,
    totalPledged: 85.00,
  },
  {
    id: "2",
    name: "Lucas Johnson",
    grade: "1st Grade",
    teacher: "Mr. Garcia",
    minutesRead: 180,
    goalMinutes: 250,
    existingSponsorships: 3,
    totalPledged: 60.50,
  },
];

type PledgeType = "per-minute" | "flat";
type Step = 1 | 2 | 3; // 1: Select Child, 2: Pledge Amount, 3: Confirmation

const SponsorMyChildPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [pledgeType, setPledgeType] = useState<PledgeType>("per-minute");
  const [perMinuteAmount, setPerMinuteAmount] = useState("0.05");
  const [flatAmount, setFlatAmount] = useState("25");
  const [maxPledgeCap, setMaxPledgeCap] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedChild = mockChildren.find(c => c.id === selectedChildId);

  const calculateProjected = () => {
    if (!selectedChild) return 0;
    if (pledgeType === "flat") return parseFloat(flatAmount) || 0;
    const perMin = parseFloat(perMinuteAmount) || 0;
    const cap = parseFloat(maxPledgeCap) || Infinity;
    return Math.min(selectedChild.goalMinutes * perMin, cap);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setCurrentStep(3);
    toast.success("Pledge created!", {
      description: `Your pledge for ${selectedChild?.name} has been saved.`,
    });
  };

  // Step 1: Select Child
  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Choose a Child to Sponsor</h2>
        <p className="text-muted-foreground">Select which of your children you'd like to sponsor</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockChildren.map((child) => (
          <Card
            key={child.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedChildId === child.id && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedChildId(child.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{child.name}</h3>
                  <p className="text-sm text-muted-foreground">{child.grade} • {child.teacher}</p>
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <ReadingGoalRing progress={child.minutesRead} goal={child.goalMinutes} size={80} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Current Sponsors</p>
                  <p className="font-handwritten text-lg text-primary">{child.existingSponsorships}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Total Pledged</p>
                  <p className="font-handwritten text-lg text-primary">${child.totalPledged.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!selectedChildId}
          onClick={handleNext}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Step 2: Pledge Amount
  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Set Your Pledge</h2>
        <p className="text-muted-foreground">Choose how much to pledge for {selectedChild?.name.split(" ")[0]}</p>
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Projected Amount */}
      <BookContainer variant="warm" className="p-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Projected pledge at goal ({selectedChild?.goalMinutes} min)</p>
          <p className="font-handwritten text-3xl text-primary">${calculateProjected().toFixed(2)}</p>
        </div>
      </BookContainer>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Pledge..." : (
            <>
              <Heart className="mr-2 h-4 w-4" />
              Create Pledge
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Step 3: Confirmation
  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <div>
        <h2 className="font-serif text-2xl text-primary mb-2">Pledge Created!</h2>
        <p className="text-muted-foreground">
          You've pledged to sponsor {selectedChild?.name}
        </p>
      </div>

      <BookContainer variant="warm" className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Child</span>
            <span className="font-medium">{selectedChild?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pledge Type</span>
            <span className="font-medium">{pledgeType === "per-minute" ? "Per Minute" : "Flat"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">
              {pledgeType === "per-minute" 
                ? `$${perMinuteAmount}/min` 
                : `$${flatAmount}`}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-muted-foreground">Projected Total</span>
            <span className="font-handwritten text-xl text-primary">${calculateProjected().toFixed(2)}</span>
          </div>
        </div>
      </BookContainer>

      <Button onClick={() => navigate("/dashboard")} className="w-full">
        Back to Dashboard
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
              Sponsor Your Child
            </h1>
            <p className="text-muted-foreground mt-2">
              Make a pledge to support your own child's reading journey
            </p>
          </div>

          {/* Progress Indicator */}
          {currentStep < 3 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                      currentStep >= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {index < 1 && (
                    <div
                      className={cn(
                        "w-12 h-1 mx-2 rounded transition-colors",
                        currentStep > step ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step Content */}
          <div 
            className="bg-background p-6"
            style={handDrawnBorder}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorMyChildPage;