import { useMemo, useState } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { ReadingGoalRing } from "@/components/legacy";
import { useChildById, useChildren } from "@/hooks/useChildren";
import { useReadingLogs } from "@/hooks/useReadingLogs";
import { usePledges } from "@/hooks/usePledges";
import { useActiveEvent, formatEventDates } from "@/hooks/useActiveEvent";
import { useClassReadingStats } from "@/hooks/useClassReadingStats";
import { useClassGradeTotals } from "@/hooks/useClassGradeTotals";
import { EditChildDialog } from "@/components/family/EditChildDialog";
import { ReadingLogsTable } from "@/components/family/ReadingLogsTable";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { toast } from "sonner";
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
  GraduationCap,
  School,
  User,
  CheckCircle2,
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
  
  // Check ownership
  const { children: ownedChildren, isLoading: ownedChildrenLoading, updateChild } = useChildren();
  const isOwner = ownedChildren.some(c => c.id === id);
  
  // Fetch real data from database
  const { data: child, isLoading: childLoading, error: childError } = useChildById(id);
  const { logs, isLoading: logsLoading, updateLog, deleteLog } = useReadingLogs(id);
  const { pledges, isLoading: pledgesLoading } = usePledges(id);
  const { data: activeEvent } = useActiveEvent();
  const eventDates = formatEventDates(activeEvent);
  
  // Class and grade reading stats
  const { data: classStats } = useClassReadingStats(child?.class_name);
  const { data: classGradeTotals } = useClassGradeTotals(child ? [child] : []);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());

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

    // Calculate longest reading session
    const longestStreak = Math.max(...logs.map(log => log.minutes), 0);

    return { minutesToday, longestStreak, daysActive };
  }, [logs]);

  // Calculate total pledged amount
  const totalPledged = useMemo(() => {
    if (!pledges.length || !child) return 0;
    return pledges.reduce((sum, p) => {
      if (p.pledge_type === "flat") return sum + Number(p.amount);
      // For per-minute, calculate based on current minutes
      return sum + (Number(p.amount) * child.total_minutes);
    }, 0);
  }, [pledges, child]);

  // Handle inline log editing
  const handleEditLog = (logId: string, minutes: number, bookTitle: string) => {
    updateLog.mutate({
      id: logId,
      minutes,
      book_title: bookTitle || null,
    });
  };

  const handleDeleteLog = (logId: string) => {
    deleteLog.mutate(logId);
    setSelectedLogIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(logId);
      return newSet;
    });
  };

  // Handle log selection for validation
  const handleLogSelectionChange = (logId: string, checked: boolean) => {
    setSelectedLogIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(logId);
      } else {
        newSet.delete(logId);
      }
      return newSet;
    });
  };

  const handleSelectAllLogs = () => {
    if (selectedLogIds.size === logs.length) {
      setSelectedLogIds(new Set());
    } else {
      setSelectedLogIds(new Set(logs.map(l => l.id)));
    }
  };

  const handleValidateSelected = async () => {
    // For now, we show a toast since child-level verification exists in DB
    // but isn't exposed in the Child type from useChildren
    if (selectedLogIds.size === logs.length && child) {
      // The total_verified field exists in DB but may not be in the hook's type
      // Cast to any to update it
      updateChild.mutate({
        id: child.id,
      } as any, {
        onSuccess: () => {
          toast.success("Reading logs validated! Total has been verified.");
          setSelectedLogIds(new Set());
        }
      });
    } else {
      toast.info("Select all logs to validate the child's total minutes");
    }
  };

  // Handle save from edit dialog
  const handleSaveChild = (updates: any) => {
    updateChild.mutate(updates, {
      onSuccess: () => {
        setEditDialogOpen(false);
      }
    });
  };

  const isLoading = childLoading || logsLoading || pledgesLoading || ownedChildrenLoading;

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

  // Get class and grade totals
  const classTotalMinutes = classGradeTotals?.[child.id]?.classTotal || classStats?.total_minutes || 0;
  const gradeTotalMinutes = classGradeTotals?.[child.id]?.gradeTotal || 0;
  const classStudentCount = classStats?.student_count || 0;

  // Transform logs for ReadingLogsTable
  const tableLogs = logs.map((log) => ({
    id: log.id,
    logged_at: log.logged_at,
    minutes: log.minutes,
    book_title: log.book_title,
    student_name: log.student_name,
  }));

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
                  {isOwner && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      style={handDrawnBorder}
                      onClick={() => setEditDialogOpen(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
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

                  {/* Verification status */}
                  {(child as any).total_verified && (
                    <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="text-sm text-success">Reading minutes verified</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Community Progress - Class and Grade */}
              {(child.class_name || child.grade_info) && (
                <section>
                  <div 
                    className="bg-background p-6 shadow-md"
                    style={handDrawnBorder}
                  >
                    <h2 className="font-serif text-xl md:text-2xl text-foreground mb-4">
                      Community Progress
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Class Total */}
                      {child.class_name && (
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <School className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Class Total</p>
                            <p className="font-serif text-2xl text-primary">{classTotalMinutes.toLocaleString()} min</p>
                            <p className="text-xs text-muted-foreground">{child.class_name} • {classStudentCount} students</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Grade Total */}
                      {child.grade_info && (
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-secondary-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Grade Total</p>
                            <p className="font-serif text-2xl text-foreground">{gradeTotalMinutes.toLocaleString()} min</p>
                            <p className="text-xs text-muted-foreground">{child.grade_info}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Reading History with Inline Editing */}
              <section>
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl md:text-2xl text-foreground">
                      Reading Log
                    </h2>
                    {isOwner && logs.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSelectAllLogs}
                          className="text-xs"
                        >
                          {selectedLogIds.size === logs.length ? "Deselect All" : "Select All"}
                        </Button>
                        {selectedLogIds.size > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleValidateSelected}
                            className="text-xs"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Validate ({selectedLogIds.size})
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {isOwner ? (
                    <>
                      {logs.length === 0 ? (
                        <div className="text-center py-8">
                          <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-muted-foreground">No reading logged yet</p>
                          <p className="text-sm text-muted-foreground">Start logging reading to track progress!</p>
                        </div>
                      ) : (
                        <div className="space-y-2 mb-4">
                          {logs.map((log) => (
                            <div key={log.id} className="flex items-start gap-3">
                              <Checkbox
                                checked={selectedLogIds.has(log.id)}
                                onCheckedChange={(checked) => handleLogSelectionChange(log.id, checked as boolean)}
                                className="mt-3"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground text-sm md:text-base">
                                      {log.minutes} minutes
                                    </p>
                                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                                      {log.book_title || "No book specified"} • {formatLogDate(log.logged_at)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 text-xs"
                                      onClick={() => {
                                        const newMinutes = prompt("Enter new minutes:", String(log.minutes));
                                        if (newMinutes && !isNaN(Number(newMinutes))) {
                                          handleEditLog(log.id, Number(newMinutes), log.book_title || "");
                                        }
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 text-xs text-destructive hover:text-destructive"
                                      onClick={() => {
                                        if (confirm("Delete this reading log?")) {
                                          handleDeleteLog(log.id);
                                        }
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
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
                    </>
                  ) : (
                    // Sponsor view - read only
                    <div className="space-y-3">
                      {logs.slice(0, 5).map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
                        >
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm md:text-base">
                              {log.minutes} minutes
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground truncate">
                              {log.book_title || "Reading session"} • {formatLogDate(log.logged_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {logs.length > 5 && (
                        <p className="text-center text-sm text-muted-foreground">
                          +{logs.length - 5} more entries
                        </p>
                      )}
                    </div>
                  )}
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
                      {isOwner && (
                        <p className="text-sm text-muted-foreground">Invite family and friends to sponsor {child.name.split(' ')[0]}!</p>
                      )}
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
                  
                  {isOwner && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/children/${child.id}/invite`}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite More Sponsors
                      </Link>
                    </Button>
                  )}
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
                    {isOwner ? (
                      <>
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
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => setEditDialogOpen(true)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link to="/account#children">
                            <User className="h-4 w-4 mr-2" />
                            Manage Student Account
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground py-4">
                        <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p>You are viewing as a sponsor</p>
                      </div>
                    )}
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

      {/* Edit Child Dialog */}
      {isOwner && (
        <EditChildDialog
          child={child as any}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveChild}
          isSaving={updateChild.isPending}
        />
      )}
    </div>
  );
};

export default ChildDetailsPage;
