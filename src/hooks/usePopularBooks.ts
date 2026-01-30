import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PopularBook {
  book_id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
  read_count: number;
}

interface UsePopularBooksOptions {
  className?: string | null;
  gradeInfo?: string | null;
  limit?: number;
}

export function usePopularBooks({ className, gradeInfo, limit = 5 }: UsePopularBooksOptions = {}) {
  return useQuery({
    queryKey: ["popular-books", className, gradeInfo, limit],
    queryFn: async (): Promise<{ classBooks: PopularBook[]; gradeBooks: PopularBook[] }> => {
      const classBooks: PopularBook[] = [];
      const gradeBooks: PopularBook[] = [];

      // Get popular books for class
      if (className) {
        const { data: classLogs, error: classError } = await supabase
          .from("reading_logs")
          .select(`
            book_id,
            books!inner(id, title, author, cover_url),
            children!inner(class_name)
          `)
          .eq("children.class_name", className)
          .not("book_id", "is", null);

        if (!classError && classLogs) {
          // Count occurrences of each book
          const bookCounts = new Map<string, { book: PopularBook; count: number }>();
          for (const log of classLogs) {
            const book = log.books as { id: string; title: string; author: string | null; cover_url: string | null };
            if (book) {
              const existing = bookCounts.get(book.id);
              if (existing) {
                existing.count++;
              } else {
                bookCounts.set(book.id, {
                  book: {
                    book_id: book.id,
                    title: book.title,
                    author: book.author,
                    cover_url: book.cover_url,
                    read_count: 1,
                  },
                  count: 1,
                });
              }
            }
          }
          // Sort by count and take top N
          const sorted = Array.from(bookCounts.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, limit)
            .map(({ book, count }) => ({ ...book, read_count: count }));
          classBooks.push(...sorted);
        }
      }

      // Get popular books for grade
      if (gradeInfo) {
        const { data: gradeLogs, error: gradeError } = await supabase
          .from("reading_logs")
          .select(`
            book_id,
            books!inner(id, title, author, cover_url),
            children!inner(grade_info)
          `)
          .eq("children.grade_info", gradeInfo)
          .not("book_id", "is", null);

        if (!gradeError && gradeLogs) {
          // Count occurrences of each book
          const bookCounts = new Map<string, { book: PopularBook; count: number }>();
          for (const log of gradeLogs) {
            const book = log.books as { id: string; title: string; author: string | null; cover_url: string | null };
            if (book) {
              const existing = bookCounts.get(book.id);
              if (existing) {
                existing.count++;
              } else {
                bookCounts.set(book.id, {
                  book: {
                    book_id: book.id,
                    title: book.title,
                    author: book.author,
                    cover_url: book.cover_url,
                    read_count: 1,
                  },
                  count: 1,
                });
              }
            }
          }
          // Sort by count and take top N
          const sorted = Array.from(bookCounts.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, limit)
            .map(({ book, count }) => ({ ...book, read_count: count }));
          gradeBooks.push(...sorted);
        }
      }

      return { classBooks, gradeBooks };
    },
    enabled: !!(className || gradeInfo),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
