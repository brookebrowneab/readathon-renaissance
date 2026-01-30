import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStudentSession } from "@/hooks/useStudentSession";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useSchoolReadingStats } from "@/hooks/useSchoolReadingStats";
import { useClassReadingStats } from "@/hooks/useClassReadingStats";
import { useWeeklyReadingStats } from "@/hooks/useWeeklyReadingStats";
import { usePopularBooks } from "@/hooks/usePopularBooks";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ReadingGoalRing } from "@/components/legacy";
import { BookSelector } from "@/components/books";
import { Book, useBooks } from "@/hooks/useBooks";
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
  School,
  Users,
  GraduationCap,
  Star,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, isToday, isYesterday } from "date-fns";

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
}

interface BookInfo {
  id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
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
  
  // New data hooks
  const { data: schoolStats, isLoading: schoolStatsLoading } = useSchoolReadingStats();
  const { data: classStats } = useClassReadingStats(session?.className);
  const { data: weeklyStats } = useWeeklyReadingStats(session?.childId);
  const { data: popularBooks } = usePopularBooks({ 
    className: session?.className, 
    gradeInfo: session?.gradeInfo,
    limit: 4 
  });
  
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Log reading form state
  const [minutes, setMinutes] = useState(15);
  const [bookTitle, setBookTitle] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Refresh session data if class/grade info is missing (handles old sessions)
  useEffect(() => {
    if (session && (!session.className || !session.gradeInfo)) {
      refreshData();
    }
  }, [session, refreshData]);

  // Fetch reading logs with book info
  useEffect(() => {
    const fetchLogs = async () => {
      if (!session?.childId) return;

      const { data, error } = await supabase
        .from("reading_logs")
        .select("id, minutes, book_title, logged_at, book_id")
        .eq("child_id", session.childId)
        .order("logged_at", { ascending: false })
        .limit(10);

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

      <main className="flex-1 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {/* School-Wide Reading Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-6">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <School className="h-10 w-10 shrink-0" />
              <div>
                <p className="text-sm opacity-90">Our whole school has read</p>
                <p className="text-4xl md:text-5xl font-bold">
                  {schoolStatsLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>{(schoolStats?.total_minutes ?? 0).toLocaleString()} minutes!</>
                  )}
                </p>
                {schoolStats?.total_students && (
                  <p className="text-sm opacity-90">{schoolStats.total_students} readers strong 💪</p>
                )}
              </div>
            </div>
          </div>
        </div>

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
                    {/* Class and Grade Info */}
                    {(session.className || session.gradeInfo) && (
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        {session.className && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.className}
                          </span>
                        )}
                        {session.gradeInfo && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {session.gradeInfo}
                          </span>
                        )}
                      </div>
                    )}
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

              {/* Weekly + Class Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Last 7 Days */}
                <div className="bg-background p-5 shadow-md" style={handDrawnBorder}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-serif text-lg">Last 7 Days</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary mb-1">
                    {weeklyStats?.total_minutes ?? 0} min
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {weeklyStats?.daily_breakdown?.length ?? 0} days of reading
                  </p>
                </div>

                {/* Class Progress */}
                {session.className && (
                  <div className="bg-background p-5 shadow-md" style={handDrawnBorder}>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="font-serif text-lg">Class Total</h3>
                    </div>
                    <p className="text-3xl font-bold text-primary mb-1">
                      {(classStats?.total_minutes ?? 0).toLocaleString()} min
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {classStats?.student_count ?? 0} readers • {classStats?.total_books ?? 0} books
                    </p>
                  </div>
                )}
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

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-primary">{stats.todayMinutes}</p>
                          <p className="text-xs text-muted-foreground">Today</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-primary">{stats.longestSession} min</p>
                          <p className="text-xs text-muted-foreground">Best Session</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-primary">{stats.uniqueBooks}</p>
                          <p className="text-xs text-muted-foreground">Books</p>
                        </div>
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

              {/* Popular Books in Your Class/Grade */}
              {(popularBooks?.classBooks?.length || popularBooks?.gradeBooks?.length) && (
                <section>
                  <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-warning" />
                    Popular Books
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Class Favorites */}
                    {popularBooks?.classBooks && popularBooks.classBooks.length > 0 && (
                      <div className="bg-background p-5 shadow-md" style={handDrawnBorder}>
                        <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          In Your Class
                        </h3>
                        <div className="space-y-2">
                          {popularBooks.classBooks.map((book) => (
                            <div key={book.book_id} className="flex items-center gap-3">
                              {book.cover_url ? (
                                <img
                                  src={book.cover_url}
                                  alt={book.title}
                                  className="w-8 h-12 object-cover rounded shadow-sm shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-12 bg-muted rounded flex items-center justify-center shrink-0">
                                  <BookOpen className="h-3 w-3 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{book.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {book.read_count} {book.read_count === 1 ? 'reader' : 'readers'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grade Favorites */}
                    {popularBooks?.gradeBooks && popularBooks.gradeBooks.length > 0 && (
                      <div className="bg-background p-5 shadow-md" style={handDrawnBorder}>
                        <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          In Your Grade
                        </h3>
                        <div className="space-y-2">
                          {popularBooks.gradeBooks.map((book) => (
                            <div key={book.book_id} className="flex items-center gap-3">
                              {book.cover_url ? (
                                <img
                                  src={book.cover_url}
                                  alt={book.title}
                                  className="w-8 h-12 object-cover rounded shadow-sm shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-12 bg-muted rounded flex items-center justify-center shrink-0">
                                  <BookOpen className="h-3 w-3 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{book.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {book.read_count} {book.read_count === 1 ? 'reader' : 'readers'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Log Reading Card */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Log Your Reading
                  </h2>
                </div>

                <div className="bg-background p-6 shadow-md" style={handDrawnBorder}>
                  <form onSubmit={handleLogReading} className="space-y-4">
                    {/* Minutes Stepper */}
                    <div className="space-y-2">
                      <Label>How many minutes did you read?</Label>
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => adjustMinutes(-5)}
                          disabled={minutes <= 1}
                          style={handDrawnBorder}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="text-center">
                          <Input
                            type="number"
                            value={minutes}
                            onChange={(e) => setMinutes(Math.max(1, Math.min(180, Number(e.target.value))))}
                            className="w-24 text-center text-3xl font-bold"
                            min={1}
                            max={180}
                          />
                          <span className="text-sm text-muted-foreground">minutes</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => adjustMinutes(5)}
                          disabled={minutes >= 180}
                          style={handDrawnBorder}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Book Selector with Barcode Scanning */}
                    <BookSelector
                      selectedBook={selectedBook}
                      onSelectBook={setSelectedBook}
                      manualTitle={bookTitle}
                      onManualTitleChange={setBookTitle}
                    />

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Log My Reading! 📖"}
                    </Button>
                  </form>
                </div>
              </section>
            </div>

            {/* Sidebar - Recent Activity */}
            <aside className="lg:w-80 xl:w-96 space-y-6">
              <div className="bg-background p-6 shadow-md" style={handDrawnBorder}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-normal text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Recent Reading
                  </h3>
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
                  <div className="space-y-3">
                    {readingLogs.map((log) => {
                      const bookInfo = getBookForLog(log);
                      return (
                        <div
                          key={log.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
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
                          <span className="text-sm text-muted-foreground shrink-0">
                            {formatLogDate(log.logged_at)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentPinDashboardPage;
