import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useSquarePayment } from "@/hooks/useSquarePayment";
import { SquareCardForm } from "@/components/payment/SquareCardForm";
import {
  CreditCard,
  Mail,
  CheckCircle,
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
  const token = searchParams.get("token");
  const { data: activeEvent } = useActiveEvent();

  const [pledge, setPledge] = useState<GuestPledge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "check">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  // Card form state (for Square)
  const [cardholderName, setCardholderName] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Square payment integration
  const {
    isLoading: squareLoading,
    isReady: squareReady,
    error: squareError,
    isProcessing,
    processPayment,
  } = useSquarePayment({
    onError: (err) => setPaymentError(err),
  });

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

  const isCardFormValid =
    cardholderName.trim().length > 0 &&
    zipCode.length >= 5 &&
    squareReady;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledge) return;
    if (paymentMethod === "card" && !isCardFormValid) return;

    setIsSubmitting(true);
    setPaymentError(null);

    try {
      if (paymentMethod === "card") {
        // Process real payment with Square
        const result = await processPayment({
          amount: pledge.amount,
          classPledgeId: pledge.id,
          payerName: cardholderName || pledge.payment?.payer_name || "Guest",
          payerEmail: pledge.payment?.payer_email || "",
        });

        if (!result.success) {
          setPaymentError(result.error || "Payment failed");
          toast.error(result.error || "Payment failed");
          return;
        }

        setReceiptUrl(result.receiptUrl || null);
      } else {
        // Check payment - just update status
        const { error: updateError } = await supabase
          .from("payments")
          .update({
            amount: pledge.amount,
            payment_method: "check",
            notes: "Guest payment - Check pending",
          })
          .eq("class_pledge_id", pledge.id);

        if (updateError) throw updateError;
      }

      setIsSuccess(true);
      toast.success("Payment successful!");
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentError(err.message || "Failed to process payment");
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
                <p className="text-muted-foreground mb-6">
                  Your support helps motivate young readers!
                </p>

                {receiptUrl && (
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-primary hover:underline mb-6"
                  >
                    View Receipt →
                  </a>
                )}

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
                  <SquareCardForm
                    isLoading={squareLoading}
                    isReady={squareReady}
                    error={squareError}
                    cardholderName={cardholderName}
                    onCardholderNameChange={setCardholderName}
                    zipCode={zipCode}
                    onZipCodeChange={setZipCode}
                  />

                  {paymentError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{paymentError}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={!isCardFormValid || isSubmitting || isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting || isProcessing ? "Processing..." : `Pay $${pledge?.amount.toFixed(2)}`}
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
