import { useState, useMemo, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useSponsorPledges } from "@/hooks/useSponsorPledges";
import { Skeleton } from "@/components/ui/skeleton";


// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

interface DisplayPledge {
  id: string;
  childFirstName: string;
  childLastInitial: string;
  amount: number;
}

const SponsorPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedIds = location.state?.pledgeIds || [];
  
  // Fetch real pledges from database
  const { pledges, isLoading, sponsor } = useSponsorPledges();
  
  // Filter to only unpaid pledges and transform for display
  const unpaidPledges: DisplayPledge[] = useMemo(() => {
    return pledges
      .filter((p) => !p.is_paid)
      .map((pledge) => {
        const name = pledge.child?.name || pledge.student_name;
        const nameParts = name.split(" ");
        const firstName = nameParts[0] || name;
        const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";
        
        // Calculate actual amount for per_minute pledges
        const amount =
          pledge.pledge_type === "per_minute" && pledge.child
            ? pledge.amount * pledge.child.total_minutes
            : pledge.amount;
        
        return {
          id: pledge.id,
          childFirstName: firstName,
          childLastInitial: lastInitial,
          amount,
        };
      });
  }, [pledges]);
  
  // Determine dashboard URL based on referrer (from state or query param)
  const searchParams = new URLSearchParams(location.search);
  const referrerFromQuery = searchParams.get("from");
  const referrerFromState = location.state?.from;
  const referrer = referrerFromState || referrerFromQuery;
  
  // Default to sponsor dashboard, but redirect to family dashboard if came from parent
  const dashboardUrl = referrer === "parent" ? "/dashboard" : "/sponsor/dashboard";

  const [selectedPledges, setSelectedPledges] = useState<string[]>(preselectedIds);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "check">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [zipCode, setZipCode] = useState("");
  
  // Initialize selected pledges when data loads
  useEffect(() => {
    if (!isLoading && unpaidPledges.length > 0 && selectedPledges.length === 0) {
      // If we have preselected IDs from navigation, use those; otherwise select all
      if (preselectedIds.length > 0) {
        setSelectedPledges(preselectedIds.filter((id: string) => 
          unpaidPledges.some((p) => p.id === id)
        ));
      } else {
        setSelectedPledges(unpaidPledges.map((p) => p.id));
      }
    }
  }, [isLoading, unpaidPledges, preselectedIds]);

  const selectedTotal = unpaidPledges
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
                  <Link to={dashboardUrl}>Back to Dashboard</Link>
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
      {/* Back to Dashboard link - above hero */}
      <div className="container pt-6">
        <div className="max-w-4xl pl-9 md:pl-14 lg:pl-20">
          <Link 
            to={dashboardUrl}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-4 md:pt-8 pb-6 md:pb-8">
        <div className="container">
          <div className="max-w-4xl pl-9 md:pl-14 lg:pl-20">
            
            {/* Large headline with highlighter effect */}
            <div className="relative inline-block mb-4">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.05] relative">
                <span className="relative">
                  Complete Your Pledge
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

      {/* Payment Form Section - with shadow at top to create depth */}
      <section className="py-10 md:py-14 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
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
                {isLoading ? (
                  <>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </>
                ) : unpaidPledges.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No unpaid pledges found.</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link to={dashboardUrl}>Return to Dashboard</Link>
                    </Button>
                  </div>
                ) : (
                  unpaidPledges.map((pledge) => (
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
                  ))
                )}
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
                    onClick={async () => {
                      setIsSubmitting(true);
                      try {
                        // Get selected pledge details
                        const selectedPledgeDetails = unpaidPledges.filter(
                          (p) => selectedPledges.includes(p.id)
                        );
                        const childNames = selectedPledgeDetails.map(
                          (p) => `${p.childFirstName} ${p.childLastInitial}.`
                        );

                        // Call edge function to update database and notify organizers
                        const { data, error } = await supabase.functions.invoke(
                          "notify-check-payment",
                          {
                            body: {
                              pledgeIds: selectedPledges,
                              sponsorName: sponsor?.name || "Unknown Sponsor",
                              sponsorEmail: sponsor?.email || "unknown@email.com",
                              totalAmount: selectedTotal,
                              childNames,
                            },
                          }
                        );

                        if (error) throw error;

                        toast.success(
                          "Thank you! We've notified the organizers about your check payment."
                        );
                        navigate(dashboardUrl);
                      } catch (error: any) {
                        console.error("Error notifying about check payment:", error);
                        toast.error("Something went wrong. Please try again.");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={selectedPledges.length === 0 || isSubmitting}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    style={handDrawnBorder}
                  >
                    {isSubmitting ? "Submitting..." : "I'll mail a check"}
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
