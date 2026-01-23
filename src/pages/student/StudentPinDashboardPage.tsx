import { useEffect, useState } from "react";
import { useStudentSession } from "@/hooks/useStudentSession";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { BookSelector } from "@/components/books";
import { Book, useBooks } from "@/hooks/useBooks";
import { 
  BookOpen, 
  Clock, 
  Target, 
  LogOut, 
  Plus, 
  Minus,
  Trophy,
  Calendar,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

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

const StudentPinDashboardPage = () => {
  const { session, isLoading: sessionLoading, logout, refreshData, requireAuth } = useStudentSession();
  const { data: activeEvent } = useActiveEvent();
  const { books } = useBooks();
  
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

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background-warm p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  const progressPercent = Math.min(100, (session.totalMinutes / session.goalMinutes) * 100);
  const goalReached = session.totalMinutes >= session.goalMinutes;

  return (
    <div className="min-h-screen bg-background-warm">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-serif text-lg">Read-a-thon</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Hi, {session.name}!</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Progress Card */}
        <Card className="overflow-hidden">
          <CardHeader className={goalReached ? "bg-success/10" : "bg-primary/5"}>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {goalReached ? (
                  <>
                    <Trophy className="h-5 w-5 text-success" />
                    Goal Reached! 🎉
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5 text-primary" />
                    Your Reading Goal
                  </>
                )}
              </CardTitle>
              {goalReached && <Sparkles className="h-6 w-6 text-warning animate-pulse" />}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-primary">
                {session.totalMinutes}
                <span className="text-lg font-normal text-muted-foreground ml-1">
                  / {session.goalMinutes} min
                </span>
              </div>
            </div>
            <Progress value={progressPercent} className="h-4" />
            <p className="text-center text-sm text-muted-foreground mt-3">
              {goalReached
                ? "Amazing work! Keep reading to go even further!"
                : `${session.goalMinutes - session.totalMinutes} minutes to go!`}
            </p>
          </CardContent>
        </Card>

        {/* Log Reading Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Log Your Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="text-center">
                    <Input
                      type="number"
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(1, Math.min(180, Number(e.target.value))))}
                      className="w-20 text-center text-2xl font-bold"
                      min={1}
                      max={180}
                    />
                    <span className="text-xs text-muted-foreground">minutes</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => adjustMinutes(5)}
                    disabled={minutes >= 180}
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
          </CardContent>
        </Card>

        {/* Recent Reading Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLogs ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : readingLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No reading logged yet. Start reading! 📚
              </p>
            ) : (
              <div className="space-y-2">
                {readingLogs.map((log) => {
                  const bookInfo = getBookForLog(log);
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      {bookInfo?.cover_url ? (
                        <img
                          src={bookInfo.cover_url}
                          alt={bookInfo.title}
                          className="w-10 h-14 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-muted rounded flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{log.minutes} minutes</p>
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
                        {format(parseISO(log.logged_at), "MMM d")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentPinDashboardPage;
