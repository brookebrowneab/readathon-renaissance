import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Logo, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Copy, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Printer,
  Plus,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const OnboardingComplete = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [childData, setChildData] = useState<{
    firstName: string;
    lastInitial: string;
    readingGoal: number;
  } | null>(null);
  const [pledgeData, setPledgeData] = useState<{
    type: string;
    amount: number;
  } | null>(null);
  const [hasMultipleChildren, setHasMultipleChildren] = useState(false);

  useEffect(() => {
    const storedChild = sessionStorage.getItem('childData');
    const storedPledge = sessionStorage.getItem('pledgeData');
    const storedMultiple = sessionStorage.getItem('hasMultipleChildren');

    if (storedChild) {
      setChildData(JSON.parse(storedChild));
    } else {
      navigate('/onboarding/add-child');
    }

    if (storedPledge) {
      setPledgeData(JSON.parse(storedPledge));
    }

    if (storedMultiple) {
      setHasMultipleChildren(JSON.parse(storedMultiple));
    }
  }, [navigate]);

  const sponsorLink = childData 
    ? `${window.location.origin}/sponsor/${childData.firstName.toLowerCase()}-${childData.lastInitial.toLowerCase()}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sponsorLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (method: "email" | "sms" | "facebook" | "print") => {
    const message = `Help ${childData?.firstName} reach their reading goal! Pledge to support their reading journey: ${sponsorLink}`;
    
    switch (method) {
      case "email":
        window.open(`mailto:?subject=Support ${childData?.firstName}'s Reading Journey!&body=${encodeURIComponent(message)}`);
        break;
      case "sms":
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sponsorLink)}`);
        break;
      case "print":
        window.print();
        break;
    }
  };

  const handleAddAnother = () => {
    // Clear current child data but keep parent data
    sessionStorage.removeItem('childData');
    sessionStorage.removeItem('pledgeData');
    navigate('/onboarding/add-child');
  };

  if (!childData) return null;

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
        <div className="w-full max-w-lg">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  <Check className="h-4 w-4" />
                </div>
                {step < 3 && <div className="w-12 h-0.5 bg-primary" />}
              </div>
            ))}
          </div>

          <div 
            className="animate-fade-in bg-card p-8 shadow-book"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h1 className="font-serif text-2xl text-foreground">
                  You're all set!
                </h1>
                <p className="text-muted-foreground mt-1">
                  {childData.firstName} is ready to start reading
                </p>
              </div>

              {/* Summary */}
              <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-center gap-6">
                  <ReadingGoalRing progress={0} goal={childData.readingGoal} size={100} />
                  <div className="text-left">
                    <p className="font-medium text-lg text-foreground">
                      {childData.firstName} {childData.lastInitial}.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Goal: {childData.readingGoal} minutes
                    </p>
                    {pledgeData && (
                      <p className="text-sm text-success font-medium mt-1">
                        ${pledgeData.amount.toFixed(2)} pledged
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Share Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="font-medium text-foreground">
                    Share {childData.firstName}'s sponsor link
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Invite family and friends to support {childData.firstName}'s reading journey
                  </p>
                </div>

                {/* Copy Link */}
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground truncate">
                    {sponsorLink}
                  </div>
                  <Button
                    variant={copied ? "secondary" : "outline"}
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Share Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-3 gap-1"
                    onClick={() => handleShare("email")}
                  >
                    <Mail className="h-5 w-5" />
                    <span className="text-xs">Email</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-3 gap-1"
                    onClick={() => handleShare("sms")}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">Text</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-3 gap-1"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="text-xs">Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-3 gap-1"
                    onClick={() => handleShare("print")}
                  >
                    <Printer className="h-5 w-5" />
                    <span className="text-xs">Print</span>
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {hasMultipleChildren && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAddAnother}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Child
                  </Button>
                )}
                
                <Button asChild className="w-full">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default OnboardingComplete;
