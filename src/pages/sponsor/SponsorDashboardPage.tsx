import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import booksShelfDivider from "@/assets/books-shelf-divider.png";
import {
  LogOut,
  DollarSign,
  CheckCircle,
  Clock,
  Heart,
  Sparkles,
  Calendar,
  Users,
  Mail,
  Link as LinkIcon,
  Send,
  Shield,
} from "lucide-react";

// Hand-drawn border style matching FAQ/Privacy pages
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Mock data - COPPA compliant (no child names without authorization)
const mockSponsor = {
  name: "Grandma Smith",
  email: "grandma@example.com",
};

const currentYear = "2025";

interface PastSponsorship {
  id: string;
  year: string;
  eventName: string;
  pledgeAmount: number;
  pledgeType: "fixed" | "per-minute";
  minutesRead: number;
  totalAmount: number;
  status: "paid" | "pending";
}

// Historical data - NO child names (COPPA/GDPR compliant)
const mockPastSponsorships: PastSponsorship[] = [
  {
    id: "1",
    year: "2024",
    eventName: "Fall Read-a-thon",
    pledgeAmount: 50,
    pledgeType: "fixed",
    minutesRead: 623,
    totalAmount: 50,
    status: "paid",
  },
  {
    id: "2",
    year: "2024",
    eventName: "Spring Read-a-thon",
    pledgeAmount: 0.05,
    pledgeType: "per-minute",
    minutesRead: 487,
    totalAmount: 24.35,
    status: "paid",
  },
  {
    id: "3",
    year: "2023",
    eventName: "Fall Read-a-thon",
    pledgeAmount: 25,
    pledgeType: "fixed",
    minutesRead: 350,
    totalAmount: 25,
    status: "paid",
  },
];

const SponsorDashboardPage = () => {
  const navigate = useNavigate();
  const [sponsorCode, setSponsorCode] = useState("");
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);
  const [showRequestConfirm, setShowRequestConfirm] = useState(false);

  const totalGiven = mockPastSponsorships.reduce((sum, p) => sum + p.totalAmount, 0);
  const yearsSponsoring = [...new Set(mockPastSponsorships.map(p => p.year))].length;

  const handleRequestAccess = async () => {
    setIsRequestingAccess(true);
    
    // Simulate API call to send notification email
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate successful email sent
    setIsRequestingAccess(false);
    setAccessRequested(true);
    setShowRequestConfirm(false);
    
    toast.success("Request sent to the family!", {
      description: "They'll receive an email and you'll be notified when they respond.",
    });
  };

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (sponsorCode.trim()) {
      // Navigate to sponsor page with code
      navigate(`/s/${sponsorCode.trim()}`);
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="container">
          <div className="max-w-4xl pl-9 md:pl-14 lg:pl-20">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                {/* Large headline with highlighter effect */}
                <div className="relative inline-block mb-4">
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.05] relative">
                    <span className="relative">
                      Welcome back,<br />{mockSponsor.name.split(" ")[0]}!
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
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1 text-base py-1 px-3">
                    <Sparkles className="h-4 w-4" />
                    Returning Sponsor
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="lg" className="text-muted-foreground">
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </Button>
            </div>
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

      {/* Stats Section */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Stats Grid */}
            <div 
              className="grid sm:grid-cols-3 gap-0 bg-background mb-10"
              style={handDrawnBorder}
            >
              <div className="p-6 text-center border-b sm:border-b-0 sm:border-r border-border">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <p className="font-handwritten text-4xl text-primary mb-1">
                  ${totalGiven.toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Given</p>
              </div>
              <div className="p-6 text-center border-b sm:border-b-0 sm:border-r border-border">
                <div className="p-3 rounded-full bg-success/10 w-fit mx-auto mb-3">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <p className="font-handwritten text-4xl text-success mb-1">
                  {mockPastSponsorships.length}
                </p>
                <p className="text-sm text-muted-foreground">Sponsorships</p>
              </div>
              <div className="p-6 text-center">
                <div className="p-3 rounded-full bg-accent/10 w-fit mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <p className="font-handwritten text-4xl text-accent mb-1">
                  {yearsSponsoring}
                </p>
                <p className="text-sm text-muted-foreground">Years Sponsoring</p>
              </div>
            </div>

            {/* Past Sponsorships */}
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 pb-2 border-b border-foreground/20">
              Your Past Sponsorships
            </h2>

            <div className="space-y-4 mb-10">
              {mockPastSponsorships.map((sponsorship) => (
                <div 
                  key={sponsorship.id} 
                  className="p-6 bg-background"
                  style={handDrawnBorder}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <h3 className="font-serif text-xl text-foreground">
                        {sponsorship.year} {sponsorship.eventName}
                      </h3>
                      <p className="text-muted-foreground">
                        You sponsored a student
                      </p>
                    </div>
                    <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {sponsorship.status === "paid" ? "Paid" : "Pending"}
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Your pledge</p>
                      <p className="font-handwritten text-2xl text-foreground">
                        {sponsorship.pledgeType === "per-minute"
                          ? `$${sponsorship.pledgeAmount}/min`
                          : `$${sponsorship.pledgeAmount}`}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">They read</p>
                      <p className="font-handwritten text-2xl text-foreground">
                        {sponsorship.minutesRead} min
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total</p>
                      <p className="font-handwritten text-2xl text-success">
                        ${sponsorship.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sponsor Again Section */}
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 pb-2 border-b border-foreground/20 flex items-center gap-3">
              <Heart className="h-7 w-7 text-primary" />
              Sponsor Again in {currentYear}
            </h2>

            {/* Privacy Notice */}
            <div 
              className="p-5 bg-primary/5 mb-6 flex items-start gap-4"
              style={handDrawnBorder}
            >
              <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-foreground">
                To protect student privacy, we check with families each year before sharing their child's information.
              </p>
            </div>

            <div className="space-y-4">
              {/* Option 1: Wait for invitation */}
              <div 
                className="p-5 bg-background flex items-start gap-4"
                style={handDrawnBorder}
              >
                <div className="p-2 rounded-full bg-muted flex-shrink-0">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1">
                    Wait for an invitation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The family may send you one when they enroll their child.
                  </p>
                </div>
              </div>

              {/* Option 2: Request Access */}
              <div 
                className="p-5 bg-background"
                style={handDrawnBorder}
              >
                {accessRequested ? (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-success/10 flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-foreground mb-1">
                        Request sent!
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We've notified the family. You'll get an email when they respond.
                      </p>
                    </div>
                  </div>
                ) : showRequestConfirm ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-foreground mb-1">
                          Confirm your request
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          We'll send a message to the family letting them know you'd like to sponsor their child again.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 ml-11">
                      <Button
                        onClick={handleRequestAccess}
                        disabled={isRequestingAccess}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isRequestingAccess ? "Sending..." : "Send Request"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowRequestConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-foreground mb-1">
                        Request access
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        We'll ask the family if they'd like your support.
                      </p>
                      <Button onClick={() => setShowRequestConfirm(true)}>
                        Request Access
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 3: Enter sponsor link */}
              <div 
                className="p-5 bg-background"
                style={handDrawnBorder}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-muted flex-shrink-0">
                    <LinkIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-foreground mb-1">
                      I have a sponsor link
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enter the code or link the family shared with you.
                    </p>
                    <form onSubmit={handleSubmitCode} className="flex gap-2">
                      <Input
                        placeholder="Enter code or paste link"
                        value={sponsorCode}
                        onChange={(e) => setSponsorCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={!sponsorCode.trim()}
                      >
                        Go
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Help */}
            <div className="mt-10 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Questions? Contact us at{" "}
                <a href="mailto:help@school.org" className="text-primary hover:underline">
                  help@school.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SponsorDashboardPage;
