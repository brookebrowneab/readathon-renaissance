import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, BookOpen, Search, X, Loader2 } from "lucide-react";
import { BarcodeScanner } from "./BarcodeScanner";
import { useBooks, Book } from "@/hooks/useBooks";
import { cn } from "@/lib/utils";

interface OpenLibrarySearchResult {
  title: string;
  author_name?: string[];
  cover_i?: number;
  isbn?: string[];
}

interface BookSelectorProps {
  selectedBook: Book | null;
  onSelectBook: (book: Book | null) => void;
  manualTitle: string;
  onManualTitleChange: (title: string) => void;
  className?: string;
}

export const BookSelector = ({
  selectedBook,
  onSelectBook,
  manualTitle,
  onManualTitleChange,
  className,
}: BookSelectorProps) => {
  const { books, isLoading, searchBooks, scanAndAddBook, addBook } = useBooks();
  const [showScanner, setShowScanner] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  
  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<Book[]>([]);
  const [externalResults, setExternalResults] = useState<OpenLibrarySearchResult[]>([]);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredBooks(searchBooks(searchQuery));
    } else {
      setFilteredBooks(books.slice(0, 20)); // Show recent books
    }
  }, [searchQuery, books]);

  // Handle autocomplete for manual title input
  useEffect(() => {
    if (manualTitle.trim().length >= 2) {
      // Search local database first
      const localResults = searchBooks(manualTitle);
      setAutocompleteResults(localResults.slice(0, 5));
      setShowAutocomplete(true);

      // Debounce external API search
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        if (manualTitle.trim().length >= 3) {
          setIsSearchingExternal(true);
          try {
            const response = await fetch(
              `https://openlibrary.org/search.json?title=${encodeURIComponent(manualTitle)}&limit=5`
            );
            if (response.ok) {
              const data = await response.json();
              setExternalResults(data.docs?.slice(0, 5) || []);
            }
          } catch (error) {
            console.error("Error searching Open Library:", error);
          } finally {
            setIsSearchingExternal(false);
          }
        }
      }, 400);
    } else {
      setShowAutocomplete(false);
      setAutocompleteResults([]);
      setExternalResults([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [manualTitle]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocalBook = (book: Book) => {
    onSelectBook(book);
    onManualTitleChange("");
    setShowAutocomplete(false);
  };

  const handleSelectExternalBook = async (result: OpenLibrarySearchResult) => {
    setShowAutocomplete(false);
    setIsScanning(true);

    try {
      // Add the book to our library
      const coverUrl = result.cover_i
        ? `https://covers.openlibrary.org/b/id/${result.cover_i}-M.jpg`
        : null;

      const newBook = await addBook.mutateAsync({
        title: result.title,
        author: result.author_name?.[0] || null,
        cover_url: coverUrl,
        isbn: result.isbn?.[0] || null,
      });

      onSelectBook(newBook);
      onManualTitleChange("");
    } catch (error) {
      console.error("Error adding book:", error);
      // Still use the title even if we couldn't save the book
      onManualTitleChange(result.title);
    } finally {
      setIsScanning(false);
    }
  };

  const handleScan = async (isbn: string) => {
    setShowScanner(false);
    setIsScanning(true);
    
    const book = await scanAndAddBook(isbn);
    if (book) {
      onSelectBook(book);
      onManualTitleChange("");
    }
    
    setIsScanning(false);
  };

  const handleSelectFromLibrary = (book: Book) => {
    onSelectBook(book);
    onManualTitleChange("");
    setShowLibrary(false);
  };

  const handleClearBook = () => {
    onSelectBook(null);
  };

  // If a book is selected, show it
  if (selectedBook) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>Book</Label>
        <Card className="overflow-hidden">
          <CardContent className="p-3 flex items-center gap-3">
            {selectedBook.cover_url ? (
              <img
                src={selectedBook.cover_url}
                alt={selectedBook.title}
                className="w-12 h-16 object-cover rounded shadow-sm"
              />
            ) : (
              <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{selectedBook.title}</p>
              {selectedBook.author && (
                <p className="text-xs text-muted-foreground truncate">
                  {selectedBook.author}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleClearBook}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="bookTitle">What book?</Label>
      
      {/* Manual input with scan/library buttons */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            id="bookTitle"
            placeholder="Enter title or scan..."
            value={manualTitle}
            onChange={(e) => onManualTitleChange(e.target.value)}
            onFocus={() => manualTitle.trim().length >= 2 && setShowAutocomplete(true)}
            disabled={isScanning}
            autoComplete="off"
          />
          
          {/* Autocomplete dropdown */}
          {showAutocomplete && (autocompleteResults.length > 0 || externalResults.length > 0 || isSearchingExternal) && (
            <div
              ref={autocompleteRef}
              className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg max-h-[300px] overflow-y-auto"
            >
              {/* Local database results */}
              {autocompleteResults.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                    Recently Read
                  </div>
                  {autocompleteResults.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                      onClick={() => handleSelectLocalBook(book)}
                    >
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-8 h-10 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-8 h-10 bg-muted rounded flex items-center justify-center">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{book.title}</p>
                        {book.author && (
                          <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* External API results */}
              {externalResults.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 border-t">
                    From Open Library
                  </div>
                  {externalResults.map((result, index) => (
                    <button
                      key={`external-${index}`}
                      type="button"
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                      onClick={() => handleSelectExternalBook(result)}
                    >
                      {result.cover_i ? (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${result.cover_i}-S.jpg`}
                          alt={result.title}
                          className="w-8 h-10 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-8 h-10 bg-muted rounded flex items-center justify-center">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.title}</p>
                        {result.author_name?.[0] && (
                          <p className="text-xs text-muted-foreground truncate">{result.author_name[0]}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Loading state for external search */}
              {isSearchingExternal && (
                <div className="px-3 py-2 flex items-center gap-2 text-sm text-muted-foreground border-t">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Searching online...
                </div>
              )}
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowScanner(true)}
          disabled={isScanning}
          title="Scan barcode"
        >
          {isScanning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowLibrary(true)}
          disabled={isScanning}
          title="Browse library"
        >
          <BookOpen className="h-4 w-4" />
        </Button>
      </div>

      {/* Barcode scanner modal */}
      {showScanner && (
        <Dialog open={showScanner} onOpenChange={setShowScanner}>
          <DialogContent className="p-0 max-w-sm">
            <BarcodeScanner
              onScan={handleScan}
              onClose={() => setShowScanner(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Book library modal */}
      <Dialog open={showLibrary} onOpenChange={setShowLibrary}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recently Read
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Book list */}
          <ScrollArea className="h-[300px] -mx-6 px-6">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchQuery
                    ? "No books found"
                    : "No books yet. Scan a barcode to add!"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredBooks.map((book) => (
                  <button
                    key={book.id}
                    className="w-full p-3 flex items-center gap-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                    onClick={() => handleSelectFromLibrary(book)}
                  >
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{book.title}</p>
                      {book.author && (
                        <p className="text-xs text-muted-foreground truncate">
                          {book.author}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Scan button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setShowLibrary(false);
              setShowScanner(true);
            }}
          >
            <Camera className="h-4 w-4 mr-2" />
            Scan New Book
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
