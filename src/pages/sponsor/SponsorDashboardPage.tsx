import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useSponsorPledges } from "@/hooks/useSponsorPledges";
import { useSponsorAuth } from "@/hooks/useSponsorAuth";
import { format } from "date-fns";
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
  Home,
  CreditCard,
  User,
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  Target,
} from "lucide-react";
import { ClassFundraisingShelf } from "@/components/ui/class-fundraising-shelf";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useClassFundraisingTotal } from "@/hooks/useClassFundraising";

// Hand-drawn border style matching FAQ/Privacy pages
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Menu items for the sidebar
const menuItems = [
  { label: "Dashboard", href: "/sponsor/dashboard", icon: Home },
  { label: "My Pledges", href: "/my-pledges", icon: Heart },
  { label: "Make Payment", href: "/sponsor/pay", icon: CreditCard },
  { label: "Account", href: "/sponsor/dashboard", icon: User },
];

// Class Support Card Component for displaying classroom pledges
interface ClassGroupData {
  className: string;
  teacher: { id: string; name: string } | null;
  pledges: {
    id: string;
    pledge_type: string;
    amount: number;
    is_paid: boolean;
    is_unlocked: boolean;
    milestone_minutes_target: number | null;
    created_at: string;
    event?: { id: string; name: string } | null;
  }[];
  totalAmount: number;
}

const ClassSupportCard = ({ classGroup }: { classGroup: ClassGroupData }) => {
  const { data: activeEvent } = useActiveEvent();
  const { data: fundraisingTotal = 0 } = useClassFundraisingTotal(
    classGroup.className,
    activeEvent?.id
  );
  
  const milestoneGoal = activeEvent?.class_milestone_goal || 1000;
  const milestoneReward = activeEvent?.class_milestone_reward || "Principal's Storytime";

  return (
    <div 
      className="p-6 bg-background"
      style={handDrawnBorder}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h3 className="font-serif text-xl text-foreground flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            {classGroup.className}
          </h3>
          {classGroup.teacher && (
            <p className="text-muted-foreground text-sm">
              {classGroup.teacher.name}
            </p>
          )}
        </div>
        <Badge variant="outline" className="gap-1">
          {classGroup.pledges.length} pledge{classGroup.pledges.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Class Pledge Goal Progress */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
          <Target className="h-3 w-3 text-accent" />
          Class Pledge Goal
        </p>
        <ClassFundraisingShelf
          fundedAmount={fundraisingTotal}
          goalAmount={milestoneGoal}
          rewardLabel={milestoneReward}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Your Contribution</p>
          <p className="font-handwritten text-2xl text-primary">
            ${classGroup.totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Class Total Raised</p>
          <p className="font-handwritten text-2xl text-success">
            ${fundraisingTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Individual pledges for this class */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        {classGroup.pledges.map((pledge) => (
          <div
            key={pledge.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
          >
            <div className="flex items-center gap-3">
              {pledge.is_paid ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : pledge.pledge_type === "milestone" && !pledge.is_unlocked ? (
                <Clock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Clock className="h-4 w-4 text-accent" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {pledge.pledge_type === "flat" 
                    ? "Flat donation" 
                    : `Milestone pledge`}
                  {pledge.pledge_type === "milestone" && pledge.milestone_minutes_target && (
                    <span className="text-xs text-muted-foreground ml-1">
                      @ {pledge.milestone_minutes_target.toLocaleString()} min
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(pledge.created_at), "MMM d, yyyy")}
                  {pledge.event?.name && ` • ${pledge.event.name}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-serif text-lg text-primary">
                ${pledge.amount.toFixed(2)}
              </p>
              <Badge
                variant={pledge.is_paid ? "success" : pledge.is_unlocked ? "outline" : "secondary"}
                className="text-xs"
              >
                {pledge.is_paid 
                  ? "Paid" 
                  : pledge.pledge_type === "milestone" && !pledge.is_unlocked 
                    ? "Locked" 
                    : "Pending"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SponsorDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useSponsorAuth();
  const { pledges, classPledges, pledgesByChild, pledgesByClass, stats, isLoading, sponsor, hasAnyPledges } = useSponsorPledges();
  
  const [sponsorCode, setSponsorCode] = useState("");
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);
  const [showRequestConfirm, setShowRequestConfirm] = useState(false);

  const currentYear = new Date().getFullYear().toString();
  const isReturning = hasAnyPledges;

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm">
          <div className="container py-8 max-w-3xl">
            <Skeleton className="h-12 w-64 mb-4" />
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-48 mb-4" />
            <Skeleton className="h-48" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      {/* Main Content */}
      <main className="flex-1 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="container py-8">
          <div className="flex gap-8">
            {/* Main content area */}
            <div className="flex-1 max-w-3xl mx-auto lg:mx-0 space-y-8">
              {/* Header Section */}
              <div className="space-y-4">
                <div>
                  <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
                    <span className="font-handwritten text-4xl text-primary">
                      {isReturning ? "Welcome back," : "Welcome,"}
                    </span>{" "}
                    {sponsor?.name?.split(" ")[0] || "Sponsor"}!
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      {isReturning ? "Returning Sponsor" : "New Sponsor"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Only show for returning sponsors */}
              {isReturning && (
                <div 
                  className="grid sm:grid-cols-3 gap-0 bg-background shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="p-6 text-center border-b sm:border-b-0 sm:border-r border-border">
                    <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-3">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-handwritten text-4xl text-primary mb-1">
                      ${stats.totalPledged.toFixed(0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Pledged</p>
                  </div>
                  <div className="p-6 text-center border-b sm:border-b-0 sm:border-r border-border">
                    <div className="p-3 rounded-full bg-success/10 w-fit mx-auto mb-3">
                      <Users className="h-6 w-6 text-success" />
                    </div>
                    <p className="font-handwritten text-4xl text-success mb-1">
                      {stats.childrenSupported + stats.classesSupported}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stats.classesSupported > 0 && stats.childrenSupported === 0 
                        ? "Classes Supported" 
                        : stats.classesSupported > 0 
                          ? "Children & Classes" 
                          : "Children Supported"}
                    </p>
                  </div>
                  <div className="p-6 text-center">
                    <div className="p-3 rounded-full bg-accent/10 w-fit mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <p className="font-handwritten text-4xl text-accent mb-1">
                      {stats.pledgeCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Pledges</p>
                  </div>
                </div>
              )}

              {/* Welcome message for first-time sponsors */}
              {!isReturning && (
                <div 
                  className="p-8 bg-background mb-10 text-center"
                  style={handDrawnBorder}
                >
                  <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto mb-4">
                    <Heart className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                    Ready to Make a Difference?
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for joining! Use a sponsor link from a family or enter a code below to start supporting a young reader.
                  </p>
                </div>
              )}

              {/* Children Being Supported */}
              {isReturning && pledgesByChild.length > 0 && (
                <>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 pb-2 border-b border-foreground/20">
                    Children You're Supporting
                  </h2>

                  <div className="space-y-4 mb-10">
                    {pledgesByChild.map((childGroup) => (
                      <div 
                        key={childGroup.childId} 
                        className="p-6 bg-background"
                        style={handDrawnBorder}
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                          <div>
                            <h3 className="font-serif text-xl text-foreground flex items-center gap-2">
                              <User className="h-5 w-5 text-muted-foreground" />
                              {childGroup.childName}
                            </h3>
                            {childGroup.child?.grade_info && (
                              <p className="text-muted-foreground text-sm">
                                {childGroup.child.grade_info}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="gap-1">
                            {childGroup.pledges.length} pledge{childGroup.pledges.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="bg-muted/30 rounded-lg p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Total Pledged</p>
                            <p className="font-handwritten text-2xl text-primary">
                              ${childGroup.totalAmount.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Minutes Read</p>
                            <p className="font-handwritten text-2xl text-foreground flex items-center justify-center gap-1">
                              <BookOpen className="h-5 w-5" />
                              {childGroup.child?.total_minutes || 0}
                            </p>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Goal Progress</p>
                            <p className="font-handwritten text-2xl text-success">
                              {childGroup.child
                                ? Math.round((childGroup.child.total_minutes / childGroup.child.goal_minutes) * 100)
                                : 0}%
                            </p>
                          </div>
                        </div>

                        {/* Individual pledges for this child */}
                        <div className="mt-4 pt-4 border-t border-border space-y-2">
                          {childGroup.pledges.map((pledge) => (
                            <div
                              key={pledge.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                            >
                              <div className="flex items-center gap-3">
                                {pledge.is_paid ? (
                                  <CheckCircle className="h-4 w-4 text-success" />
                                ) : (
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {pledge.pledge_type === "flat" ? "Flat pledge" : "Per-minute pledge"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(pledge.created_at), "MMM d, yyyy")}
                                    {pledge.event?.name && ` • ${pledge.event.name}`}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-serif text-lg text-primary">
                                  ${pledge.amount.toFixed(2)}
                                  {pledge.pledge_type === "per_minute" && (
                                    <span className="text-xs text-muted-foreground">/min</span>
                                  )}
                                </p>
                                <Badge
                                  variant={pledge.is_paid ? "success" : "outline"}
                                  className="text-xs"
                                >
                                  {pledge.is_paid ? "Paid" : "Pending"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Classes Being Supported */}
              {isReturning && pledgesByClass.length > 0 && (
                <>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 pb-2 border-b border-foreground/20">
                    Classrooms You're Supporting
                  </h2>

                  <div className="space-y-4 mb-10">
                    {pledgesByClass.map((classGroup) => (
                      <ClassSupportCard 
                        key={classGroup.className} 
                        classGroup={classGroup} 
                      />
                    ))}
                  </div>
                </>
              )}

              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 pb-2 border-b border-foreground/20 flex items-center gap-3">
                <Heart className="h-7 w-7 text-primary" />
                {isReturning ? `Sponsor Again in ${currentYear}` : `Get Started`}
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

              {/* Pending Payments Section */}
              {stats.pendingCount > 0 && (
                <>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 pb-2 border-b border-foreground/20 flex items-center gap-3">
                    <CircleDollarSign className="h-7 w-7 text-warning" />
                    Pending Payments
                  </h2>
                  <div 
                    className="p-6 bg-warning/5"
                    style={handDrawnBorder}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-serif text-foreground">
                          You have {stats.pendingCount} pending pledge{stats.pendingCount !== 1 ? "s" : ""}
                        </p>
                        <p className="text-muted-foreground">
                          Total amount: <span className="font-semibold">${stats.pendingAmount.toFixed(2)}</span>
                        </p>
                      </div>
                      <Button asChild>
                        <Link to="/sponsor/pay">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Make Payment
                        </Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Footer Help */}
              <div className="pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Questions? Contact us at{" "}
                  <a href="mailto:help@school.org" className="text-primary hover:underline">
                    help@school.org
                  </a>
                </p>
              </div>
            </div>

            {/* Desktop Sidebar - Quick Actions */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Quick Actions Menu */}
                <div 
                  className="p-5 bg-background shadow-md"
                  style={handDrawnBorder}
                >
                  <h3 className="font-serif text-lg text-foreground mb-4 pb-2 border-b border-border">
                    Quick Actions
                  </h3>
                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </nav>
                </div>

                {/* Stats Summary - Only for returning sponsors */}
                {isReturning && (
                  <div 
                    className="p-5 bg-background shadow-md"
                    style={handDrawnBorder}
                  >
                    <h3 className="font-serif text-lg text-foreground mb-4 pb-2 border-b border-border">
                      Your Impact
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="font-handwritten text-2xl text-primary">
                          ${stats.totalPledged.toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Pledged</p>
                      </div>
                      <div className="text-center">
                        <p className="font-handwritten text-2xl text-success">
                          {stats.paidCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Paid</p>
                      </div>
                      <div className="text-center">
                        <p className="font-handwritten text-2xl text-accent">
                          {stats.childrenSupported}
                        </p>
                        <p className="text-xs text-muted-foreground">Children</p>
                      </div>
                      <div className="text-center">
                        <p className="font-handwritten text-2xl text-warning">
                          {stats.pendingCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar role="sponsor" />
      
      {/* Spacer for mobile bottom bar */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default SponsorDashboardPage;
