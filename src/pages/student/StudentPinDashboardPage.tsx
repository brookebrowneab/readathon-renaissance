import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStudentSession } from "@/hooks/useStudentSession";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import booksShelfDividerV2 from "@/assets/books-shelf-divider-v2.png";
import { ClassFundraisingShelf } from "@/components/ui/class-fundraising-shelf";
import { useClassFundraisingTotal } from "@/hooks/useClassFundraising";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ReadingGoalRing } from "@/components/legacy";
import { BookSelector } from "@/components/books";
import { Book, useBooks } from "@/hooks/useBooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  BookOpen, 
  Clock, 
  LogOut, 
  Plus, 
  Minus,
  Trophy,
  Calendar,
  Sparkles,
  Library,
  ChevronRight,
  Users,
  GraduationCap,
  Star,
  Pencil,
  Trash2,
  CalendarDays,
  History
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, isToday, isYesterday, startOfWeek, endOfWeek, subYears, startOfYear, endOfYear } from "date-fns";

// Hand-drawn border style (consistent with parent dashboard)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

interface ReadingLog {
  id: string;
  minutes: number;
  book_title: string | null;
  logged_at: string;
  book_id: string | null;
  created_at: string;
}

interface BookInfo {
  id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
}

interface ChildInfo {
  total_verified: boolean;
}

// Helper to format date for display
const formatLogDate = (dateStr: string): string => {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
};

const StudentPinDashboardPage = () => {
  const { session, isLoading: sessionLoading, logout, refreshData, requireAuth } = useStudentSession();
  const { data: activeEvent } = useActiveEvent();
  const { books } = useBooks();
  
  // Fetch school-wide total minutes
  const { data: schoolTotalMinutes } = useQuery({
    queryKey: ['school-total-minutes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('total_minutes');
      
      if (error) throw error;
      return data?.reduce((sum, child) => sum + (child.total_minutes || 0), 0) || 0;
    },
  });

  // Fetch class total minutes
  const { data: classTotalMinutes } = useQuery({
    queryKey: ['class-total-minutes', session?.className],
    queryFn: async () => {
      if (!session?.className) return 0;
      const { data, error } = await supabase.rpc('get_class_total_minutes', {
        p_class_name: session.className,
      });
      if (error) throw error;
      return data || 0;
    },
    enabled: !!session?.className,
  });

  // Fetch grade total minutes
  const { data: gradeTotalMinutes } = useQuery({
    queryKey: ['grade-total-minutes', session?.gradeInfo],
    queryFn: async () => {
      if (!session?.gradeInfo) return 0;
      const { data, error } = await supabase.rpc('get_grade_total_minutes', {
        p_grade_info: session.gradeInfo,
      });
      if (error) throw error;
      return data || 0;
    },
    enabled: !!session?.gradeInfo,
  });

  // Fetch class favorite books
  const { data: classFavoriteBooks } = useQuery({
    queryKey: ['class-favorite-books', session?.className],
    queryFn: async () => {
      if (!session?.className) return [];
      const { data, error } = await supabase.rpc('get_class_favorite_books', {
        p_class_name: session.className,
        p_limit: 5,
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.className,
  });

  // Fetch grade favorite books
  const { data: gradeFavoriteBooks } = useQuery({
    queryKey: ['grade-favorite-books', session?.gradeInfo],
    queryFn: async () => {
      if (!session?.gradeInfo) return [];
      const { data, error } = await supabase.rpc('get_grade_favorite_books', {
        p_grade_info: session.gradeInfo,
        p_limit: 5,
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.gradeInfo,
  });

  // Fetch class fundraising total
  const { data: classFundraisingTotal } = useClassFundraisingTotal(
    session?.className,
    activeEvent?.id
  );

  // Fetch child verification status
  const { data: childInfo } = useQuery({
    queryKey: ['child-verification', session?.childId],
    queryFn: async () => {
      if (!session?.childId) return null;
      const { data, error } = await supabase
        .from('children')
        .select('total_verified')
        .eq('id', session.childId)
        .single();
      if (error) throw error;
      return data as ChildInfo;
    },
    enabled: !!session?.childId,
  });

  // Fetch weekly reading total
  const { data: weeklyMinutes } = useQuery({
    queryKey: ['weekly-minutes', session?.childId],
    queryFn: async () => {
      if (!session?.childId) return 0;
      const now = new Date();
      const weekStart = format(startOfWeek(now, { weekStartsOn: 0 }), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(now, { weekStartsOn: 0 }), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('reading_logs')
        .select('minutes')
        .eq('child_id', session.childId)
        .gte('logged_at', weekStart)
        .lte('logged_at', weekEnd);
      
      if (error) throw error;
      return data?.reduce((sum, log) => sum + (log.minutes || 0), 0) || 0;
    },
    enabled: !!session?.childId,
  });

  // Fetch last year's reading total
  const { data: lastYearMinutes } = useQuery({
    queryKey: ['last-year-minutes', session?.childId],
    queryFn: async () => {
      if (!session?.childId) return 0;
      const lastYear = subYears(new Date(), 1);
      const yearStart = format(startOfYear(lastYear), 'yyyy-MM-dd');
      const yearEnd = format(endOfYear(lastYear), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('reading_logs')
        .select('minutes')
        .eq('child_id', session.childId)
        .gte('logged_at', yearStart)
        .lte('logged_at', yearEnd);
      
      if (error) throw error;
      return data?.reduce((sum, log) => sum + (log.minutes || 0), 0) || 0;
    },
    enabled: !!session?.childId,
  });

  const queryClient = useQueryClient();
  
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLog, setEditingLog] = useState<ReadingLog | null>(null);
  const [editMinutes, setEditMinutes] = useState(0);
  const [editBookTitle, setEditBookTitle] = useState("");
  
  // Log reading form state
  const [minutes, setMinutes] = useState(15);
  const [bookTitle, setBookTitle] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  // Redirect if not authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Fetch reading logs with book info
  useEffect(() => {
    const fetchLogs = async () => {
      if (!session?.childId) return;

      const { data, error } = await supabase
        .from("reading_logs")
        .select("id, minutes, book_title, logged_at, book_id, created_at")
        .eq("child_id", session.childId)
        .order("logged_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching logs:", error);
      } else {
        setReadingLogs(data || []);
      }
      setIsLoadingLogs(false);
    };

    fetchLogs();
  }, [session?.childId]);

  const handleLogReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.childId || !activeEvent?.id) return;

    setIsSubmitting(true);

    // Use selected book's title if available, otherwise manual input
    const finalBookTitle = selectedBook?.title || bookTitle.trim() || null;

    const { data, error } = await supabase
      .from("reading_logs")
      .insert({
        child_id: session.childId,
        student_name: session.name,
        minutes,
        book_title: finalBookTitle,
        book_id: selectedBook?.id || null,
        event_id: activeEvent.id,
        logged_at: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      console.error("Error logging reading:", error);
      toast.error("Couldn't save your reading. Try again!");
    } else {
      toast.success(`Great job! You logged ${minutes} minutes! 🎉`);
      setReadingLogs((prev) => [data, ...prev]);
      setMinutes(15);
      setBookTitle("");
      setSelectedBook(null);
      setIsLogModalOpen(false);
      refreshData();
    }

    setIsSubmitting(false);
  };

  // Get book info for a log
  const getBookForLog = (log: ReadingLog): BookInfo | null => {
    if (log.book_id) {
      const book = books.find(b => b.id === log.book_id);
      if (book) return book;
    }
    return null;
  };

  const adjustMinutes = (delta: number) => {
    setMinutes((prev) => Math.max(1, Math.min(180, prev + delta)));
  };

  // Check if logs are editable (not verified by parent)
  const canEditLogs = childInfo ? !childInfo.total_verified : true;

  // Handle edit log
  const handleEditLog = async () => {
    if (!editingLog) return;
    
    const { error } = await supabase
      .from('reading_logs')
      .update({
        minutes: editMinutes,
        book_title: editBookTitle || null,
      })
      .eq('id', editingLog.id);

    if (error) {
      toast.error("Couldn't update the log. Try again!");
    } else {
      toast.success("Reading log updated! ✏️");
      setReadingLogs(prev => 
        prev.map(log => 
          log.id === editingLog.id 
            ? { ...log, minutes: editMinutes, book_title: editBookTitle || null }
            : log
        )
      );
      setEditingLog(null);
      refreshData();
      queryClient.invalidateQueries({ queryKey: ['weekly-minutes'] });
    }
  };

  // Handle delete log
  const handleDeleteLog = async (logId: string) => {
    const { error } = await supabase
      .from('reading_logs')
      .delete()
      .eq('id', logId);

    if (error) {
      toast.error("Couldn't delete the log. Try again!");
    } else {
      toast.success("Reading log removed 🗑️");
      setReadingLogs(prev => prev.filter(log => log.id !== logId));
      refreshData();
      queryClient.invalidateQueries({ queryKey: ['weekly-minutes'] });
    }
  };

  // Calculate stats from logs
  const stats = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayMinutes = readingLogs
      .filter(log => log.logged_at === today)
      .reduce((sum, log) => sum + log.minutes, 0);
    const longestSession = readingLogs.length > 0 
      ? Math.max(...readingLogs.map(log => log.minutes))
      : 0;
    const uniqueBooks = new Set(readingLogs.filter(l => l.book_id || l.book_title).map(l => l.book_id || l.book_title)).size;
    
    return { todayMinutes, longestSession, uniqueBooks };
  }, [readingLogs]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="container py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  const progressPercent = Math.min(100, (session.totalMinutes / session.goalMinutes) * 100);
  const goalReached = session.totalMinutes >= session.goalMinutes;

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1">
        {/* Hero Section - Full width background */}
        <section className="bg-background pt-5 md:pt-7 pb-[52px] md:pb-[60px]">
          <div className="container">
            {/* Constrain hero content - matching homepage layout */}
            <div className="max-w-4xl px-4 md:px-0 md:pl-14 lg:pl-20 md:ml-[30px] text-left">
              {/* Editorial headline treatment - magazine style */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-serif text-xl md:text-2xl text-muted-foreground italic">
                  Janney students have read
                </span>
                <span className="relative inline-block">
                  <span className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-foreground relative z-10">
                    {(schoolTotalMinutes ?? 0).toLocaleString()}
                  </span>
                  {/* Highlighter effect */}
                  <span
                    className="pointer-events-none absolute -skew-y-1 bg-accent/50 z-0 transform -rotate-[0.5deg]"
                    style={{
                      top: '45%',
                      bottom: '-2%',
                      left: '-3%',
                      right: '-3%',
                      borderRadius: '3px 5px 3px 4px',
                    }}
                    aria-hidden="true"
                  />
                </span>
                <span className="font-serif text-xl md:text-2xl text-muted-foreground italic">
                  minutes
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Blue Divider Line */}
        <div 
          className="h-px w-full bg-primary shadow-[0_4px_6px_0px_rgba(0,0,0,0.15)]"
          aria-hidden="true"
        />

        {/* Main Content */}
        <div className="bg-background-warm">
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
                        Welcome,
                      </span>{" "}
                      {session.name}!
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                      {goalReached 
                        ? "You reached your goal! Keep up the amazing reading! 🎉" 
                        : `${session.goalMinutes - session.totalMinutes} minutes to reach your goal`
                      }
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    style={handDrawnBorder}
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </div>

              {/* Progress Card */}
              <section>
                <div className="bg-background p-6 shadow-md" style={handDrawnBorder}>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Reading Goal Ring */}
                    <div className="shrink-0">
                      <ReadingGoalRing
                        progress={session.totalMinutes}
                        goal={session.goalMinutes}
                        size={180}
                        mobileSize={140}
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        {goalReached ? (
                          <>
                            <Trophy className="h-6 w-6 text-success" />
                            <span className="text-xl font-medium text-success">Goal Reached!</span>
                            <Sparkles className="h-5 w-5 text-warning animate-pulse" />
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="text-xl font-medium">Your Reading Progress</span>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-primary">{stats.todayMinutes}</p>
                          <p className="text-xs text-muted-foreground">Today</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-primary">{weeklyMinutes ?? 0}</p>
                          <p className="text-xs text-muted-foreground">This Week</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-primary">{stats.uniqueBooks}</p>
                          <p className="text-xs text-muted-foreground">Books</p>
                        </div>
                        {lastYearMinutes && lastYearMinutes > 0 ? (
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{lastYearMinutes.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Last Year</p>
                          </div>
                        ) : (
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{stats.longestSession}</p>
                            <p className="text-xs text-muted-foreground">Best Session</p>
                          </div>
                        )}
                      </div>

                      <Button asChild variant="outline" className="w-full md:w-auto">
                        <Link to="/student/books" className="flex items-center gap-2">
                          <Library className="h-4 w-4" />
                          View My Books
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Class & Grade Stats */}
              {(session.className || session.gradeInfo) && (
                <section>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {session.className && (
                      <div className="bg-background p-4 shadow-sm" style={handDrawnBorder}>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">{session.className}</span>
                        </div>
                        <p className="font-serif text-3xl font-normal text-foreground">
                          {(classTotalMinutes ?? 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">class minutes</p>
                      </div>
                    )}
                    {session.gradeInfo && (
                      <div className="bg-background p-4 shadow-sm" style={handDrawnBorder}>
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">{session.gradeInfo}</span>
                        </div>
                        <p className="font-serif text-3xl font-normal text-foreground">
                          {(gradeTotalMinutes ?? 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">grade minutes</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Class Fundraising Goal */}
              {session.className && activeEvent?.class_milestone_enabled && (
                <section>
                  <div className="bg-background p-5 shadow-sm" style={handDrawnBorder}>
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="h-5 w-5 text-warning" />
                      <h2 className="font-serif text-xl font-normal text-foreground">
                        {session.className} Fundraising Goal
                      </h2>
                    </div>
                    <ClassFundraisingShelf
                      fundedAmount={classFundraisingTotal ?? 0}
                      goalAmount={activeEvent.class_milestone_goal}
                      rewardLabel={activeEvent.class_milestone_reward}
                    />
                  </div>
                </section>
              )}

              {/* Favorite Books Rankings */}
              {((classFavoriteBooks && classFavoriteBooks.length > 0) || (gradeFavoriteBooks && gradeFavoriteBooks.length > 0)) && (
                <section>
                  <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-warning" />
                    Popular Books
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Class Favorite Books */}
                    {session.className && classFavoriteBooks && classFavoriteBooks.length > 0 && (
                      <div className="bg-background p-4 shadow-sm" style={handDrawnBorder}>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{session.className} Favorites</span>
                        </div>
                        <ol className="space-y-2">
                          {classFavoriteBooks.map((book: { book_title: string; read_count: number }, index: number) => (
                            <li key={book.book_title} className="flex items-center gap-2">
                              <span className={`flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${
                                index === 0 ? 'bg-warning text-warning-foreground' :
                                index === 1 ? 'bg-muted text-muted-foreground' :
                                index === 2 ? 'bg-amber-600 text-white' :
                                'bg-muted/50 text-muted-foreground'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="flex-1 text-sm truncate">{book.book_title}</span>
                              <span className="text-xs text-muted-foreground">{book.read_count}×</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {/* Grade Favorite Books */}
                    {session.gradeInfo && gradeFavoriteBooks && gradeFavoriteBooks.length > 0 && (
                      <div className="bg-background p-4 shadow-sm" style={handDrawnBorder}>
                        <div className="flex items-center gap-2 mb-3">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{session.gradeInfo} Favorites</span>
                        </div>
                        <ol className="space-y-2">
                          {gradeFavoriteBooks.map((book: { book_title: string; read_count: number }, index: number) => (
                            <li key={book.book_title} className="flex items-center gap-2">
                              <span className={`flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${
                                index === 0 ? 'bg-warning text-warning-foreground' :
                                index === 1 ? 'bg-muted text-muted-foreground' :
                                index === 2 ? 'bg-amber-600 text-white' :
                                'bg-muted/50 text-muted-foreground'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="flex-1 text-sm truncate">{book.book_title}</span>
                              <span className="text-xs text-muted-foreground">{book.read_count}×</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </section>
              )}

            </div>

            {/* Sidebar - Recent Activity & Log Reading */}
            <aside className="lg:w-80 xl:w-96 space-y-6">
              {/* Log Reading Button */}
              <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full h-14 text-lg bg-primary hover:bg-primary/90" size="lg" style={handDrawnBorder}>
                    <BookOpen className="h-6 w-6 mr-2" />
                    Log My Reading! 📚
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl flex items-center justify-center gap-2 text-primary">
                      <Sparkles className="h-6 w-6 text-warning" />
                      Log Your Reading!
                      <Sparkles className="h-6 w-6 text-warning" />
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogReading} className="space-y-6 pt-2">
                    {/* Minutes Stepper - Kid Friendly */}
                    <div className="space-y-3">
                      <Label className="text-base text-center block">How many minutes did you read today? ⏱️</Label>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="h-14 w-14 rounded-full text-2xl font-bold"
                          onClick={() => adjustMinutes(-5)}
                          disabled={minutes <= 1}
                        >
                          −
                        </Button>
                        <div className="text-center bg-muted/30 rounded-xl px-6 py-3">
                          <Input
                            type="number"
                            value={minutes}
                            onChange={(e) => setMinutes(Math.max(1, Math.min(180, Number(e.target.value))))}
                            className="w-20 text-center text-4xl font-bold border-none bg-transparent p-0 h-auto"
                            min={1}
                            max={180}
                          />
                          <span className="text-sm text-muted-foreground font-medium">minutes</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="h-14 w-14 rounded-full text-2xl font-bold"
                          onClick={() => adjustMinutes(5)}
                          disabled={minutes >= 180}
                        >
                          +
                        </Button>
                      </div>
                      {/* Quick preset buttons */}
                      <div className="flex justify-center gap-2 pt-2">
                        {[10, 15, 20, 30].map((preset) => (
                          <Button
                            key={preset}
                            type="button"
                            variant={minutes === preset ? "default" : "outline"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => setMinutes(preset)}
                          >
                            {preset} min
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Book Selector with Barcode Scanning */}
                    <div className="space-y-2">
                      <Label className="text-base text-center block">What book did you read? 📖</Label>
                      <BookSelector
                        selectedBook={selectedBook}
                        onSelectBook={setSelectedBook}
                        manualTitle={bookTitle}
                        onManualTitleChange={setBookTitle}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg" 
                      size="lg" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Saving... ⏳"
                      ) : (
                        <>
                          <Trophy className="h-5 w-5 mr-2" />
                          Done! Save My Reading! 🎉
                        </>
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Reading Logs Card */}
              <div className="bg-background p-6 shadow-md" style={handDrawnBorder}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-normal text-foreground flex items-center gap-2">
                    <History className="h-4 w-4" />
                    My Reading Logs
                  </h3>
                  {!canEditLogs && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      ✓ Verified by parent
                    </span>
                  )}
                </div>

                {isLoadingLogs ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : readingLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">No reading logged yet</p>
                    <p className="text-sm text-muted-foreground/70">Log your first reading above! 📚</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {readingLogs.map((log) => {
                      const bookInfo = getBookForLog(log);
                      const isEditing = editingLog?.id === log.id;
                      
                      return (
                        <div
                          key={log.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group"
                        >
                          {bookInfo?.cover_url ? (
                            <img
                              src={bookInfo.cover_url}
                              alt={bookInfo.title}
                              className="w-10 h-14 object-cover rounded shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-muted rounded flex items-center justify-center shrink-0">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          
                          {isEditing ? (
                            // Edit mode
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={editMinutes}
                                  onChange={(e) => setEditMinutes(Math.max(1, Math.min(180, Number(e.target.value))))}
                                  className="w-20 h-8 text-center"
                                  min={1}
                                  max={180}
                                />
                                <span className="text-sm text-muted-foreground">min</span>
                              </div>
                              <Input
                                value={editBookTitle}
                                onChange={(e) => setEditBookTitle(e.target.value)}
                                placeholder="Book title"
                                className="h-8"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleEditLog}>
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingLog(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground">{log.minutes} min</p>
                                {(bookInfo?.title || log.book_title) && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {bookInfo?.title || log.book_title}
                                  </p>
                                )}
                                {bookInfo?.author && (
                                  <p className="text-xs text-muted-foreground/70 truncate">
                                    by {bookInfo.author}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm text-muted-foreground">
                                  {formatLogDate(log.logged_at)}
                                </span>
                                {canEditLogs && (
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 p-0"
                                      onClick={() => {
                                        setEditingLog(log);
                                        setEditMinutes(log.minutes);
                                        setEditBookTitle(log.book_title || "");
                                      }}
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                      onClick={() => handleDeleteLog(log.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentPinDashboardPage;
