import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ReadingGoalRing } from "@/components/legacy";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassFundraisingShelf } from "@/components/ui/class-fundraising-shelf";
import {
  BookOpen,
  Plus,
  UserPlus,
  DollarSign,
  ChevronRight,
  LogOut,
  Star,
  Bell,
  Heart,
} from "lucide-react";
import { useChildren } from "@/hooks/useChildren";
import { useParentPledges } from "@/hooks/useParentPledges";
import { useSponsorPledges } from "@/hooks/useSponsorPledges";
import { usePledges } from "@/hooks/usePledges";
import { useAllChildrenReadingLogs } from "@/hooks/useReadingLogs";
import { useClassGradeTotals } from "@/hooks/useClassGradeTotals";
import { useMultipleClassFundraisingTotals } from "@/hooks/useClassFundraising";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { PledgesSection } from "@/components/dashboard/PledgesSection";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { format, isToday, isYesterday, parseISO } from "date-fns";

// Hand-drawn border style (consistent with HomePage)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Mock pending sponsor requests
const mockPendingSponsorRequests = 2;

// Helper to format date for display
const formatLogDate = (dateStr: string): string => {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
};

// Calculate longest single reading session from logs
const calculateLongestStreak = (logs: { minutes: number }[]): number => {
  if (!logs.length) return 0;
  return Math.max(...logs.map(log => log.minutes));
};

// Calculate minutes read today from logs
const calculateMinutesToday = (logs: { logged_at: string; minutes: number }[]): number => {
  const today = format(new Date(), "yyyy-MM-dd");
  return logs
    .filter(log => log.logged_at === today)
    .reduce((sum, log) => sum + log.minutes, 0);
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const { children, isLoading: childrenLoading } = useChildren();
  const { pledgesByChild: parentPledgesByChild, totalPledges: parentTotalPledges, isLoading: parentPledgesLoading } = useParentPledges();
  const { pledgesByChild: sponsorPledgesByChild, pledgesByClass: sponsorPledgesByClass, classPledges: sponsorClassPledges, stats: sponsorStats, isLoading: sponsorPledgesLoading, sponsor } = useSponsorPledges();
  const { deletePledge } = usePledges();
  
  // Determine if user is primarily a sponsor (has sponsor profile but no children)
  const isSponsorOnly = sponsor && children.length === 0;
  
  // Merge pledges: Use sponsor pledges if sponsor-only, otherwise use parent pledges
  // For users who are both parents and sponsors, show parent pledges (their children's incoming pledges)
  const pledgesByChild = isSponsorOnly 
    ? sponsorPledgesByChild.map(item => ({
        childId: item.childId,
        childName: item.childName,
        pledges: item.pledges.map(p => ({
          id: p.id,
          child_id: p.child_id,
          event_id: p.event_id,
          sponsor_id: p.sponsor_id,
          student_name: p.student_name,
          pledge_type: p.pledge_type,
          amount: p.amount,
          is_paid: p.is_paid,
          payment_status: p.payment_status,
          expected_payment_method: p.expected_payment_method,
          created_at: p.created_at,
        })),
        totalAmount: item.totalAmount,
        sponsorCount: 1, // Sponsor is viewing their own pledges
      }))
    : parentPledgesByChild;
  
  const totalPledges = isSponsorOnly ? sponsorStats.totalPledged : parentTotalPledges;
  const pledgesLoading = parentPledgesLoading || sponsorPledgesLoading;
  const { data: logsByChild, isLoading: logsLoading } = useAllChildrenReadingLogs();
  const { data: classGradeTotals } = useClassGradeTotals(children);
  const { data: activeEvent } = useActiveEvent();

  // Get class names for fundraising totals
  const classNames = useMemo(() => 
    [...new Set(children.map(c => c.class_name).filter(Boolean))] as string[],
    [children]
  );
  const { data: classFundraisingTotals } = useMultipleClassFundraisingTotals(classNames, activeEvent?.id);

  // Get milestone settings from event
  const milestoneGoal = (activeEvent as any)?.class_milestone_goal || 1000;
  const milestoneReward = (activeEvent as any)?.class_milestone_reward || null;
  const milestoneEnabled = (activeEvent as any)?.class_milestone_enabled !== false;

  // Build recent activity from real reading logs
  const recentActivity = useMemo(() => {
    if (!logsByChild || !children.length) return [];

    // Create a map of child id to name
    const childNameMap = new Map(children.map(c => [c.id, c.name]));

    // Flatten all logs, add child name, sort by date
    const allLogs = Object.entries(logsByChild).flatMap(([childId, logs]) =>
      logs.map(log => ({
        id: log.id,
        childName: childNameMap.get(childId) || log.student_name,
        minutes: log.minutes,
        date: formatLogDate(log.logged_at),
        bookTitle: log.book_title,
        loggedAt: log.logged_at,
      }))
    );

    // Sort by logged_at descending and take top 5
    return allLogs
      .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime())
      .slice(0, 5);
  }, [logsByChild, children]);

  // Redirect sponsor-only users to /sponsor/dashboard
  useEffect(() => {
    if (!childrenLoading && !sponsorPledgesLoading && isSponsorOnly) {
      navigate("/sponsor/dashboard", { replace: true });
    }
  }, [childrenLoading, sponsorPledgesLoading, isSponsorOnly, navigate]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get display name from profile or metadata
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", user.id)
          .maybeSingle();
        
        setUserName(profile?.display_name || user.email?.split("@")[0] || "Reader");
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeletePledge = (pledgeId: string) => {
    deletePledge.mutate(pledgeId);
  };

  // Calculate total minutes from real children data
  const totalMinutes = children.reduce((sum, child) => sum + child.total_minutes, 0);

  // Transform children data for ChildProgressCard with real stats
  const transformedChildren = useMemo(() => {
    return children.map((child) => {
      const childLogs = logsByChild?.[child.id] || [];
      const totals = classGradeTotals?.[child.id] || { classTotal: 0, gradeTotal: 0 };
      const classFunded = child.class_name ? (classFundraisingTotals?.[child.class_name] || 0) : 0;
      
      return {
        id: child.id,
        name: child.name,
        avatarInitials: child.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
        minutesRead: child.total_minutes,
        goalMinutes: child.goal_minutes,
        gradeInfo: child.grade_info || "Not specified",
        className: child.class_name || "Not specified",
        classMinutesRead: totals.classTotal,
        gradeMinutesRead: totals.gradeTotal,
        minutesToday: calculateMinutesToday(childLogs),
        longestStreak: calculateLongestStreak(childLogs),
        classFundraisingTotal: classFunded,
      };
    });
  }, [children, logsByChild, classGradeTotals, classFundraisingTotals]);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      {/* Main Content */}
      <main className="flex-1 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1 space-y-8">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
                      <span className="font-handwritten text-4xl text-primary">
                        {isSponsorOnly ? "Thank you," : "Welcome,"}
                      </span>{" "}
                      {userName || (isSponsorOnly ? "Sponsor" : "Reader")}!
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                      {isSponsorOnly 
                        ? "Here's how the readers you're supporting are doing" 
                        : "Here's how your readers are doing this week"
                      }
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    style={handDrawnBorder}
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </div>

              {/* Children Overview (Parent View) */}
              {!isSponsorOnly && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground">
                      Your Readers
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Link to="/children">
                        Manage Children
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>

                  {childrenLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="bg-background p-6 shadow-md" style={handDrawnBorder}>
                          <Skeleton className="h-40 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : transformedChildren.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {transformedChildren.map((child) => (
                        <ChildProgressCard 
                          key={child.id} 
                          child={child} 
                          milestoneGoal={milestoneGoal}
                          milestoneReward={milestoneEnabled ? milestoneReward : null}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-background p-6 shadow-md text-center" style={handDrawnBorder}>
                      <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No children added yet</p>
                      <Button asChild>
                        <Link to="/onboarding/add-child">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Reader
                        </Link>
                      </Button>
                    </div>
                  )}
                </section>
              )}

              {/* Combined Sponsor Overview - Responsive Layout */}
              {isSponsorOnly && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground">
                      Your Sponsorships
                    </h2>
                  </div>

                  {sponsorPledgesLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="bg-background p-6 shadow-md" style={handDrawnBorder}>
                          <Skeleton className="h-40 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : (sponsorPledgesByChild.length > 0 || sponsorPledgesByClass.length > 0) ? (
                    <>
                      {/* Layout based on content - prioritize compact layouts */}
                      {(() => {
                        const childCount = sponsorPledgesByChild.length;
                        const classCount = sponsorPledgesByClass.length;
                        
                        // Single child (with or without classes) - show child prominently
                        if (childCount === 1) {
                          return (
                            <div className="space-y-6">
                              {/* Single child - horizontal full-width layout */}
                              {sponsorPledgesByChild.map((item) => (
                                <SponsoredChildCard 
                                  key={item.childId} 
                                  childId={item.childId}
                                  childName={item.childName}
                                  child={item.child}
                                  pledges={item.pledges}
                                  totalAmount={item.totalAmount}
                                  books={item.books}
                                  horizontal
                                />
                              ))}
                              
                              {/* Classes below - centered with max-width constraints */}
                              {classCount > 0 && (
                                <div className="flex justify-center">
                                  <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
                                    {sponsorPledgesByClass.map((item) => (
                                      <div key={item.className} className="w-full sm:w-[calc(50%-0.5rem)] max-w-xs">
                                        <SponsoredClassCard 
                                          className={item.className}
                                          teacher={item.teacher}
                                          pledges={item.pledges}
                                          totalAmount={item.totalAmount}
                                          compact
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        // Only classes (no children) - single class horizontal, multiple in grid
                        if (childCount === 0 && classCount === 1) {
                          return (
                            <div className="space-y-6">
                              {sponsorPledgesByClass.map((item) => (
                                <SponsoredClassCard 
                                  key={item.className} 
                                  className={item.className}
                                  teacher={item.teacher}
                                  pledges={item.pledges}
                                  totalAmount={item.totalAmount}
                                  horizontal
                                />
                              ))}
                            </div>
                          );
                        }
                        
                        if (childCount === 0 && classCount > 1) {
                          return (
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                              {sponsorPledgesByClass.map((item) => (
                                <SponsoredClassCard 
                                  key={item.className} 
                                  className={item.className}
                                  teacher={item.teacher}
                                  pledges={item.pledges}
                                  totalAmount={item.totalAmount}
                                />
                              ))}
                            </div>
                          );
                        }
                        
                        // 2 children - side by side
                        if (childCount === 2) {
                          return (
                            <div className="space-y-6">
                              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                {sponsorPledgesByChild.map((item) => (
                                  <SponsoredChildCard 
                                    key={item.childId} 
                                    childId={item.childId}
                                    childName={item.childName}
                                    child={item.child}
                                    pledges={item.pledges}
                                    totalAmount={item.totalAmount}
                                    books={item.books}
                                  />
                                ))}
                              </div>
                              {classCount > 0 && (
                                <div className="flex justify-center">
                                  <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
                                    {sponsorPledgesByClass.map((item) => (
                                      <div key={item.className} className="w-full sm:w-[calc(50%-0.5rem)] max-w-xs">
                                        <SponsoredClassCard 
                                          className={item.className}
                                          teacher={item.teacher}
                                          pledges={item.pledges}
                                          totalAmount={item.totalAmount}
                                          compact
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        // Many children (3+) - grid layout for all
                        return (
                          <div className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                              {sponsorPledgesByChild.map((item) => (
                                <SponsoredChildCard 
                                  key={item.childId} 
                                  childId={item.childId}
                                  childName={item.childName}
                                  child={item.child}
                                  pledges={item.pledges}
                                  totalAmount={item.totalAmount}
                                  books={item.books}
                                />
                              ))}
                            </div>
                            {classCount > 0 && (
                              <div className="flex justify-center">
                                <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
                                  {sponsorPledgesByClass.map((item) => (
                                    <div key={item.className} className="w-full sm:w-[calc(50%-0.5rem)] max-w-xs">
                                      <SponsoredClassCard 
                                        className={item.className}
                                        teacher={item.teacher}
                                        pledges={item.pledges}
                                        totalAmount={item.totalAmount}
                                        compact
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="bg-background p-6 shadow-md text-center" style={handDrawnBorder}>
                      <Heart className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">You haven't sponsored any readers yet</p>
                      <Button asChild>
                        <Link to="/sponsor">
                          <Plus className="h-4 w-4 mr-2" />
                          Support a Reader
                        </Link>
                      </Button>
                    </div>
                  )}
                </section>
              )}

              {/* Recent Activity - Only for Parents */}
              {!isSponsorOnly && (
                <section>
                  <div 
                    className="bg-background p-6 shadow-md"
                    style={handDrawnBorder}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-xl md:text-2xl text-foreground">Recent Activity</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Link to="/reading-logs">
                          View all
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {logsLoading ? (
                        <>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 rounded-lg bg-muted/30 p-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                          ))}
                        </>
                      ) : recentActivity.length > 0 ? (
                        recentActivity.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
                          >
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm md:text-base">
                                {activity.childName} read for {activity.minutes} min
                              </p>
                              <p className="text-xs md:text-sm text-muted-foreground truncate">
                                {activity.bookTitle || "No book specified"} •{" "}
                                {activity.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 font-serif text-lg text-primary">
                              {activity.minutes}m
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">No reading logged yet</p>
                          <Button asChild size="sm" variant="link" className="mt-1">
                            <Link to="/log-reading">Log your first session</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Pledges & Sponsors Section */}
              <PledgesSection
                pledgesByChild={pledgesByChild}
                totalPledges={totalPledges}
                isLoading={pledgesLoading}
                onDeletePledge={handleDeletePledge}
              />
            </div>

            {/* Quick Actions Sidebar (Desktop) */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24 space-y-4">
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="space-y-3">
                    <h3 className="font-serif text-xl text-foreground mb-4">
                      Quick Actions
                    </h3>
                    
                    {/* Sponsor-only actions */}
                    {isSponsorOnly ? (
                      <>
                        <Button 
                          className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" 
                          asChild
                        >
                          <Link to="/sponsor">
                            <Heart className="h-4 w-4 mr-2" />
                            Make a Pledge
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to="/my-pledges">
                            <DollarSign className="h-4 w-4 mr-2" />
                            My Pledges
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to="/sponsor/pay">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Make a Payment
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* Parent actions */}
                        <Button 
                          className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" 
                          asChild
                        >
                          <Link to="/log-reading">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Reading Log
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to="/invite">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite Sponsor
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to="/my-pledges">
                            <DollarSign className="h-4 w-4 mr-2" />
                            My Pledges
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to="/family/sponsor-my-child">
                            <Heart className="h-4 w-4 mr-2" />
                            Make a Pledge
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to="/onboarding/add-child" state={{ from: "dashboard" }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add a Child
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start relative"
                          asChild
                        >
                          <Link to="/family/sponsor-requests">
                            <Bell className="h-4 w-4 mr-2" />
                            Sponsor Requests
                            {mockPendingSponsorRequests > 0 && (
                              <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {mockPendingSponsorRequests}
                              </Badge>
                            )}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Summary */}
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <h3 className="font-serif text-xl text-foreground mb-4">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center rounded-lg bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground">Total Minutes</span>
                      <span className="font-serif text-2xl text-primary">
                        {totalMinutes.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative flex flex-col items-center rounded-lg bg-muted/30 p-3">
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-accent text-accent" />
                      <span className="text-xs text-muted-foreground">
                        {isSponsorOnly ? "Children" : "Sponsors"}
                      </span>
                      <span className="font-serif text-2xl text-primary">
                        {isSponsorOnly ? sponsorStats.childrenSupported : pledgesByChild.reduce((sum, c) => sum + c.sponsorCount, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Spacer for Bottom Tab Bar */}
        <div className="h-20 md:hidden" />
      </main>
      
      <Footer />
      
      {/* Bottom Tab Bar for Mobile */}
      <BottomTabBar role="parent" />
    </div>
  );
};

// Sponsored Child Card Component (Limited view for sponsors)
import { SponsorPledge, SponsorClassPledge, ChildBook } from "@/hooks/useSponsorPledges";

interface SponsoredChildCardProps {
  childId: string;
  childName: string;
  child: {
    id: string;
    name: string;
    total_minutes: number;
    goal_minutes: number;
    grade_info: string | null;
  } | null;
  pledges: SponsorPledge[];
  totalAmount: number;
  books?: ChildBook[];
  compact?: boolean;
  horizontal?: boolean;
}

const SponsoredChildCard = ({ childId, childName, child, pledges, totalAmount, books = [], compact = false, horizontal = false }: SponsoredChildCardProps) => {
  const totalMinutes = child?.total_minutes || 0;
  const goalMinutes = child?.goal_minutes || 300;
  const gradeInfo = child?.grade_info || "Student";
  const progress = Math.round((totalMinutes / goalMinutes) * 100);
  
  // Calculate total owed based on pledge type
  const calculateOwed = () => {
    return pledges.reduce((sum, pledge) => {
      if (pledge.pledge_type === "per_minute") {
        return sum + (pledge.amount * totalMinutes);
      }
      return sum + pledge.amount;
    }, 0);
  };
  
  const totalOwed = calculateOwed();
  const hasPendingPayment = pledges.some(p => !p.is_paid);
  
  // Horizontal layout for single sponsorship - uses flex-wrap to reflow on narrow widths
  // Horizontal layout for single sponsorship - featured design
  if (horizontal) {
    return (
      <div 
        className="bg-background shadow-md overflow-hidden"
        style={handDrawnBorder}
      >
        {/* Two-column layout on desktop, stacked on mobile */}
        <div className="flex flex-col sm:flex-row">
          {/* Left side - Hero section with ring */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 sm:w-2/5">
            <ReadingGoalRing progress={totalMinutes} goal={goalMinutes} size={100} />
            <div className="mt-3 text-center">
              <p className="font-serif text-2xl font-medium text-foreground">
                {totalMinutes.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                of {goalMinutes.toLocaleString()} minutes
              </p>
            </div>
          </div>
          
          {/* Right side - Details */}
          <div className="flex-1 p-5 flex flex-col">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h2 className="font-serif text-xl font-normal tracking-tight text-foreground">
                  {childName}
                </h2>
                <Badge variant={hasPendingPayment ? "secondary" : "default"} className="shrink-0">
                  {hasPendingPayment ? "Pledged" : "Paid"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{gradeInfo}</p>
            </div>
            
            {/* Pledge stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-accent/10 p-3 border border-accent/20 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Your Pledge</p>
                <p className="font-serif text-xl text-accent">${totalOwed.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Pledge Type</p>
                <p className="font-serif text-xl text-foreground">
                  {pledges[0]?.pledge_type === "per_minute" ? "Per Min" : "Flat"}
                </p>
              </div>
            </div>
            
            {/* Books Read */}
            {books.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
                  <BookOpen className="inline h-3 w-3 mr-1" />
                  Books Read ({books.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {books.slice(0, 5).map((book) => (
                    <div 
                      key={book.id}
                      className="group relative"
                      title={`${book.title}${book.author ? ` by ${book.author}` : ''}`}
                    >
                      {book.cover_url ? (
                        <img 
                          src={book.cover_url} 
                          alt={book.title}
                          className="h-10 w-7 object-cover rounded shadow-sm border border-border"
                        />
                      ) : (
                        <div className="h-10 w-7 bg-muted rounded shadow-sm border border-border flex items-center justify-center">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {books.length > 5 && (
                    <div className="h-10 w-7 bg-muted/50 rounded shadow-sm border border-border flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground font-medium">+{books.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Thank you */}
            <div className="rounded-lg bg-primary/5 p-2.5 border border-primary/10 mt-auto">
              <p className="text-xs text-center text-muted-foreground">
                <Heart className="inline h-3 w-3 text-primary mr-1" />
                Thank you for supporting {childName.split(" ")[0]}'s reading journey!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default vertical layout
  return (
    <div 
      className="bg-background p-6 shadow-md"
      style={handDrawnBorder}
    >
      <div className="flex flex-col items-center gap-4" style={{ paddingTop: 15 }}>
        <div className="w-full flex items-center justify-between">
          <h2 className="font-serif text-xl md:text-2xl font-normal tracking-tight text-foreground">
            {childName.split(" ")[0]}'s Progress
          </h2>
          <Badge variant={hasPendingPayment ? "secondary" : "default"} className="shrink-0">
            {hasPendingPayment ? "Pledged" : "Paid"}
          </Badge>
        </div>
        
        {/* Reading Ring */}
        <div className="flex items-center justify-center w-full">
          <ReadingGoalRing progress={totalMinutes} goal={goalMinutes} size={100} />
        </div>
        
        {/* Progress Stats */}
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-lg bg-muted/30 p-3">
            <span className="text-xs text-muted-foreground">Minutes Read</span>
            <span className="font-serif text-xl text-primary">{totalMinutes.toLocaleString()}</span>
          </div>
          <div className="relative flex flex-col items-center rounded-lg bg-muted/30 p-3">
            <Star className="absolute -right-1 -top-1 h-4 w-4 fill-accent text-accent" />
            <span className="text-xs text-muted-foreground">Goal Progress</span>
            <span className="font-serif text-xl text-primary">{Math.min(progress, 100)}%</span>
          </div>
        </div>
        
        {/* Pledge Info */}
        <div className="w-full space-y-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">{gradeInfo}</p>
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="flex flex-col items-center rounded-lg bg-accent/10 p-2 border border-accent/20">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Your Pledge</span>
              <span className="font-serif text-lg text-accent">${totalOwed.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-secondary/30 p-2 border border-secondary/40">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Pledge Type</span>
              <span className="font-serif text-lg text-secondary-foreground">
                {pledges[0]?.pledge_type === "per_minute" ? "Per Min" : "Flat"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Books Read */}
        {books.length > 0 && (
          <div className="w-full pt-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2 text-center">
              <BookOpen className="inline h-3 w-3 mr-1" />
              Books Read ({books.length})
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {books.slice(0, 4).map((book) => (
                <div 
                  key={book.id}
                  className="group relative"
                  title={`${book.title}${book.author ? ` by ${book.author}` : ''}`}
                >
                  {book.cover_url ? (
                    <img 
                      src={book.cover_url} 
                      alt={book.title}
                      className="h-10 w-7 object-cover rounded shadow-sm border border-border"
                    />
                  ) : (
                    <div className="h-10 w-7 bg-muted rounded shadow-sm border border-border flex items-center justify-center">
                      <BookOpen className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {books.length > 4 && (
                <div className="h-10 w-7 bg-muted/50 rounded shadow-sm border border-border flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground font-medium">+{books.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Thank You Message */}
        <div className="w-full rounded-lg bg-primary/5 p-3 border border-primary/10">
          <p className="text-xs text-center text-muted-foreground">
            <Heart className="inline h-3 w-3 text-primary mr-1" />
            Thank you for supporting {childName.split(" ")[0]}'s reading journey!
          </p>
        </div>
      </div>
    </div>
  );
}

// Sponsored Class Card Component
interface SponsoredClassCardProps {
  className: string;
  teacher: { id: string; name: string } | null;
  pledges: SponsorClassPledge[];
  totalAmount: number;
  compact?: boolean;
  horizontal?: boolean;
}

const SponsoredClassCard = ({ className, teacher, pledges, totalAmount, compact = false, horizontal = false }: SponsoredClassCardProps) => {
  const hasPendingPayment = pledges.some(p => !p.is_paid);
  const latestPledge = pledges[0];
  const isUnlocked = latestPledge?.is_unlocked;
  
  return (
    <div 
      className="bg-background p-6 shadow-md"
      style={handDrawnBorder}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-normal tracking-tight text-foreground">
            {teacher?.name ? `${teacher.name}'s Class` : className}
          </h2>
          <Badge variant={isUnlocked ? "default" : "secondary"} className="shrink-0">
            {isUnlocked ? "Unlocked" : "Pending"}
          </Badge>
        </div>
        
        {/* Class Fundraising Progress */}
        <div className="flex items-center justify-center py-4">
          <ClassFundraisingShelf
            fundedAmount={totalAmount}
            goalAmount={latestPledge?.milestone_minutes_target || 1000}
          />
        </div>
        
        {/* Pledge Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-lg bg-accent/10 p-2 border border-accent/20">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Your Pledge</span>
            <span className="font-serif text-lg text-accent">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-secondary/30 p-2 border border-secondary/40">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Type</span>
            <span className="font-serif text-lg text-secondary-foreground">
              {latestPledge?.pledge_type === "milestone" ? "Milestone" : "Flat"}
            </span>
          </div>
        </div>
        
        {/* Status */}
        <div className="w-full rounded-lg bg-primary/5 p-3 border border-primary/10">
          <p className="text-xs text-center text-muted-foreground">
            <Heart className="inline h-3 w-3 text-primary mr-1" />
            {isUnlocked 
              ? `Milestone reached! Your $${totalAmount.toFixed(0)} pledge is active.`
              : `Waiting for class to reach milestone.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

// Child Progress Card Component
interface ChildProgressCardProps {
  child: {
    id: string;
    name: string;
    avatarInitials: string;
    minutesRead: number;
    goalMinutes: number;
    gradeInfo: string;
    className: string;
    classMinutesRead: number;
    gradeMinutesRead: number;
    minutesToday: number;
    longestStreak: number;
    classFundraisingTotal: number;
  };
  milestoneGoal: number;
  milestoneReward: string | null;
}

const ChildProgressCard = ({ child, milestoneGoal, milestoneReward }: ChildProgressCardProps) => {
  return (
    <div 
      className="bg-background p-6 shadow-md"
      style={handDrawnBorder}
    >
      <div className="flex flex-col items-center gap-4" style={{ paddingTop: 15 }}>
        <h2 className="w-full text-left font-serif text-xl md:text-2xl font-normal tracking-tight text-foreground bg-transparent pb-0" style={{ marginBottom: -20 }}>
          {child.name.split(" ")[0]}'s Reading
        </h2>
        
        <div style={{ height: 15 }} />
        
        {/* Reading Ring */}
        <div className="flex items-center justify-center w-full">
          <ReadingGoalRing progress={child.minutesRead} goal={child.goalMinutes} size={100} />
        </div>
        
        {/* Personal Stats Grid */}
        <div className="mt-2 grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-lg bg-muted/30 p-3">
            <span className="text-xs text-muted-foreground">Reading Goal</span>
            <span className="font-serif text-xl text-primary">{child.goalMinutes} min</span>
          </div>
          <div className="relative flex flex-col items-center rounded-lg bg-muted/30 p-3">
            <Star className="absolute -right-1 -top-1 h-4 w-4 fill-accent text-accent" />
            <span className="text-xs text-muted-foreground">Minutes Read</span>
            <span className="font-serif text-xl text-primary">{child.minutesRead} min</span>
          </div>
        </div>

        {/* Today & Streak Stats */}
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-lg bg-accent/10 p-3 border border-accent/20">
            <span className="text-xs text-muted-foreground">Read Today</span>
            <span className="font-serif text-xl text-accent">{child.minutesToday} min</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-secondary/30 p-3 border border-secondary/40">
            <span className="text-xs text-muted-foreground">Longest Stretch</span>
            <span className="font-serif text-xl text-secondary-foreground">{child.longestStreak} min</span>
          </div>
        </div>

        {/* Class & Grade Stats */}
        <div className="w-full space-y-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">{child.className} • {child.gradeInfo}</p>
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="flex flex-col items-center rounded-lg bg-muted/20 p-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Class Total</span>
              <span className="font-serif text-lg text-foreground">{child.classMinutesRead.toLocaleString()} min</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-muted/20 p-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Grade Total</span>
              <span className="font-serif text-lg text-foreground">{child.gradeMinutesRead.toLocaleString()} min</span>
            </div>
          </div>
        </div>

        {/* Class Goal Progress - Horizontal Book Shelf */}
        {child.className !== "Not specified" && milestoneReward && (
          <div className="w-full pt-2">
            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Star className="h-3 w-3 text-accent fill-accent" />
              Class Pledge Goal
            </p>
            <ClassFundraisingShelf
              fundedAmount={child.classFundraisingTotal}
              goalAmount={milestoneGoal}
              rewardLabel={milestoneReward}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            asChild
          >
            <Link to={`/children/${child.id}`} state={{ from: "dashboard" }}>
              Details
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" 
            asChild
          >
            <Link to={`/log-reading?child=${child.id}`}>
              <BookOpen className="h-4 w-4 mr-1" />
              Log
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
