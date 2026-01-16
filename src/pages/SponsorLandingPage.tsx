import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useSponsorAuth } from "@/hooks/useSponsorAuth";
import { 
  CreditCard, 
  Mail, 
  FileText, 
  Check,
  Users,
  Heart,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";

// Hand-drawn border style (matching HomePage)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

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
  gradeStats: {
    avgMinutes: 412,
    maxMinutes: 687,
    participantCount: 48,
  },
});

const AMOUNT_OPTIONS = [25, 50, 100];

type PaymentMethod = "card" | "later" | "check" | null;

const SponsorLandingPage = () => {
  const { token, code } = useParams<{ token?: string; code?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = token || code || "demo";
  
  const { isAuthenticated, loading, sponsor, signOut } = useSponsorAuth();
  
  const [data] = useState(() => getMockData(identifier));
  const [sponsorName, setSponsorName] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [perMinuteRate, setPerMinuteRate] = useState("0.10");
  const [usePerMinute, setUsePerMinute] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Card form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardZip, setCardZip] = useState("");

  // Set sponsor name from profile when available
  useEffect(() => {
    if (sponsor?.name) {
      setSponsorName(sponsor.name);
    } else if (data.inviteeName) {
      setSponsorName(data.inviteeName);
    }
  }, [sponsor, data.inviteeName]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/sponsor/auth", { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [loading, isAuthenticated, navigate, location.pathname]);

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
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Thank you for your $${effectiveAmount?.toFixed(2)} pledge!`);
    setIsSubmitting(false);
    navigate("/sponsor/pledged");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const progress = Math.round((data.minutesRead / data.readingGoal) * 100);

  // Show loading state
  if (loading) {
    return (
      <PublicLayout>
        <div className="container py-20 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </PublicLayout>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <PublicLayout>
      {/* User Header Bar */}
      <div className="border-b border-border bg-background">
        <div className="container py-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="text-foreground font-medium">{sponsor?.email}</span>
          </p>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 md:py-12 relative overflow-hidden">
        {/* Bookshelf background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url(${booksShelfBannerV2})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 50%',
            backgroundPosition: 'center bottom',
          }}
          aria-hidden="true"
        />

        <div className="container relative">
          <div className="max-w-4xl mx-auto">
            {/* Invited by badge */}
            <div className="flex justify-end mb-4">
              <div 
                className="inline-flex items-baseline gap-1 bg-background px-4 py-2"
                style={handDrawnBorder}
              >
                <Heart className="h-4 w-4 text-primary mr-1" />
                <span className="text-sm text-muted-foreground">Invited by</span>
                <span className="font-medium text-foreground">{data.parentFirstName}</span>
              </div>
            </div>

            {/* Main Hero */}
            <div className="text-left mb-8">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-tight mb-4">
                <span className="relative">
                  Support {data.childFirstName}'s Reading!
                  {/* Highlighter effect */}
                  <span 
                    className="absolute inset-0 -skew-y-1 bg-accent/30 -z-10 transform -rotate-[0.5deg]"
                    style={{
                      top: '50%',
                      height: '50%',
                      left: '-1%',
                      right: '-1%',
                      borderRadius: '4px 8px 4px 6px',
                    }}
                    aria-hidden="true"
                  />
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {data.childFirstName} is a {data.grade} grader at {data.schoolName} participating in the Read-a-thon. 
                Your pledge helps encourage reading and raises funds for our school.
              </p>
            </div>

            {/* Stats Row */}
            <div 
              className="grid grid-cols-3 gap-6 md:gap-10 bg-background p-6 md:p-8 mb-8"
              style={handDrawnBorder}
            >
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl text-foreground tracking-tight">
                  {data.readingGoal}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Minute Goal
                </p>
              </div>
              <div 
                className="text-center px-4 md:px-6"
                style={{
                  borderLeft: 'solid 1px #41403E',
                  borderRight: 'solid 1px #41403E',
                }}
              >
                <p className="font-serif text-3xl md:text-4xl text-foreground tracking-tight">
                  {data.daysLeft}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Days Left
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="font-serif text-3xl md:text-4xl text-foreground tracking-tight">
                    {data.sponsorCount}
                  </p>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Sponsors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: 'solid 2px #41403E' }} />

      {/* Progress & Pledge Section */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8">
              {/* Progress Ring - Left */}
              <div className="md:col-span-2 flex flex-col items-center justify-start">
                <ReadingGoalRing 
                  progress={data.minutesRead} 
                  goal={data.readingGoal} 
                  size={180}
                  mobileSize={160}
                />
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {data.childFirstName} has already read <span className="font-handwritten text-xl text-primary">{data.minutesRead}</span> minutes!
                </p>
              </div>

              {/* Pledge Form - Right */}
              <div className="md:col-span-3">
                <div 
                  className="bg-background p-6 md:p-8 shadow-md"
                  style={handDrawnBorder}
                >
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
                    Make Your Pledge
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sponsor Name */}
                    <FormField label="Your name" htmlFor="sponsorName">
                      <Input
                        id="sponsorName"
                        value={sponsorName}
                        onChange={(e) => setSponsorName(e.target.value)}
                        placeholder="Enter your name"
                        className="h-12"
                        required
                      />
                    </FormField>

                    {/* Pledge Type */}
                    <div className="space-y-3">
                      <label className="block font-serif text-lg text-foreground">
                        Choose how you'd like to pledge
                      </label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setUsePerMinute(true);
                            setSelectedAmount(null);
                            setCustomAmount("");
                          }}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            usePerMinute
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <p className="font-serif text-base text-foreground mb-1">Per minute</p>
                          <p className="text-xs text-muted-foreground">
                            The more they read!
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUsePerMinute(false);
                            if (!selectedAmount) setSelectedAmount(50);
                          }}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            !usePerMinute
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <p className="font-serif text-base text-foreground mb-1">Flat amount</p>
                          <p className="text-xs text-muted-foreground">
                            One-time gift
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Amount Selection */}
                    {usePerMinute ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-2">
                          {[0.05, 0.10, 0.15, 0.25].map((rate) => (
                            <button
                              key={rate}
                              type="button"
                              onClick={() => setPerMinuteRate(rate.toString())}
                              className={cn(
                                "h-12 rounded-lg font-handwritten text-xl transition-all border-2",
                                parseFloat(perMinuteRate) === rate
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card text-foreground border-border hover:border-primary/50"
                              )}
                            >
                              ${rate.toFixed(2)}
                            </button>
                          ))}
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              If goal met ({data.readingGoal} min):
                            </span>
                            <span className="font-handwritten text-2xl text-primary">
                              ${calculatedPerMinute.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {AMOUNT_OPTIONS.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount("");
                            }}
                            className={cn(
                              "h-12 rounded-lg font-handwritten text-2xl transition-all border-2",
                              selectedAmount === amount && !customAmount
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card text-foreground border-border hover:border-primary/50"
                            )}
                          >
                            ${amount}
                          </button>
                        ))}
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            min={1}
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setSelectedAmount(null);
                            }}
                            placeholder="Other"
                            className="h-12 pl-7 text-center"
                          />
                        </div>
                      </div>
                    )}

                    {/* Payment Method */}
                    {effectiveAmount && effectiveAmount > 0 && (
                      <div className="space-y-3">
                        <label className="block font-serif text-lg text-foreground">
                          How would you like to pay?
                        </label>

                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={cn(
                              "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3",
                              paymentMethod === "card"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="font-medium">Pay now by card</span>
                          </button>

                          {paymentMethod === "card" && (
                            <div className="ml-4 p-4 bg-muted/30 rounded-lg space-y-3">
                              <FormField label="Card number">
                                <Input
                                  type="text"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                                  placeholder="1234 5678 9012 3456"
                                  className="h-10"
                                />
                              </FormField>
                              <div className="grid grid-cols-3 gap-3">
                                <FormField label="Expiry">
                                  <Input
                                    type="text"
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                                    placeholder="MM/YY"
                                    className="h-10"
                                  />
                                </FormField>
                                <FormField label="CVV">
                                  <Input
                                    type="text"
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                    placeholder="123"
                                    className="h-10"
                                  />
                                </FormField>
                                <FormField label="ZIP">
                                  <Input
                                    type="text"
                                    value={cardZip}
                                    onChange={(e) => setCardZip(e.target.value.slice(0, 5))}
                                    placeholder="12345"
                                    className="h-10"
                                  />
                                </FormField>
                              </div>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setPaymentMethod("later")}
                            className={cn(
                              "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3",
                              paymentMethod === "later"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <Mail className="h-5 w-5 text-primary" />
                            <span className="font-medium">Pay later (email reminder)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod("check")}
                            className={cn(
                              "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3",
                              paymentMethod === "check"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium">Pay by check</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full h-14 text-lg"
                      style={handDrawnBorder}
                    >
                      {isSubmitting ? (
                        "Processing..."
                      ) : (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Confirm ${effectiveAmount?.toFixed(2) || "0.00"} Pledge
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SponsorLandingPage;
