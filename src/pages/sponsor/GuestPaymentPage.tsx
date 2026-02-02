import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import {
  CreditCard,
  Mail,
  CheckCircle,
  Lock,
  AlertCircle,
  Users,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

interface GuestPledge {
  id: string;
  class_name: string;
  amount: number;
  pledge_type: string;
  is_paid: boolean;
  teacher?: {
    name: string;
    grade_level: string | null;
  } | null;
  payment?: {
    payer_name: string;
    payer_email: string;
  } | null;
}

const GuestPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { data: activeEvent } = useActiveEvent();

  const [pledge, setPledge] = useState<GuestPledge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "check">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Fetch pledge by token
  useEffect(() => {
    const fetchPledge = async () => {
      if (!token) {
        setError("Invalid payment link. Please check the link and try again.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch the pledge by payment token
        const { data: pledgeData, error: pledgeError } = await supabase
          .from("class_pledges")
          .select(`
            id,
            class_name,
            amount,
            pledge_type,
            is_paid,
            teacher:teachers(name, grade_level)
          `)
          .eq("payment_token", token)
          .maybeSingle();

        if (pledgeError) throw pledgeError;

        if (!pledgeData) {
          setError("Pledge not found. This link may have expired or is invalid.");
          setIsLoading(false);
          return;
        }

        if (pledgeData.is_paid) {
          setError("This pledge has already been paid. Thank you for your support!");
          setIsLoading(false);
          return;
        }

        // Fetch associated payment record for guest info
        const { data: paymentData } = await supabase
          .from("payments")
          .select("payer_name, payer_email")
          .eq("class_pledge_id", pledgeData.id)
          .maybeSingle();

        setPledge({
          ...pledgeData,
          teacher: Array.isArray(pledgeData.teacher) ? pledgeData.teacher[0] : pledgeData.teacher,
          payment: paymentData,
        });
      } catch (err) {
        console.error("Error fetching pledge:", err);
        setError("Failed to load pledge details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPledge();
  }, [token]);

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
    if (!pledge) return;
    if (paymentMethod === "card" && !isCardFormValid) return;

    setIsSubmitting(true);

    try {
      // Update the payment record with payment details
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          amount: pledge.amount,
          payment_method: paymentMethod,
          notes: paymentMethod === "check" 
            ? "Guest payment - Check pending" 
            : "Guest payment - Card processed",
        })
        .eq("class_pledge_id", pledge.id);

      if (updateError) throw updateError;

      // Mark the pledge as paid (for card payments)
      if (paymentMethod === "card") {
        const { error: pledgeError } = await supabase
          .from("class_pledges")
          .update({ 
            is_paid: true,
            payment_status: "paid"
          })
          .eq("id", pledge.id);

        if (pledgeError) throw pledgeError;
      }

      setIsSuccess(true);
      toast.success("Payment successful!");
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <PublicLayout>
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="max-w-md mx-auto">
              <div 
                className="bg-background p-8 text-center"
                style={handDrawnBorder}
              >
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>

                <h1 className="font-serif text-2xl text-foreground mb-2">
                  Thank You!
                </h1>
                <p className="text-xl text-foreground font-medium mb-2">
                  ${pledge?.amount.toFixed(2)} received
                </p>
                <p className="text-muted-foreground mb-8">
                  Your support helps motivate young readers!
                </p>

                <Button asChild className="w-full" size="lg">
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <PublicLayout>
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="max-w-md mx-auto space-y-6">
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <Skeleton className="h-64 w-full" style={handDrawnBorder} />
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PublicLayout>
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="max-w-md mx-auto">
              <div 
                className="bg-background p-8 text-center"
                style={handDrawnBorder}
              >
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>

                <h1 className="font-serif text-2xl text-foreground mb-4">
                  Payment Link Issue
                </h1>
                <p className="text-muted-foreground mb-8">
                  {error}
                </p>

                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Return to Home</Link>
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
      {/* Hero */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground mb-2">
              Complete Your Payment
            </h1>
            <p className="text-muted-foreground text-lg">
              Thank you for supporting our young readers!
            </p>
          </div>
        </div>
      </section>

      {/* Payment Form */}
      <section className="pb-12 md:pb-20">
        <div className="container">
          <div className="max-w-xl mx-auto space-y-6">
            {/* Pledge Summary */}
            <div 
              className="bg-background p-6"
              style={handDrawnBorder}
            >
              <h2 className="font-serif text-xl text-foreground mb-4">
                Your Pledge
              </h2>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {pledge?.teacher?.name ? `${pledge.teacher.name}'s Class` : pledge?.class_name}
                    </p>
                    {pledge?.teacher?.grade_level && (
                      <p className="text-sm text-muted-foreground">
                        {pledge.teacher.grade_level}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-2xl font-serif font-bold text-foreground">
                  ${pledge?.amount.toFixed(2)}
                </span>
              </div>

              {pledge?.payment?.payer_name && (
                <p className="text-sm text-muted-foreground mt-4">
                  Pledged by: {pledge.payment.payer_name}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div 
              className="bg-background p-6"
              style={handDrawnBorder}
            >
              <h2 className="font-serif text-xl text-foreground mb-4">
                Payment Method
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
                    disabled={!isCardFormValid || isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? "Processing..." : `Pay $${pledge?.amount.toFixed(2)}`}
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
                    <address className="text-muted-foreground not-italic whitespace-pre-line">
                      {activeEvent?.payment_address || "Lincoln Elementary PTA\nRead-a-thon Fund\n123 School Street\nAnytown, ST 12345"}
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
                      <li>• Make check payable to: "{activeEvent?.school_name || "Lincoln Elementary"} PTA"</li>
                      <li>• Write "Read-a-thon - {pledge?.class_name}" in the memo line</li>
                      <li>• Amount: ${pledge?.amount.toFixed(2)}</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? "Saving..." : "I'll Send a Check"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default GuestPaymentPage;
