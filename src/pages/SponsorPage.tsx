import { useState, useMemo } from "react";
import { PublicLayout } from "@/components/layout";
import { BookContainer, ReadingGoalRing, BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Users, Target, Clock, Heart, Share2, Mail, CreditCard, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the child being sponsored
const mockChildData = {
  firstName: "Emma",
  grade: "3rd Grade",
  minutesRead: 245,
  goalMinutes: 300,
  eventName: "Spring Read-a-thon 2024",
  eventEndDate: "April 15, 2024",
  daysRemaining: 12,
  sponsorCount: 4,
  teacherName: "Mrs. Anderson",
  classroom: "Room 204",
};

type PledgeType = "per-minute" | "flat";

const SponsorPage = () => {
  const [pledgeType, setPledgeType] = useState<PledgeType>("per-minute");
  const [perMinuteAmount, setPerMinuteAmount] = useState("0.05");
  const [flatAmount, setFlatAmount] = useState("25");
  const [maxPledgeCap, setMaxPledgeCap] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const percentage = Math.round((mockChildData.minutesRead / mockChildData.goalMinutes) * 100);

  // Calculate projected amounts
  const calculations = useMemo(() => {
    const perMin = parseFloat(perMinuteAmount) || 0;
    const flat = parseFloat(flatAmount) || 0;
    const cap = parseFloat(maxPledgeCap) || Infinity;

    if (pledgeType === "flat") {
      return {
        atCurrent: flat,
        atGoal: flat,
        at150: flat,
      };
    }

    const atCurrent = Math.min(mockChildData.minutesRead * perMin, cap);
    const atGoal = Math.min(mockChildData.goalMinutes * perMin, cap);
    const at150 = Math.min(mockChildData.goalMinutes * 1.5 * perMin, cap);

    return { atCurrent, atGoal, at150 };
  }, [pledgeType, perMinuteAmount, flatAmount, maxPledgeCap]);

  const handleSubmit = (payNow: boolean) => {
    // Mock submission
    console.log("Pledge submitted:", {
      sponsorName,
      sponsorEmail,
      relationship,
      pledgeType,
      amount: pledgeType === "per-minute" ? perMinuteAmount : flatAmount,
      maxPledgeCap,
      message,
      payNow,
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <PublicLayout>
        <div className="min-h-[80vh] bg-background-warm flex items-center justify-center py-16">
          <BookContainer variant="default" className="max-w-lg mx-4 p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="h-20 w-20 rounded-full bg-brand-green/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-brand-green" />
              </div>
              <BookIcon size="medium" variant="primary" />
              <h1 className="font-serif text-3xl font-normal text-brand-blue">
                Thank You, {sponsorName}!
              </h1>
              <p className="text-muted-foreground">
                Your pledge to support {mockChildData.firstName}'s reading journey means the world!
                You'll receive a confirmation email at <span className="font-medium text-foreground">{sponsorEmail}</span>.
              </p>
              
              <div className="w-full p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Your Pledge</p>
                <p className="font-handwritten text-2xl text-brand-blue">
                  {pledgeType === "per-minute" 
                    ? `$${perMinuteAmount}/minute` 
                    : `$${flatAmount} flat`}
                </p>
                {pledgeType === "per-minute" && (
                  <p className="text-sm text-muted-foreground">
                    Estimated: ${calculations.atGoal.toFixed(2)} at goal
                  </p>
                )}
              </div>

              <div className="space-y-3 w-full">
                <p className="text-sm font-medium text-foreground">Invite others to sponsor {mockChildData.firstName}!</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Friends
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                A confirmation email has been sent to your inbox.
              </p>
            </div>
          </BookContainer>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-background-warm py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Progress Display */}
            <div className="flex-1 flex justify-center">
              <BookContainer variant="default" className="w-full max-w-md p-6">
                <div className="flex flex-col items-center gap-4">
                  <h1 className="w-full text-left font-serif text-3xl font-normal tracking-tight text-brand-blue md:text-4xl">
                    {mockChildData.firstName}'s Reading
                  </h1>
                  <p className="w-full text-left text-muted-foreground">{mockChildData.grade}</p>
                  
                  <ReadingGoalRing 
                    progress={mockChildData.minutesRead} 
                    goal={mockChildData.goalMinutes} 
                    size={200} 
                  />
                  
                  <p className="font-handwritten text-2xl text-brand-blue text-center">
                    {mockChildData.minutesRead} minutes read so far!
                  </p>

                  <div className="w-full grid grid-cols-2 gap-3 mt-2">
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Calendar className="h-4 w-4 text-brand-blue mb-1" />
                      <span className="text-xs text-muted-foreground">{mockChildData.eventName}</span>
                      <span className="font-handwritten text-lg text-brand-blue">{mockChildData.daysRemaining} days left</span>
                    </div>
                    <div className="relative flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                      <Users className="h-4 w-4 text-brand-blue mb-1" />
                      <span className="text-xs text-muted-foreground">Sponsors</span>
                      <span className="font-handwritten text-lg text-brand-blue">{mockChildData.sponsorCount}</span>
                    </div>
                  </div>
                </div>
              </BookContainer>
            </div>

            {/* About Section */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-normal text-foreground mb-2">
                  Support {mockChildData.firstName}'s Reading Journey
                </h2>
                <p className="text-muted-foreground">
                  Your pledge helps encourage {mockChildData.firstName} to read more while supporting their school. 
                  Every minute counts!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Target className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Reading Goal</p>
                    <p className="font-handwritten text-xl text-brand-blue">{mockChildData.goalMinutes} min</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Event Ends</p>
                    <p className="font-handwritten text-xl text-brand-blue">{mockChildData.eventEndDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Users className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Teacher</p>
                    <p className="text-sm text-muted-foreground">{mockChildData.teacherName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Heart className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Classroom</p>
                    <p className="text-sm text-muted-foreground">{mockChildData.classroom}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pledge Form Section */}
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Pledge Form */}
            <div className="flex-1">
              <BookContainer variant="warm" className="p-6 md:p-8">
                <h2 className="font-serif text-2xl text-brand-blue mb-6">Make a Pledge</h2>
                
                <div className="space-y-6">
                  {/* Sponsor Info */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Your Information</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Smith"
                          value={sponsorName}
                          onChange={(e) => setSponsorName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="john@example.com"
                          value={sponsorEmail}
                          onChange={(e) => setSponsorEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship to {mockChildData.firstName}</Label>
                      <Select value={relationship} onValueChange={setRelationship}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grandparent">Grandparent</SelectItem>
                          <SelectItem value="aunt-uncle">Aunt/Uncle</SelectItem>
                          <SelectItem value="family-friend">Family Friend</SelectItem>
                          <SelectItem value="neighbor">Neighbor</SelectItem>
                          <SelectItem value="coworker">Parent's Coworker</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pledge Type Toggle */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Pledge Type</h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={pledgeType === "per-minute" ? "default" : "outline"}
                        className={cn(
                          "flex-1",
                          pledgeType === "per-minute" && "bg-brand-blue text-white hover:bg-brand-blue/90"
                        )}
                        onClick={() => setPledgeType("per-minute")}
                      >
                        Per Minute
                      </Button>
                      <Button
                        type="button"
                        variant={pledgeType === "flat" ? "default" : "outline"}
                        className={cn(
                          "flex-1",
                          pledgeType === "flat" && "bg-brand-blue text-white hover:bg-brand-blue/90"
                        )}
                        onClick={() => setPledgeType("flat")}
                      >
                        Flat Amount
                      </Button>
                    </div>
                  </div>

                  {/* Amount Input */}
                  {pledgeType === "per-minute" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="perMinute">Amount per minute read</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="perMinute"
                            type="number"
                            step="0.01"
                            min="0.01"
                            className="pl-7"
                            value={perMinuteAmount}
                            onChange={(e) => setPerMinuteAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {["0.03", "0.05", "0.10", "0.25"].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={cn(
                              "flex-1",
                              perMinuteAmount === amount && "border-brand-blue text-brand-blue"
                            )}
                            onClick={() => setPerMinuteAmount(amount)}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cap">Maximum pledge cap (optional)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="cap"
                            type="number"
                            step="1"
                            min="1"
                            className="pl-7"
                            placeholder="No limit"
                            value={maxPledgeCap}
                            onChange={(e) => setMaxPledgeCap(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="flatAmount">Donation amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="flatAmount"
                            type="number"
                            step="1"
                            min="1"
                            className="pl-7"
                            value={flatAmount}
                            onChange={(e) => setFlatAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {["10", "25", "50", "100"].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={cn(
                              "flex-1",
                              flatAmount === amount && "border-brand-blue text-brand-blue"
                            )}
                            onClick={() => setFlatAmount(amount)}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optional Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message for {mockChildData.firstName} (optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Keep up the great reading!"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </BookContainer>
            </div>

            {/* Calculator & Payment */}
            <div className="lg:w-96 space-y-6">
              {/* Pledge Calculator */}
              <BookContainer variant="default" className="p-6">
                <h3 className="font-serif text-xl text-brand-blue mb-4">Pledge Calculator</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">At current progress</span>
                    <span className="font-handwritten text-xl text-brand-blue">
                      ${calculations.atCurrent.toFixed(2)}
                    </span>
                  </div>
                  <div className="relative flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                    <span className="text-sm text-muted-foreground">If goal reached ({mockChildData.goalMinutes} min)</span>
                    <span className="font-handwritten text-xl text-brand-green">
                      ${calculations.atGoal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">If 150% of goal</span>
                    <span className="font-handwritten text-xl text-brand-blue">
                      ${calculations.at150.toFixed(2)}
                    </span>
                  </div>
                </div>
                {maxPledgeCap && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Your pledge is capped at ${parseFloat(maxPledgeCap).toFixed(2)}
                  </p>
                )}
              </BookContainer>

              {/* Payment Options */}
              <BookContainer variant="warm" className="p-6">
                <h3 className="font-serif text-xl text-brand-blue mb-4">Complete Your Pledge</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-brand-blue text-white hover:bg-brand-blue/90"
                    onClick={() => handleSubmit(true)}
                    disabled={!sponsorName || !sponsorEmail}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSubmit(false)}
                    disabled={!sponsorName || !sponsorEmail}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Pledge Now, Pay Later
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    "Pay Later" pledges will be collected when the event ends on {mockChildData.eventEndDate}
                  </p>
                </div>
              </BookContainer>

              {/* Encouragement */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20">
                <Heart className="h-5 w-5 text-brand-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Every pledge matters!</p>
                  <p className="text-xs text-muted-foreground">
                    Your support motivates {mockChildData.firstName} to keep reading and helps fund important school programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SponsorPage;
