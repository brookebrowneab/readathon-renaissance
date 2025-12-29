import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  BookOpen,
  Shield,
} from "lucide-react";

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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRequestingAccess(false);
    setAccessRequested(true);
    setShowRequestConfirm(false);
  };

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (sponsorCode.trim()) {
      // Navigate to sponsor page with code
      navigate(`/s/${sponsorCode.trim()}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground">
                  Welcome back, {mockSponsor.name.split(" ")[0]}!
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 text-base py-1 px-3">
                  <Sparkles className="h-4 w-4" />
                  Returning Sponsor
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="lg" className="text-lg text-muted-foreground h-14">
              <LogOut className="h-5 w-5 mr-2" />
              Sign out
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg text-muted-foreground">Total Given</p>
                  <p className="text-3xl font-bold">${totalGiven.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-full bg-success/10">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-lg text-muted-foreground">Sponsorships</p>
                  <p className="text-3xl font-bold">{mockPastSponsorships.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent-gold/10">
                  <Calendar className="h-6 w-6 text-accent-gold" />
                </div>
                <div>
                  <p className="text-lg text-muted-foreground">Years Sponsoring</p>
                  <p className="text-3xl font-bold">{yearsSponsoring}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Past Sponsorships */}
          <section className="mb-10">
            <h2 className="text-2xl font-medium text-foreground mb-4">
              Your Past Sponsorships
            </h2>

            <div className="space-y-4">
              {mockPastSponsorships.map((sponsorship) => (
                <BookContainer key={sponsorship.id} variant="default" className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-medium text-foreground">
                          {sponsorship.year} {sponsorship.eventName}
                        </h3>
                        <Badge variant="success" className="gap-1 text-base">
                          <CheckCircle className="h-4 w-4" />
                          {sponsorship.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                      </div>

                      <p className="text-lg text-muted-foreground mb-4">
                        You sponsored a student:
                      </p>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-muted-foreground mb-1">Your pledge</p>
                          <p className="text-xl font-semibold text-foreground">
                            {sponsorship.pledgeType === "per-minute"
                              ? `$${sponsorship.pledgeAmount}/min`
                              : `$${sponsorship.pledgeAmount}`}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-muted-foreground mb-1">They read</p>
                          <p className="text-xl font-semibold text-foreground">
                            {sponsorship.minutesRead} minutes
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-muted-foreground mb-1">Status</p>
                          <p className="text-xl font-semibold text-success">
                            Paid ✓
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </BookContainer>
              ))}
            </div>
          </section>

          {/* Sponsor Again Section */}
          <section>
            <h2 className="text-2xl font-medium text-foreground mb-4 flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              Sponsor Again in {currentYear}
            </h2>

            {/* Privacy Notice */}
            <BookContainer variant="warm" className="p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="text-lg text-foreground">
                  To protect student privacy, we check with families each year before sharing their child's information.
                </p>
              </div>
            </BookContainer>

            <div className="space-y-4">
              {/* Option 1: Wait for invitation */}
              <BookContainer variant="default" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-muted flex-shrink-0">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      Wait for an invitation
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      The family may send you one when they enroll their child.
                    </p>
                  </div>
                </div>
              </BookContainer>

              {/* Option 2: Request Access */}
              <BookContainer variant="default" className="p-6">
                {accessRequested ? (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-success/10 flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-foreground mb-2">
                        Request sent!
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        We've notified the family. You'll get an email when they respond.
                      </p>
                    </div>
                  </div>
                ) : showRequestConfirm ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-foreground mb-2">
                          Confirm your request
                        </h3>
                        <p className="text-lg text-muted-foreground">
                          We'll send a message to the family letting them know you'd like to sponsor their child again.
                        </p>
                        <p className="text-lg text-muted-foreground mt-2">
                          You'll receive an email when they respond.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 ml-16">
                      <Button
                        onClick={handleRequestAccess}
                        loading={isRequestingAccess}
                        disabled={isRequestingAccess}
                        className="h-14 text-lg px-8"
                        size="lg"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        Send Request
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowRequestConfirm(false)}
                        className="h-14 text-lg"
                        size="lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-foreground mb-2">
                        Request access
                      </h3>
                      <p className="text-lg text-muted-foreground mb-4">
                        We'll ask the family if they'd like your support.
                      </p>
                      <Button
                        onClick={() => setShowRequestConfirm(true)}
                        className="h-14 text-lg"
                        size="lg"
                      >
                        Request Access
                      </Button>
                    </div>
                  </div>
                )}
              </BookContainer>

              {/* Option 3: Enter sponsor link */}
              <BookContainer variant="default" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-muted flex-shrink-0">
                    <LinkIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      I have a sponsor link
                    </h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      Enter the code or link the family shared with you.
                    </p>
                    <form onSubmit={handleSubmitCode} className="flex gap-3">
                      <Input
                        placeholder="Enter code or paste link"
                        value={sponsorCode}
                        onChange={(e) => setSponsorCode(e.target.value)}
                        className="h-14 text-lg flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={!sponsorCode.trim()}
                        className="h-14 text-lg px-6"
                        size="lg"
                      >
                        Go
                      </Button>
                    </form>
                  </div>
                </div>
              </BookContainer>
            </div>
          </section>

          {/* Footer Help */}
          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-lg text-center text-muted-foreground">
              Questions? Contact us at{" "}
              <a href="mailto:help@school.org" className="text-primary hover:underline">
                help@school.org
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorDashboardPage;