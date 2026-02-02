import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Mail,
  Phone,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Send,
  FileText,
  Banknote,
  Smartphone,
  RotateCcw,
  ChevronRight,
  Sparkles,
  History,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Hand-drawn border style matching family pledge forms
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Mock data
const getMockChildData = (id: string) => ({
  id,
  firstName: "Emma",
  lastInitial: "J",
  readingGoal: 500,
});

const getMockSchoolData = () => ({
  name: "Lincoln Elementary",
  address: {
    street: "123 Education Lane",
    city: "Anytown",
    state: "CA",
    zip: "90210",
  },
});

// Mock previous sponsors for this child
interface PreviousSponsorPledge {
  email: string;
  name: string;
  amount: number;
  pledgeType: "fixed" | "per-minute";
  perMinuteRate?: number;
  year: string;
  eventName: string;
}

const mockPreviousSponsors: PreviousSponsorPledge[] = [
  {
    email: "grandma.betty@email.com",
    name: "Grandma Betty",
    amount: 50,
    pledgeType: "fixed",
    year: "2024",
    eventName: "Fall Read-a-thon 2024",
  },
  {
    email: "uncle.mike@email.com",
    name: "Uncle Mike",
    amount: 25,
    pledgeType: "per-minute",
    perMinuteRate: 0.05,
    year: "2024",
    eventName: "Fall Read-a-thon 2024",
  },
  {
    email: "aunt.susan@email.com",
    name: "Aunt Susan",
    amount: 75,
    pledgeType: "fixed",
    year: "2023",
    eventName: "Spring Read-a-thon 2023",
  },
];

type PaymentMethod = "email" | "text" | "check" | "cash" | "direct" | null;
type PledgeType = "fixed" | "per-minute";

const AddSponsorPage = () => {
  const { id } = useParams<{ id: string }>();
  const [childData] = useState(() => getMockChildData(id || "1"));
  const [schoolData] = useState(() => getMockSchoolData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recordedPledge, setRecordedPledge] = useState<{
    name: string;
    amount: number;
    paymentMethod: PaymentMethod;
    contact: string;
  } | null>(null);

  // Returning sponsor detection
  const [foundPreviousSponsor, setFoundPreviousSponsor] = useState<PreviousSponsorPledge | null>(null);
  const [useLastYearAmount, setUseLastYearAmount] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    pledgeType: "fixed" as PledgeType,
    perMinuteRate: "0.05",
    paymentMethod: null as PaymentMethod,
    notes: "",
  });

  // Check for returning sponsor when email changes
  useEffect(() => {
    const emailLower = formData.email.toLowerCase().trim();
    if (emailLower.length > 5) {
      const found = mockPreviousSponsors.find(
        (s) => s.email.toLowerCase() === emailLower
      );
      if (found) {
        setFoundPreviousSponsor(found);
        // Auto-fill name if empty
        if (!formData.name.trim()) {
          updateField("name", found.name);
        }
      } else {
        setFoundPreviousSponsor(null);
        setUseLastYearAmount(false);
      }
    } else {
      setFoundPreviousSponsor(null);
      setUseLastYearAmount(false);
    }
  }, [formData.email]);

  // Apply last year's amount when toggle is enabled
  useEffect(() => {
    if (useLastYearAmount && foundPreviousSponsor) {
      if (foundPreviousSponsor.pledgeType === "fixed") {
        updateField("pledgeType", "fixed");
        updateField("amount", foundPreviousSponsor.amount.toString());
      } else {
        updateField("pledgeType", "per-minute");
        updateField("perMinuteRate", foundPreviousSponsor.perMinuteRate?.toString() || "0.05");
      }
    }
  }, [useLastYearAmount, foundPreviousSponsor]);

  const updateField = (field: string, value: string | PaymentMethod | PledgeType) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const effectiveAmount = useMemo(() => {
    if (formData.pledgeType === "per-minute") {
      return parseFloat(formData.perMinuteRate || "0") * childData.readingGoal;
    }
    return parseFloat(formData.amount) || 0;
  }, [formData.pledgeType, formData.amount, formData.perMinuteRate, childData.readingGoal]);

  const isPaymentMethodValid = useMemo(() => {
    if (!formData.paymentMethod) return false;
    if (formData.paymentMethod === "email" && !formData.email.trim()) return false;
    if (formData.paymentMethod === "text" && !formData.phone.trim()) return false;
    return true;
  }, [formData.paymentMethod, formData.email, formData.phone]);

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() &&
      effectiveAmount > 0 &&
      isPaymentMethodValid
    );
  }, [formData.name, effectiveAmount, isPaymentMethodValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRecordedPledge({
      name: formData.name,
      amount: effectiveAmount,
      paymentMethod: formData.paymentMethod,
      contact: formData.paymentMethod === "email" ? formData.email : formData.phone,
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Pledge recorded successfully!");
  };

  const handleRecordAnother = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      amount: "",
      pledgeType: "fixed",
      perMinuteRate: "0.05",
      paymentMethod: null,
      notes: "",
    });
    setIsSuccess(false);
    setRecordedPledge(null);
    setFoundPreviousSponsor(null);
    setUseLastYearAmount(false);
  };

  const getSuccessMessage = () => {
    if (!recordedPledge) return null;

    switch (recordedPledge.paymentMethod) {
      case "email":
        return `Payment link sent to ${recordedPledge.contact}`;
      case "text":
        return `Payment link sent to ${recordedPledge.contact}`;
      case "check":
        return `Tell ${recordedPledge.name} to mail check to ${schoolData.name}`;
      case "cash":
        return `Remember to submit $${recordedPledge.amount.toFixed(2)} to the school`;
      case "direct":
        return `${recordedPledge.name} will pay you directly - remember to track it`;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Back Link */}
          <Link
            to={`/children/${id}/invite`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invite Sponsors
          </Link>

          {!isSuccess ? (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
                  Record a pledge for{" "}
                  <span className="text-brand-blue">{childData.firstName}</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Someone wants to sponsor {childData.firstName} but needs help with the website?
                  You can record their pledge here.
                </p>
              </div>

              <div 
                className="bg-background p-6 md:p-8 shadow-md"
                style={handDrawnBorder}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Sponsor Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        1
                      </div>
                      <span>Sponsor Information</span>
                    </div>

                    <FormField label="Sponsor's Name" htmlFor="name" required>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Grandma Betty"
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          className="h-12 pl-10"
                          required
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Sponsor's Email"
                      htmlFor="email"
                      helperText="If provided, we can send them a payment link"
                    >
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className={cn(
                            "h-12 pl-10",
                            foundPreviousSponsor && "border-success focus-visible:ring-success"
                          )}
                        />
                      </div>
                    </FormField>

                    {/* Returning Sponsor Detection */}
                    {foundPreviousSponsor && (
                      <div className="p-4 bg-success/10 border border-success/30 rounded-lg space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-full bg-success/20">
                            <Sparkles className="h-4 w-4 text-success" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              Returning sponsor found!
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {foundPreviousSponsor.name} sponsored {childData.firstName} before
                              {" "}
                              <span className="text-foreground font-medium">
                                (${foundPreviousSponsor.amount}
                                {foundPreviousSponsor.pledgeType === "per-minute" && "/min"}
                                {" "}in {foundPreviousSponsor.year})
                              </span>
                            </p>
                          </div>
                          <Badge variant="outline" className="gap-1 shrink-0">
                            <History className="h-3 w-3" />
                            {foundPreviousSponsor.year}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-success/20">
                          <div className="flex items-center gap-2">
                            <Switch
                              id="useLastYear"
                              checked={useLastYearAmount}
                              onCheckedChange={setUseLastYearAmount}
                            />
                            <Label htmlFor="useLastYear" className="text-sm cursor-pointer">
                              Same as last year: {" "}
                              <span className="font-medium text-foreground">
                                ${foundPreviousSponsor.pledgeType === "fixed" 
                                  ? foundPreviousSponsor.amount 
                                  : `${foundPreviousSponsor.perMinuteRate}/min`}
                              </span>
                            </Label>
                          </div>
                          {useLastYearAmount && (
                            <Badge variant="success" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Applied
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <FormField
                      label="Sponsor's Phone"
                      htmlFor="phone"
                      helperText="For text message payment link"
                    >
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="h-12 pl-10"
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* Step 2: Pledge Details */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        2
                      </div>
                      <span>Pledge Details</span>
                    </div>

                    <RadioGroup
                      value={formData.pledgeType}
                      onValueChange={(v) => updateField("pledgeType", v as PledgeType)}
                      className="space-y-3"
                    >
                      <Label 
                        htmlFor="fixed" 
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.pledgeType === "fixed" 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <RadioGroupItem value="fixed" id="fixed" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="font-medium">Fixed Amount</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            A set donation amount regardless of reading time
                          </p>
                        </div>
                      </Label>

                      <Label 
                        htmlFor="per-minute" 
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.pledgeType === "per-minute" 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <RadioGroupItem value="per-minute" id="per-minute" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span className="font-medium">Per Minute</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Pledge per minute read — grows with their progress!
                          </p>
                        </div>
                      </Label>
                    </RadioGroup>

                    {formData.pledgeType === "fixed" ? (
                      <FormField label="Amount" htmlFor="amount" required>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="amount"
                            type="number"
                            min={1}
                            step="0.01"
                            placeholder="50.00"
                            value={formData.amount}
                            onChange={(e) => updateField("amount", e.target.value)}
                            className="h-12 pl-10"
                            required
                          />
                        </div>
                      </FormField>
                    ) : (
                      <div className="space-y-3">
                        <FormField label="Rate per minute" htmlFor="perMinuteRate" required>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="perMinuteRate"
                              type="number"
                              min={0.01}
                              step="0.01"
                              value={formData.perMinuteRate}
                              onChange={(e) => updateField("perMinuteRate", e.target.value)}
                              className="h-12 pl-10"
                              required
                            />
                          </div>
                        </FormField>
                        <p className="text-sm text-muted-foreground">
                          At {childData.readingGoal} minutes goal ={" "}
                          <strong className="text-foreground">${effectiveAmount.toFixed(2)}</strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Payment Method */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        3
                      </div>
                      <span>How will they pay?</span>
                    </div>

                    <RadioGroup
                      value={formData.paymentMethod || ""}
                      onValueChange={(v) => updateField("paymentMethod", v as PaymentMethod)}
                      className="space-y-3"
                    >
                      {/* Email Payment Link */}
                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.paymentMethod === "email"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                          !formData.email.trim() && "opacity-50"
                        )}
                      >
                        <RadioGroupItem value="email" id="pm-email" disabled={!formData.email.trim()} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Send className="h-4 w-4 text-primary" />
                            <span className="font-medium">Send payment link by email</span>
                          </div>
                          {!formData.email.trim() && (
                            <p className="text-xs text-muted-foreground mt-1">Requires email above</p>
                          )}
                        </div>
                      </label>

                      {/* Text Payment Link */}
                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.paymentMethod === "text"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                          !formData.phone.trim() && "opacity-50"
                        )}
                      >
                        <RadioGroupItem value="text" id="pm-text" disabled={!formData.phone.trim()} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-primary" />
                            <span className="font-medium">Send payment link by text</span>
                          </div>
                          {!formData.phone.trim() && (
                            <p className="text-xs text-muted-foreground mt-1">Requires phone above</p>
                          )}
                        </div>
                      </label>

                      {/* Check */}
                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.paymentMethod === "check"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <RadioGroupItem value="check" id="pm-check" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-medium">They are mailing a check</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Shows check instructions to tell sponsor
                          </p>
                        </div>
                      </label>

                      {formData.paymentMethod === "check" && (
                        <div className="ml-7 p-4 bg-muted/30 rounded-lg text-sm space-y-2">
                          <p className="font-medium">Tell {formData.name || "the sponsor"} to:</p>
                          <p>Make check to: <strong>{schoolData.name} PTA</strong></p>
                          <p>Memo: Read-a-thon - {childData.firstName} {childData.lastInitial}.</p>
                          <p>Mail to: {schoolData.address.street}, {schoolData.address.city}, {schoolData.address.state} {schoolData.address.zip}</p>
                        </div>
                      )}

                      {/* Cash */}
                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.paymentMethod === "cash"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <RadioGroupItem value="cash" id="pm-cash" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-primary" />
                            <span className="font-medium">They gave you cash</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Records as received, parent remits to school
                          </p>
                        </div>
                      </label>

                      {/* Direct Payment */}
                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.paymentMethod === "direct"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <RadioGroupItem value="direct" id="pm-direct" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="font-medium">They will pay you directly (Venmo/Zelle)</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Records pledge, parent handles payment
                          </p>
                        </div>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* Notes */}
                  <div className="pt-4 border-t border-border">
                    <FormField
                      label="Notes (optional)"
                      htmlFor="notes"
                      helperText="Any additional context about this pledge"
                    >
                      <Textarea
                        id="notes"
                        placeholder="e.g., Grandma called on phone"
                        value={formData.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                        rows={2}
                      />
                    </FormField>
                  </div>

                  {/* Summary */}
                  {effectiveAmount > 0 && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        <p className="text-foreground">
                          Recording <strong>${effectiveAmount.toFixed(2)}</strong> pledge from{" "}
                          <strong>{formData.name || "sponsor"}</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    loading={isSubmitting}
                    className="w-full h-14 text-lg"
                    style={handDrawnBorder}
                  >
                    Record This Pledge
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            /* Success State */
            <div 
              className="bg-background p-8 shadow-md text-center"
              style={handDrawnBorder}
            >
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>

                <div>
                  <h1 className="font-serif text-3xl text-foreground mb-2">
                    Pledge recorded!
                  </h1>
                  {recordedPledge && (
                    <p className="text-xl text-muted-foreground">
                      ${recordedPledge.amount.toFixed(2)} from {recordedPledge.name}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-foreground">{getSuccessMessage()}</p>
                </div>

                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={handleRecordAnother} 
                    className="w-full h-14 text-lg"
                    style={handDrawnBorder}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Record Another Pledge
                  </Button>

                  <Button variant="outline" asChild className="w-full h-14 text-lg">
                    <Link to={`/children/${id}/invite`}>
                      Back to {childData.firstName}'s Sponsors
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacer for Bottom Tab Bar */}
        <div className="h-20 md:hidden" />
      </main>

      <Footer />
      <BottomTabBar role="parent" />
    </div>
  );
};

export default AddSponsorPage;