import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Book {
  id: string;
  isbn: string | null;
  title: string;
  author: string | null;
  cover_url: string | null;
  created_at: string;
}

export interface BookInsert {
  isbn?: string | null;
  title: string;
  author?: string | null;
  cover_url?: string | null;
}

export interface OpenLibraryBook {
  title: string;
  authors?: { name: string }[];
  cover?: { medium?: string; large?: string };
  isbn_13?: string[];
  isbn_10?: string[];
}

// Fetch book info from Open Library API
export const fetchBookByISBN = async (isbn: string): Promise<{
  title: string;
  author: string | null;
  coverUrl: string | null;
  isbn: string;
} | null> => {
  try {
    // Clean the ISBN (remove dashes and spaces)
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    
    // Try Open Library API
    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch book data');
    }
    
    const data = await response.json();
    const bookKey = `ISBN:${cleanIsbn}`;
    const bookData = data[bookKey];
    
    if (!bookData) {
      return null;
    }
    
    return {
      title: bookData.title || 'Unknown Title',
      author: bookData.authors?.[0]?.name || null,
      coverUrl: bookData.cover?.medium || bookData.cover?.large || null,
      isbn: cleanIsbn,
    };
  } catch (error) {
    console.error('Error fetching book from Open Library:', error);
    return null;
  }
};

export const useBooks = () => {
  const queryClient = useQueryClient();

  // Fetch all books in the library
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("title", { ascending: true });

      if (error) throw error;
      return data as Book[];
    },
  });

  // Search books by title or author
  const searchBooks = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author?.toLowerCase().includes(lowerQuery)
    );
  };

  // Find book by ISBN
  const findByISBN = (isbn: string) => {
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    return books.find((book) => book.isbn === cleanIsbn);
  };

  // Add a new book to the library
  const addBook = useMutation({
    mutationFn: async (book: BookInsert) => {
      // Check if book with this ISBN already exists
      if (book.isbn) {
        const existing = findByISBN(book.isbn);
        if (existing) {
          return existing;
        }
      }

      const { data, error } = await supabase
        .from("books")
        .insert(book)
        .select()
        .single();

      if (error) {
        // If duplicate key error, try to fetch the existing book
        if (error.code === '23505') {
          const { data: existingBook } = await supabase
            .from("books")
            .select("*")
            .eq("isbn", book.isbn)
            .single();
          if (existingBook) return existingBook as Book;
        }
        throw error;
      }
      return data as Book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      console.error("Failed to add book:", error);
    },
  });

  // Scan ISBN and add to library
  const scanAndAddBook = async (isbn: string): Promise<Book | null> => {
    // First check if we already have this book
    const existingBook = findByISBN(isbn);
    if (existingBook) {
      return existingBook;
    }

    // Fetch from Open Library
    const bookInfo = await fetchBookByISBN(isbn);
    if (!bookInfo) {
      toast.error("Couldn't find that book. Try entering the title manually.");
      return null;
    }

    // Add to our library
    try {
      const newBook = await addBook.mutateAsync({
        isbn: bookInfo.isbn,
        title: bookInfo.title,
        author: bookInfo.author,
        cover_url: bookInfo.coverUrl,
      });
      toast.success(`Found: ${bookInfo.title}`);
      return newBook;
    } catch (error) {
      console.error("Error adding book:", error);
      return null;
    }
  };

  return {
    books,
    isLoading,
    error,
    searchBooks,
    findByISBN,
    addBook,
    scanAndAddBook,
  };
};
