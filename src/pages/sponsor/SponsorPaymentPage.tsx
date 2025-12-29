import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  CheckCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Pledge {
  id: string;
  childFirstName: string;
  childLastInitial: string;
  amount: number;
}

// Mock pledges - in reality would come from state/API
const mockUnpaidPledges: Pledge[] = [
  { id: "1", childFirstName: "Emma", childLastInitial: "J", amount: 17.35 },
  { id: "2", childFirstName: "Noah", childLastInitial: "B", amount: 25.0 },
];

const SponsorPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedIds = location.state?.pledgeIds || [];

  const [selectedPledges, setSelectedPledges] = useState<string[]>(
    preselectedIds.length > 0 ? preselectedIds : mockUnpaidPledges.map((p) => p.id)
  );
  const [paymentMethod, setPaymentMethod] = useState<"card" | "check">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [zipCode, setZipCode] = useState("");

  const selectedTotal = mockUnpaidPledges
    .filter((p) => selectedPledges.includes(p.id))
    .reduce((sum, p) => sum + p.amount, 0);

  const togglePledge = (pledgeId: string) => {
    setSelectedPledges((prev) =>
      prev.includes(pledgeId)
        ? prev.filter((id) => id !== pledgeId)
        : [...prev, pledgeId]
    );
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ").substr(0, 19) : "";
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + "/" + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  const isCardFormValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiryDate.length === 5 &&
    cvc.length >= 3 &&
    cardName.trim().length > 0 &&
    zipCode.length >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "card" && !isCardFormValid) return;
    if (selectedPledges.length === 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Payment successful!");
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />

        <main className="flex-1 bg-background-warm flex items-center justify-center py-12">
          <div className="container max-w-md">
            <BookContainer variant="default" className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>

              <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground mb-2">
                Thank you!
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Your payment of ${selectedTotal.toFixed(2)} was successful.
              </p>
              <p className="text-muted-foreground">
                You're helping kids discover the joy of reading!
              </p>

              <div className="mt-8">
                <Button asChild className="w-full" size="lg">
                  <Link to="/sponsor/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </BookContainer>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-xl">
          {/* Back Link */}
          <Link
            to="/sponsor/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground mb-6">
            Complete Your Pledge
          </h1>

          <div className="space-y-6">
            {/* Select Pledges */}
            <BookContainer variant="default" className="p-6">
              <h2 className="font-medium text-foreground mb-4">
                Select pledges to pay
              </h2>
              <div className="space-y-3">
                {mockUnpaidPledges.map((pledge) => (
                  <label
                    key={pledge.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all",
                      selectedPledges.includes(pledge.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedPledges.includes(pledge.id)}
                        onCheckedChange={() => togglePledge(pledge.id)}
                      />
                      <span className="font-medium">
                        {pledge.childFirstName} {pledge.childLastInitial}.
                      </span>
                    </div>
                    <span className="font-bold text-foreground">
                      ${pledge.amount.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">
                  ${selectedTotal.toFixed(2)}
                </span>
              </div>
            </BookContainer>

            {/* Payment Method */}
            <BookContainer variant="default" className="p-6">
              <h2 className="font-medium text-foreground mb-4">
                Payment method
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Pay by Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("check")}
                  className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                    paymentMethod === "check"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Mail className="h-5 w-5" />
                  <span className="font-medium">Mail a Check</span>
                </button>
              </div>

              {paymentMethod === "card" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField label="Cardholder Name" htmlFor="cardName" required>
                    <Input
                      id="cardName"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Card Number" htmlFor="cardNumber" required>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </FormField>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Expiry" htmlFor="expiry" required>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                        maxLength={5}
                      />
                    </FormField>
                    <FormField label="CVC" htmlFor="cvc" required>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substr(0, 4))}
                        maxLength={4}
                      />
                    </FormField>
                    <FormField label="ZIP Code" htmlFor="zip" required>
                      <Input
                        id="zip"
                        placeholder="12345"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").substr(0, 5))}
                        maxLength={5}
                      />
                    </FormField>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Your payment info is secure and encrypted</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={!isCardFormValid || selectedPledges.length === 0 || isSubmitting}
                    loading={isSubmitting}
                    className="w-full bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground"
                    size="lg"
                  >
                    Pay ${selectedTotal.toFixed(2)}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">
                      Mail your check to:
                    </h3>
                    <address className="text-muted-foreground not-italic">
                      Lincoln Elementary PTA<br />
                      Read-a-thon Fund<br />
                      123 School Street<br />
                      Anytown, ST 12345
                    </address>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">
                      Please include:
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Make check payable to: "Lincoln Elementary PTA"</li>
                      <li>• Write "Read-a-thon" in the memo line</li>
                      <li>• Include student name(s) you're sponsoring</li>
                    </ul>
                  </div>

                  <Button
                    onClick={() => {
                      toast.success("We'll mark your pledge as pending check payment.");
                      navigate("/sponsor/dashboard");
                    }}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    I'll mail a check
                  </Button>
                </div>
              )}
            </BookContainer>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorPaymentPage;
