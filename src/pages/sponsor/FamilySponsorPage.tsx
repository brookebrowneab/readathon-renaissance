import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { useSponsorAuth } from "@/hooks/useSponsorAuth";
import { useFamilyChildren } from "@/hooks/useFamilyChildren";
import { usePledges } from "@/hooks/usePledges";
import { useActiveEvent, formatEventDates } from "@/hooks/useActiveEvent";
import { sendPledgeNotification } from "@/lib/notifications";
import { supabase } from "@/integrations/supabase/client";
import { 
  CreditCard, 
  Mail, 
  FileText, 
  Check,
  Users,
  LogOut,
  BookOpen,
  User,
  Phone,
  ArrowRight,
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

const AMOUNT_OPTIONS = [25, 50, 100];

type PaymentMethod = "card" | "later" | "check" | null;

const FamilySponsorPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const preselectedChildId = searchParams.get("child");
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, loading: authLoading, sponsor, signOut, needsProfileCompletion, updateSponsorProfile, user } = useSponsorAuth();
  
  // Fetch family's children
  const { data: children, isLoading: childrenLoading, error: childrenError } = useFamilyChildren(userId);
  const { data: activeEvent } = useActiveEvent();
  const eventDates = formatEventDates(activeEvent);
  const { addPledge } = usePledges();

  // Form state
  const [selectedChildIds, setSelectedChildIds] = useState<Set<string>>(new Set());
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

  // Profile completion state (for returning magic link users)
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Set sponsor name from profile when available
  useEffect(() => {
    if (sponsor?.name) {
      setSponsorName(sponsor.name);
    }
  }, [sponsor]);

  // Pre-select child if specified in URL
  useEffect(() => {
    if (preselectedChildId && children?.some(c => c.id === preselectedChildId)) {
      setSelectedChildIds(new Set([preselectedChildId]));
    }
  }, [preselectedChildId, children]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/sponsor/auth", { 
        state: { from: location.pathname + location.search },
        replace: true 
      });
    }
  }, [authLoading, isAuthenticated, navigate, location.pathname, location.search]);

  const toggleChild = (childId: string) => {
    setSelectedChildIds(prev => {
      const next = new Set(prev);
      if (next.has(childId)) {
        next.delete(childId);
      } else {
        next.add(childId);
      }
      return next;
    });
  };

  const selectAllChildren = () => {
    if (children) {
      setSelectedChildIds(new Set(children.map(c => c.id)));
    }
  };

  const deselectAllChildren = () => {
    setSelectedChildIds(new Set());
  };

  // Calculate combined goal for selected children
  const combinedStats = useMemo(() => {
    if (!children) return { totalGoal: 0, totalMinutes: 0, childCount: 0 };
    
    const selected = children.filter(c => selectedChildIds.has(c.id));
    return {
      totalGoal: selected.reduce((sum, c) => sum + (c.goal_minutes || 300), 0),
      totalMinutes: selected.reduce((sum, c) => sum + (c.total_minutes || 0), 0),
      childCount: selected.length,
    };
  }, [children, selectedChildIds]);

  const effectiveAmountPerChild = useMemo(() => {
    if (usePerMinute) {
      // For per-minute, we use the average goal across selected children
      const avgGoal = combinedStats.childCount > 0 
        ? combinedStats.totalGoal / combinedStats.childCount 
        : 300;
      return parseFloat(perMinuteRate) * avgGoal;
    }
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  }, [selectedAmount, customAmount, usePerMinute, perMinuteRate, combinedStats]);

  const totalPledgeAmount = useMemo(() => {
    if (!effectiveAmountPerChild || combinedStats.childCount === 0) return 0;
    return effectiveAmountPerChild * combinedStats.childCount;
  }, [effectiveAmountPerChild, combinedStats.childCount]);

  const isFormValid = useMemo(() => {
    if (!sponsorName.trim()) return false;
    if (selectedChildIds.size === 0) return false;
    if (!effectiveAmountPerChild || effectiveAmountPerChild <= 0) return false;
    if (!paymentMethod) return false;
    if (paymentMethod === "card") {
      return cardNumber.length >= 15 && cardExpiry.length >= 4 && cardCvv.length >= 3 && cardZip.length >= 5;
    }
    return true;
  }, [sponsorName, selectedChildIds, effectiveAmountPerChild, paymentMethod, cardNumber, cardExpiry, cardCvv, cardZip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !children) return;

    setIsSubmitting(true);
    
    try {
      const selectedChildren = children.filter(c => selectedChildIds.has(c.id));
      
      // Create a pledge for each selected child
      for (const child of selectedChildren) {
        const pledgeAmount = usePerMinute 
          ? parseFloat(perMinuteRate)
          : (effectiveAmountPerChild || 0);

        await addPledge.mutateAsync({
          child_id: child.id,
          student_name: child.name,
          pledge_type: usePerMinute ? "per_minute" : "flat",
          amount: pledgeAmount,
          event_id: activeEvent?.id || null,
          sponsor_id: sponsor?.id || null,
          expected_payment_method: paymentMethod,
        });
        
        // Send email notification to parent
        try {
          const { data: parentProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", child.user_id)
            .maybeSingle();
          
          const { data: authData } = await supabase.auth.admin.getUserById(child.user_id);
          const parentEmail = authData?.user?.email;
          
          if (parentEmail) {
            await sendPledgeNotification({
              type: "pledge_created",
              pledgeId: "batch",
              recipientEmail: parentEmail,
              recipientName: parentProfile?.display_name || "Parent",
              sponsorName: sponsorName || sponsor?.name || "A sponsor",
              studentName: child.name,
              amount: pledgeAmount,
              pledgeType: usePerMinute ? "per_minute" : "flat",
            });
          }
        } catch (notifyError) {
          console.error("Failed to send notification:", notifyError);
        }
      }
      
      navigate("/sponsor/pledged");
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleProfileComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    setIsUpdatingProfile(true);
    try {
      const { error } = await updateSponsorProfile({
        name: profileName.trim(),
        phone: profilePhone.trim() || undefined,
      });
      
      if (error) {
        toast.error("Failed to save profile", { description: error.message });
      } else {
        toast.success("Profile saved!");
        setSponsorName(profileName.trim());
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const isLoading = authLoading || childrenLoading;

  // Show loading state
  if (isLoading) {
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

  // Show error if no children found
  if (childrenError || !children || children.length === 0) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Family Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This sponsor link may be invalid or the family is not accepting sponsors.
          </p>
          <Button onClick={() => navigate("/sponsor")}>
            Return to Sponsor Gateway
          </Button>
        </div>
      </PublicLayout>
    );
  }

  // Get family name from first child (First Name's Family)
  const familyName = children[0]?.name?.split(' ')[0] || 'This';

  // Profile completion screen for returning sponsors via magic link
  if (needsProfileCompletion) {
    return (
      <PublicLayout>
        {/* User Header Bar */}
        <div className="border-b border-border bg-background">
          <div className="container py-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground font-medium">{user?.email}</span>
            </p>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground mb-2">
                  Welcome Back!
                </h1>
                <p className="text-muted-foreground">
                  Please complete your profile to continue sponsoring {familyName}'s family.
                </p>
              </div>

              <div 
                className="bg-background p-6 md:p-8 shadow-md"
                style={handDrawnBorder}
              >
                <form onSubmit={handleProfileComplete} className="space-y-5">
                  <FormField label="Your name" htmlFor="profileName">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="profileName"
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Enter your name"
                        className="h-12 pl-10"
                        disabled={isUpdatingProfile}
                        autoFocus
                      />
                    </div>
                  </FormField>

                  <FormField 
                    label="Phone number (optional)" 
                    htmlFor="profilePhone"
                    helperText="For pledge reminders and event updates"
                  >
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="profilePhone"
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="h-12 pl-10"
                        disabled={isUpdatingProfile}
                      />
                    </div>
                  </FormField>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg"
                    disabled={isUpdatingProfile || !profileName.trim()}
                    style={handDrawnBorder}
                  >
                    {isUpdatingProfile ? "Saving..." : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* User Header Bar */}
      <div className="border-b border-border bg-background">
        <div className="container py-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="text-foreground font-medium">{sponsor?.email || user?.email}</span>
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
            {/* Main Hero */}
            <div className="text-left mb-8">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-tight mb-4">
                <span className="relative">
                  Support {familyName}'s Family!
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
                This family has {children.length} reader{children.length > 1 ? 's' : ''} participating in the Read-a-thon. 
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
                  {children.length}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Reader{children.length > 1 ? 's' : ''}
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
                  {eventDates.daysRemaining}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Days Left
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <p className="font-serif text-3xl md:text-4xl text-foreground tracking-tight">
                    {children.reduce((sum, c) => sum + (c.total_minutes || 0), 0)}
                  </p>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Total Minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: 'solid 2px #41403E' }} />

      {/* Child Selection & Pledge Section */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8">
              {/* Child Selection - Left */}
              <div className="md:col-span-2 space-y-4">
                <div 
                  className="bg-background p-4 shadow-sm"
                  style={handDrawnBorder}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg text-foreground">
                      Select Readers
                    </h3>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={selectAllChildren}
                      >
                        All
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={deselectAllChildren}
                      >
                        None
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {children.map((child) => {
                      const firstName = child.name?.split(' ')[0] || 'Reader';
                      const lastInitial = child.name?.split(' ')[1]?.[0] || '';
                      const isSelected = selectedChildIds.has(child.id);
                      
                      return (
                        <label
                          key={child.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                            isSelected 
                              ? "bg-primary/10 border-2 border-primary" 
                              : "bg-muted/30 border-2 border-transparent hover:border-primary/30"
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleChild(child.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">
                              {firstName} {lastInitial}.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {child.grade_info || 'Student'} • {child.total_minutes || 0}/{child.goal_minutes || 300} min
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Selection Summary */}
                {selectedChildIds.size > 0 && (
                  <div 
                    className="bg-background p-4 shadow-sm"
                    style={handDrawnBorder}
                  >
                    <h3 className="font-serif text-lg text-foreground mb-3">
                      Your Pledge
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Children selected:</span>
                        <span className="font-medium">{selectedChildIds.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount per child:</span>
                        <span className="font-medium">
                          ${effectiveAmountPerChild?.toFixed(2) || '0.00'}
                          {usePerMinute && <span className="text-xs">/goal</span>}
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="text-foreground font-medium">Total:</span>
                        <span className="font-serif text-xl text-primary">
                          ${totalPledgeAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
                            Per child
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
                                "h-12 rounded-lg font-serif text-xl transition-all border-2",
                                parseFloat(perMinuteRate) === rate
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card text-foreground border-border hover:border-primary/50"
                              )}
                            >
                              ${rate.toFixed(2)}
                            </button>
                          ))}
                        </div>
                        
                        {selectedChildIds.size > 0 && (
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                If goals met ({combinedStats.totalGoal} min total):
                              </span>
                              <span className="font-serif text-2xl text-primary">
                                ${(parseFloat(perMinuteRate) * combinedStats.totalGoal).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
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
                              "h-12 rounded-lg font-serif text-2xl transition-all border-2",
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
                    {effectiveAmountPerChild && effectiveAmountPerChild > 0 && selectedChildIds.size > 0 && (
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
                      ) : selectedChildIds.size === 0 ? (
                        "Select readers to pledge"
                      ) : (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Confirm ${totalPledgeAmount.toFixed(2)} Pledge
                          {selectedChildIds.size > 1 && ` for ${selectedChildIds.size} readers`}
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

export default FamilySponsorPage;
