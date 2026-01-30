import { useMemo } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ReadingGoalRing } from "@/components/legacy";
import { useChildById } from "@/hooks/useChildren";
import { useReadingLogs } from "@/hooks/useReadingLogs";
import { usePledges } from "@/hooks/usePledges";
import { useActiveEvent, formatEventDates } from "@/hooks/useActiveEvent";
import { format, isToday, isYesterday, differenceInDays, parseISO } from "date-fns";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Settings,
  UserPlus,
  Calendar,
  Star,
  Users,
  DollarSign,
  ChevronRight,
  Clock,
  Flame,
} from "lucide-react";

// Hand-drawn border style (consistent with other pages)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

const ChildDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const cameFromDashboard = (location.state as { from?: string })?.from === "dashboard";
  
  // Fetch real data from database
  const { data: child, isLoading: childLoading, error: childError } = useChildById(id);
  const { logs, isLoading: logsLoading } = useReadingLogs(id);
  const { pledges, isLoading: pledgesLoading } = usePledges(id);
  const { data: activeEvent } = useActiveEvent();
  const eventDates = formatEventDates(activeEvent);

  // Format reading log date for display
  const formatLogDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  // Calculate stats from logs
  const stats = useMemo(() => {
    if (!logs.length) {
      return { minutesToday: 0, longestStreak: 0, daysActive: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Minutes read today
    const minutesToday = logs
      .filter(log => isToday(parseISO(log.logged_at)))
      .reduce((sum, log) => sum + log.minutes, 0);

    // Days active (unique dates with logs)
    const uniqueDates = new Set(logs.map(log => log.logged_at));
    const daysActive = uniqueDates.size;

    // Calculate longest reading session (or streak logic could be more complex)
    const longestStreak = Math.max(...logs.map(log => log.minutes), 0);

    return { minutesToday, longestStreak, daysActive };
  }, [logs]);

  // Recent reading logs (last 5)
  const recentLogs = logs.slice(0, 5);

  // Calculate total pledged amount
  const totalPledged = useMemo(() => {
    if (!pledges.length || !child) return 0;
    return pledges.reduce((sum, p) => {
      if (p.pledge_type === "flat") return sum + Number(p.amount);
      // For per-minute, calculate based on current minutes
      return sum + (Number(p.amount) * child.total_minutes);
    }, 0);
  }, [pledges, child]);

  const isLoading = childLoading || logsLoading || pledgesLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm">
          <div className="container py-8">
            <div className="space-y-6">
              <Skeleton className="h-16 w-64" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (childError || !child) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl text-foreground mb-4">Child not found</h1>
            <Button asChild>
              <Link to="/children">Back to Children</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const avatarInitials = child.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={cameFromDashboard ? "/dashboard" : "/children"}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      {cameFromDashboard ? "Back to Dashboard" : "Back to Children"}
                    </Link>
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center font-serif text-2xl text-primary">
                      {avatarInitials}
                    </div>
                    <div>
                      <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
                        {child.name}
                      </h1>
                      <p className="text-muted-foreground text-sm md:text-base">
                        {child.grade_info && `${child.grade_info}`}
                        {child.grade_info && child.class_name && " • "}
                        {child.class_name}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild style={handDrawnBorder}>
                    <Link to={`/family/children/${child.id}/settings`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Progress Overview */}
              <section>
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <h2 className="font-serif text-xl md:text-2xl text-foreground mb-6">
                    Reading Progress
                  </h2>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex justify-center">
                      <ReadingGoalRing progress={child.total_minutes} goal={child.goal_minutes} size={140} />
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center rounded-lg bg-accent/10 p-4 border border-accent/20">
                        <Clock className="h-5 w-5 text-accent mb-1" />
                        <span className="text-xs text-muted-foreground">Read Today</span>
                        <span className="font-serif text-2xl text-accent">{stats.minutesToday} min</span>
                      </div>
                      <div className="relative flex flex-col items-center rounded-lg bg-muted/30 p-4">
                        <Star className="absolute -right-1 -top-1 h-4 w-4 fill-accent text-accent" />
                        <Flame className="h-5 w-5 text-primary mb-1" />
                        <span className="text-xs text-muted-foreground">Best Session</span>
                        <span className="font-serif text-2xl text-primary">{stats.longestStreak} min</span>
                      </div>
                      <div className="flex flex-col items-center rounded-lg bg-muted/30 p-4">
                        <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Days Active</span>
                        <span className="font-serif text-2xl text-foreground">{stats.daysActive}</span>
                      </div>
                      <div className="flex flex-col items-center rounded-lg bg-muted/30 p-4">
                        <BookOpen className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Goal</span>
                        <span className="font-serif text-2xl text-foreground">{child.goal_minutes} min</span>
                      </div>
                    </div>
                  </div>

                  {eventDates.daysRemaining > 0 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {eventDates.daysRemaining} days left in the read-a-thon
                    </p>
                  )}
                </div>
              </section>

              {/* Reading History */}
              <section>
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl md:text-2xl text-foreground">
                      Reading Log
                    </h2>
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                      <Link to="/reading-logs/approve">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  
                  {recentLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No reading logged yet</p>
                      <p className="text-sm text-muted-foreground">Start logging reading to track progress!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {recentLogs.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
                        >
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm md:text-base">
                              {entry.minutes} minutes
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground truncate">
                              {entry.book_title || "No book specified"} • {formatLogDate(entry.logged_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 font-serif text-lg text-primary">
                            {entry.minutes}m
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button className="w-full" asChild>
                    <Link to={`/log-reading?child=${child.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Log Reading
                    </Link>
                  </Button>
                </div>
              </section>

              {/* Sponsors */}
              <section>
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl md:text-2xl text-foreground">
                      Sponsors
                      <Badge variant="secondary" className="ml-2">
                        {pledges.length}
                      </Badge>
                    </h2>
                  </div>
                  
                  {pledges.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No sponsors yet</p>
                      <p className="text-sm text-muted-foreground">Invite family and friends to sponsor {child.name.split(' ')[0]}!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {pledges.map((pledge) => (
                        <div
                          key={pledge.id}
                          className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
                        >
                          <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                            <Users className="h-5 w-5 text-secondary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm md:text-base">
                              Sponsor
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {pledge.pledge_type === "per_minute" 
                                ? `$${Number(pledge.amount).toFixed(2)}/min` 
                                : `$${Number(pledge.amount).toFixed(2)} flat`}
                            </p>
                          </div>
                          <Badge variant={pledge.is_paid ? "default" : "outline"}>
                            {pledge.is_paid ? "Paid" : "Pledged"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {pledges.length > 0 && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Pledged</p>
                        <p className="font-serif text-2xl text-primary">${totalPledged.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-primary/30" />
                    </div>
                  )}
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/children/${child.id}/invite`}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite More Sponsors
                    </Link>
                  </Button>
                </div>
              </section>
            </div>

            {/* Quick Actions Sidebar (Desktop) */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24 space-y-4">
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <h3 className="font-serif text-xl text-foreground mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" asChild>
                      <Link to={`/log-reading?child=${child.id}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Log Reading
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to={`/children/${child.id}/invite`}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Sponsors
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to={`/family/children/${child.id}/settings`}>
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Settings
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Stats Summary */}
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <h3 className="font-serif text-xl text-foreground mb-4">Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center rounded-lg bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground">Total Minutes</span>
                      <span className="font-serif text-2xl text-primary">{child.total_minutes}</span>
                    </div>
                    <div className="relative flex flex-col items-center rounded-lg bg-muted/30 p-3">
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-accent text-accent" />
                      <span className="text-xs text-muted-foreground">Sponsors</span>
                      <span className="font-serif text-2xl text-primary">{pledges.length}</span>
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
      <BottomTabBar role="parent" />
    </div>
  );
};

export default ChildDetailsPage;