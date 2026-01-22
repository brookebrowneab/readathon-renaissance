import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  CheckCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import booksShelfDivider from "@/assets/books-shelf-divider.png";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

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
      <PublicLayout>
        {/* Hero Section */}
        <section className="relative pt-8 md:pt-12 pb-6 md:pb-8">
          <div className="container">
            <div className="max-w-4xl pl-9 md:pl-14 lg:pl-20">
              <div className="relative inline-block mb-4">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.05] relative">
                  <span className="relative">
                    Thank You!
                    <span 
                      className="absolute inset-0 -skew-y-1 bg-accent/30 -z-10 transform -rotate-[0.5deg]"
                      style={{
                        top: '45%',
                        height: '55%',
                        left: '-2%',
                        right: '-2%',
                        borderRadius: '4px 8px 4px 6px',
                      }}
                      aria-hidden="true"
                    />
                  </span>
                </h1>
              </div>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Your payment was successful.
              </p>
            </div>
          </div>
        </section>

        {/* Decorative Divider */}
        <div 
          className="w-full h-16 md:h-20 relative z-10"
          style={{
            backgroundImage: `url(${booksShelfDivider})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />

        {/* Success Content */}
        <section className="py-10 md:py-14 bg-background-warm">
          <div className="container">
            <div className="max-w-md mx-auto">
              <div 
                className="bg-background p-8 text-center"
                style={handDrawnBorder}
              >
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>

                <p className="text-xl text-foreground font-medium mb-2">
                  ${selectedTotal.toFixed(2)} received
                </p>
                <p className="text-muted-foreground mb-8">
                  You're helping kids discover the joy of reading!
                </p>

                <Button asChild className="w-full" size="lg">
                  <Link to="/sponsor/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="container">
          <div className="max-w-4xl pl-9 md:pl-14 lg:pl-20">
            {/* Back Link */}
            <Link
              to="/sponsor/dashboard"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            {/* Large headline with highlighter effect */}
            <div className="relative inline-block mb-4">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.05] relative">
                <span className="relative">
                  Complete Your<br />Pledge
                  {/* Highlighter effect */}
                  <span 
                    className="absolute inset-0 -skew-y-1 bg-accent/30 -z-10 transform -rotate-[0.5deg]"
                    style={{
                      top: '45%',
                      height: '55%',
                      left: '-2%',
                      right: '-2%',
                      borderRadius: '4px 8px 4px 6px',
                    }}
                    aria-hidden="true"
                  />
                </span>
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Select your pledges and choose a payment method to complete your contribution.
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div 
        className="w-full h-16 md:h-20 relative z-10"
        style={{
          backgroundImage: `url(${booksShelfDivider})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />

      {/* Payment Form Section */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-xl mx-auto space-y-6">
            {/* Select Pledges */}
            <div 
              className="bg-background p-6"
              style={handDrawnBorder}
            >
              <h2 className="font-serif text-xl md:text-2xl text-foreground mb-4">
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
                <span className="text-2xl font-serif font-bold text-foreground">
                  ${selectedTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div 
              className="bg-background p-6"
              style={handDrawnBorder}
            >
              <h2 className="font-serif text-xl md:text-2xl text-foreground mb-4">
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
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? "Processing..." : `Pay $${selectedTotal.toFixed(2)}`}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div 
                    className="bg-muted/30 p-4"
                    style={handDrawnBorder}
                  >
                    <h3 className="font-serif text-lg text-foreground mb-2">
                      Mail your check to:
                    </h3>
                    <address className="text-muted-foreground not-italic">
                      Lincoln Elementary PTA<br />
                      Read-a-thon Fund<br />
                      123 School Street<br />
                      Anytown, ST 12345
                    </address>
                  </div>

                  <div 
                    className="bg-muted/30 p-4"
                    style={handDrawnBorder}
                  >
                    <h3 className="font-serif text-lg text-foreground mb-2">
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
                    style={handDrawnBorder}
                  >
                    I'll mail a check
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hand-drawn section divider */}
      <div 
        className="w-full"
        style={{
          borderTop: 'solid 2px #41403E',
        }}
      />

      {/* CTA Section */}
      <section className="py-10 md:py-14 bg-primary">
        <div className="container text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-3">
            Questions About Payment?
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 mb-6 max-w-lg mx-auto leading-relaxed">
            Contact our Read-a-thon coordinators if you need any assistance.
          </p>
          <a href="mailto:janneyreadathon@janneyschool.org">
            <Button 
              size="lg" 
              className="bg-background text-foreground hover:bg-background/90 px-8"
            >
              Contact Us
            </Button>
          </a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SponsorPaymentPage;
