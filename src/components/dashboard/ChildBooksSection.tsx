import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ChildBook {
  id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
}

interface ChildBooksSectionProps {
  childId: string;
}

export const ChildBooksSection = ({ childId }: ChildBooksSectionProps) => {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["child-books", childId],
    queryFn: async () => {
      // Fetch reading logs with book data for this child
      const { data, error } = await supabase
        .from("reading_logs")
        .select(`
          book_id,
          book_title,
          book:books(id, title, author, cover_url)
        `)
        .eq("child_id", childId)
        .order("logged_at", { ascending: false });

      if (error) throw error;

      // Deduplicate books, prioritizing those with full book data
      const seenIds = new Set<string>();
      const seenTitles = new Set<string>();
      const uniqueBooks: ChildBook[] = [];

      data?.forEach((log: any) => {
        // If we have book metadata from the books table
        if (log.book && !seenIds.has(log.book.id)) {
          seenIds.add(log.book.id);
          seenTitles.add(log.book.title.toLowerCase());
          uniqueBooks.push(log.book);
        } 
        // Fallback to book_title field if no book_id
        else if (log.book_title && !log.book_id) {
          const titleKey = log.book_title.toLowerCase();
          if (!seenTitles.has(titleKey)) {
            seenTitles.add(titleKey);
            uniqueBooks.push({
              id: `title-${titleKey}`,
              title: log.book_title,
              author: null,
              cover_url: null,
            });
          }
        }
      });

      return uniqueBooks;
    },
    enabled: !!childId,
  });

  if (isLoading) {
    return (
      <div className="w-full pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          My Books
        </p>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-12 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="w-full pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          My Books
        </p>
        <div className="flex items-center justify-center py-3 bg-muted/20 rounded-lg">
          <p className="text-xs text-muted-foreground">No books logged yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-2 border-t border-border">
      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
        <BookOpen className="h-3 w-3" />
        My Books ({books.length})
      </p>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {books.map((book) => (
            <div
              key={book.id}
              className="group relative shrink-0"
              title={`${book.title}${book.author ? ` by ${book.author}` : ""}`}
            >
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="h-16 w-12 object-cover rounded shadow-sm border border-border transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="h-16 w-12 bg-gradient-to-b from-primary/20 to-primary/10 rounded shadow-sm border border-border flex flex-col items-center justify-center p-1 transition-transform group-hover:scale-105">
                  <BookOpen className="h-4 w-4 text-primary/60 mb-0.5" />
                  <span className="text-[6px] text-center text-muted-foreground leading-tight line-clamp-2 break-all">
                    {book.title.slice(0, 20)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
