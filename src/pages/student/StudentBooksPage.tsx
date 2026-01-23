import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStudentSession } from "@/hooks/useStudentSession";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  ArrowLeft, 
  LogOut,
  Library,
  Trophy
} from "lucide-react";

interface BookRead {
  id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
  total_minutes: number;
  sessions_count: number;
  last_read: string;
}

const StudentBooksPage = () => {
  const { session, isLoading: sessionLoading, logout, requireAuth } = useStudentSession();
  const [books, setBooks] = useState<BookRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Fetch books the student has read
  useEffect(() => {
    const fetchBooks = async () => {
      if (!session?.childId) return;

      // Get all reading logs with book info
      const { data: logs, error } = await supabase
        .from("reading_logs")
        .select(`
          id,
          minutes,
          logged_at,
          book_title,
          book_id,
          books (
            id,
            title,
            author,
            cover_url
          )
        `)
        .eq("child_id", session.childId)
        .order("logged_at", { ascending: false });

      if (error) {
        console.error("Error fetching books:", error);
        setIsLoading(false);
        return;
      }

      // Aggregate by book
      const bookMap = new Map<string, BookRead>();

      for (const log of logs || []) {
        // Determine the book key and info
        const bookData = log.books as { id: string; title: string; author: string | null; cover_url: string | null } | null;
        const bookKey = bookData?.id || log.book_title || 'unknown';
        const title = bookData?.title || log.book_title || 'Untitled Book';
        
        if (bookKey === 'unknown' || !log.book_title && !bookData) continue;

        const existing = bookMap.get(bookKey);
        if (existing) {
          existing.total_minutes += log.minutes;
          existing.sessions_count += 1;
          // Keep the most recent date
          if (log.logged_at > existing.last_read) {
            existing.last_read = log.logged_at;
          }
        } else {
          bookMap.set(bookKey, {
            id: bookKey,
            title,
            author: bookData?.author || null,
            cover_url: bookData?.cover_url || null,
            total_minutes: log.minutes,
            sessions_count: 1,
            last_read: log.logged_at,
          });
        }
      }

      // Sort by most recently read
      const sortedBooks = Array.from(bookMap.values()).sort(
        (a, b) => b.last_read.localeCompare(a.last_read)
      );

      setBooks(sortedBooks);
      setIsLoading(false);
    };

    fetchBooks();
  }, [session?.childId]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background-warm p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-warm">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto p-4 pb-8">
        {/* Back link */}
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            My Books
          </h1>
          <p className="text-muted-foreground mt-1">
            {books.length} {books.length === 1 ? 'book' : 'books'} you've read this year
          </p>
        </div>

        {/* Books grid / shelf */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-foreground mb-2">No books yet!</h2>
            <p className="text-muted-foreground mb-6">
              Start logging your reading to see your books here.
            </p>
            <Button asChild>
              <Link to="/student/dashboard">Log Reading</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Stats banner */}
            <div className="bg-primary/10 rounded-2xl p-4 mb-6 flex items-center justify-around text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{books.length}</p>
                <p className="text-xs text-muted-foreground">Books Read</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-primary">
                  {books.reduce((sum, b) => sum + b.total_minutes, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Minutes</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-primary">
                  {books.reduce((sum, b) => sum + b.sessions_count, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </div>

            {/* Bookshelf */}
            <div className="relative">
              {/* Shelf background effect */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {books.map((book, index) => (
                  <div
                    key={book.id}
                    className="group relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Book cover */}
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary flex flex-col items-center justify-center p-3 text-primary-foreground">
                          <BookOpen className="h-8 w-8 mb-2 opacity-80" />
                          <p className="text-xs font-medium text-center line-clamp-3">
                            {book.title}
                          </p>
                        </div>
                      )}
                      
                      {/* Spine effect */}
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center p-2 opacity-0 group-hover:opacity-100">
                        <div className="text-white text-center">
                          <p className="text-xs font-medium">{book.total_minutes} min</p>
                        </div>
                      </div>
                    </div>

                    {/* Book info */}
                    <div className="mt-2 px-1">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {book.title}
                      </p>
                      {book.author && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {book.author}
                        </p>
                      )}
                    </div>

                    {/* Sessions badge */}
                    {book.sessions_count > 1 && (
                      <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                        {book.sessions_count}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Decorative shelf lines */}
              <div className="hidden md:block">
                {Array.from({ length: Math.ceil(books.length / 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-3 bg-gradient-to-b from-amber-900/20 to-amber-800/30 rounded-sm -z-10"
                    style={{ top: `${(i + 1) * 250}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Achievement section */}
            {books.length >= 5 && (
              <div className="mt-8 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-2xl p-6 flex items-center gap-4">
                <div className="bg-yellow-500 text-white rounded-full p-3">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground">Bookworm!</h3>
                  <p className="text-sm text-muted-foreground">
                    You've read {books.length} books! Keep up the great work! 📚
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default StudentBooksPage;
