import { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import { useChildren, Child } from "@/hooks/useChildren";
import { useReadingLogs } from "@/hooks/useReadingLogs";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useEventStatus } from "@/hooks/useEventStatus";
import { BookSelector } from "@/components/books";
import { Book } from "@/hooks/useBooks";
import { z } from "zod";
import {
  CalendarIcon,
  Minus,
  Plus,
  Check,
  ChevronDown,
  Pencil,
  Trash2,
  BookOpen,
  Sparkles,
  PartyPopper,
  ArrowLeft,
  Clock,
  Calendar as CalendarIconSolid,
  AlertCircle,
} from "lucide-react";

// Hand-drawn border style (consistent with HomePage)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Validation schema
const readingLogSchema = z.object({
  minutes: z.number().min(1, "Please enter at least 1 minute").max(480, "Maximum 8 hours per entry"),
  bookTitle: z.string().max(200, "Book title too long").optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

const bookSuggestions = [
  "Charlotte's Web",
  "Diary of a Wimpy Kid",
  "Harry Potter",
  "The Magic Tree House",
  "Percy Jackson",
  "Goosebumps",
  "Captain Underpants",
  "Dog Man",
];

const minutePresets = [15, 30, 45, 60];

const LogReadingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialChildId = searchParams.get("child");

  // Fetch real data
  const { children, isLoading: childrenLoading } = useChildren();
  const { data: activeEvent } = useActiveEvent();
  const { phase, canParentsLog, validLogDates, phaseMessage, isLoading: statusLoading } = useEventStatus();

  // Form state
  const [selectedChildId, setSelectedChildId] = useState<string | null>(initialChildId);
  const [date, setDate] = useState<Date>(new Date());
  const [minutes, setMinutes] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null);

  // Set initial child when data loads
  useMemo(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const selectedChild = children.find((c) => c.id === selectedChildId);
  
  // Fetch reading logs for selected child
  const { logs, addLog, deleteLog, isLoading: logsLoading } = useReadingLogs(selectedChildId || undefined);

  const filteredSuggestions = bookSuggestions.filter((book) =>
    book.toLowerCase().includes(bookTitle.toLowerCase())
  );

  // Format log date for display
  const formatLogDate = (dateStr: string) => {
    const logDate = parseISO(dateStr);
    if (isToday(logDate)) return "Today";
    if (isYesterday(logDate)) return "Yesterday";
    return format(logDate, "MMM d, yyyy");
  };

  // Calculate new progress
  const newMinutesRead = (selectedChild?.total_minutes || 0) + minutes;
  const goalMinutes = selectedChild?.goal_minutes || 300;
  const newPercentage = Math.min(100, Math.round((newMinutesRead / goalMinutes) * 100));
  const currentPercentage = Math.min(100, Math.round(((selectedChild?.total_minutes || 0) / goalMinutes) * 100));
  const willReachGoal = newPercentage >= 100 && currentPercentage < 100;

  const handleMinutesChange = (delta: number) => {
    setMinutes((prev) => Math.max(0, Math.min(480, prev + delta)));
    setValidationErrors((prev) => ({ ...prev, minutes: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    // Validate
    const result = readingLogSchema.safeParse({
      minutes,
      bookTitle: bookTitle.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Use selected book title if available, otherwise manual title
      const finalBookTitle = selectedBook?.title || bookTitle.trim() || null;
      
      await addLog.mutateAsync({
        child_id: selectedChild.id,
        student_name: selectedChild.name,
        minutes,
        book_title: finalBookTitle,
        logged_at: format(date, "yyyy-MM-dd"),
        event_id: activeEvent?.id || null,
      });

      setIsSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setMinutes(0);
        setBookTitle("");
        setSelectedBook(null);
        setNotes("");
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      // Error toast handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async () => {
    if (!deleteLogId) return;
    try {
      await deleteLog.mutateAsync(deleteLogId);
    } catch (error) {
      // Error toast handled by mutation
    } finally {
      setDeleteLogId(null);
    }
  };

  const avatarInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Loading state
  if (childrenLoading || statusLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm">
          <div className="container py-8 max-w-2xl">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Phase-based blocking for parents
  if (!canParentsLog) {
    const formatDate = (d: Date) => format(d, "MMMM d");
    
    let title = "";
    let message = "";
    let icon = <Clock className="h-12 w-12 text-muted-foreground/50" />;
    
    if (phase === 'pre_event' && validLogDates) {
      title = "Reading Starts Soon";
      message = `The read-a-thon begins on ${formatDate(validLogDates.start)}. Use this time to sign up sponsors and get excited for reading!`;
      icon = <CalendarIconSolid className="h-12 w-12 text-primary" />;
    } else if (phase === 'closed') {
      title = "Read-a-thon Complete";
      message = "This year's read-a-thon has concluded. Check the results and collect pledges on your dashboard.";
      icon = <PartyPopper className="h-12 w-12 text-success" />;
    } else {
      title = "Logging Not Available";
      message = "Reading logging is not currently open.";
    }
    
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="mx-auto w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
              {icon}
            </div>
            <h1 className="font-serif text-2xl text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Grace period notice
  const isGracePeriod = phase === 'grace_period';

  // No children state
  if (children.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm flex items-center justify-center">
          <div className="text-center p-8">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="font-serif text-2xl text-foreground mb-2">No Children Added</h1>
            <p className="text-muted-foreground mb-6">
              Add a child to your account to start logging reading.
            </p>
            <Button asChild>
              <Link to="/onboarding/add-child">Add a Child</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Back to Dashboard */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground">
              Log Reading
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Record today's reading session for your child
            </p>
          </div>

          {/* Grace Period Notice */}
          {isGracePeriod && validLogDates && (
            <div 
              className="bg-warning/10 border border-warning/30 p-4 mb-6 flex items-start gap-3 rounded-lg"
            >
              <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Grace Period</p>
                <p className="text-sm text-muted-foreground">
                  The reading period has ended, but you can still log missed reading until {format(validLogDates.end, "MMMM d")}. 
                  Entries must be for dates between {format(validLogDates.start, "MMM d")} and {format(validLogDates.end, "MMM d")}.
                </p>
              </div>
            </div>
          )}

          {/* Child Selector */}
          {children.length > 1 && (
            <div className="mb-6">
              <div 
                className="flex gap-2 p-1 bg-background"
                style={handDrawnBorder}
              >
                {children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setSelectedChildId(child.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all",
                      selectedChildId === child.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <span
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold",
                        selectedChildId === child.id
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {avatarInitials(child.name)}
                    </span>
                    <span className="font-serif">{child.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Child Stats */}
          {selectedChild && (
            <div 
              className="bg-background p-6 mb-8 shadow-md"
              style={handDrawnBorder}
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-serif">
                  {avatarInitials(selectedChild.name)}
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-xl md:text-2xl text-foreground">
                    {selectedChild.name.split(" ")[0]}'s Progress
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedChild.total_minutes} / {selectedChild.goal_minutes} minutes ({currentPercentage}%)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl md:text-3xl text-primary">{currentPercentage}%</p>
                  <p className="text-xs text-muted-foreground">of goal</p>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {isSuccess && selectedChild && (
            <div className="mb-6 animate-scale-in">
              <div 
                className="bg-background p-6 text-center relative overflow-hidden shadow-md"
                style={handDrawnBorder}
              >
                <div className="relative z-10">
                  <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                    {willReachGoal ? (
                      <PartyPopper className="h-8 w-8 text-accent" />
                    ) : (
                      <Check className="h-8 w-8 text-accent" />
                    )}
                  </div>
                  <h2 className="font-serif text-xl md:text-2xl text-foreground mb-2">
                    {willReachGoal
                      ? "🎉 Goal Reached!"
                      : "Reading Logged Successfully!"}
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {selectedChild.name.split(" ")[0]} now has {newMinutesRead}{" "}
                    minutes ({newPercentage}% of goal)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {!isSuccess && selectedChild && (
            <div 
              className="bg-background p-6 mb-8 shadow-md"
              style={handDrawnBorder}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Picker */}
                <FormField label="Date" htmlFor="date">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        disabled={(d) => {
                          const now = new Date();
                          // Always block future dates
                          if (d > now) return true;
                          // During grace period, only allow dates within the valid log range
                          if (isGracePeriod && validLogDates) {
                            return d < validLogDates.start || d > validLogDates.end;
                          }
                          // Normal mode: allow any past date within reason
                          return d < new Date("2024-01-01");
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </FormField>

                {/* Minutes Input */}
                <FormField 
                  label="Minutes Read" 
                  htmlFor="minutes"
                  error={validationErrors.minutes}
                >
                  <div className="space-y-3">
                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => handleMinutesChange(-5)}
                        disabled={minutes <= 0}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <div className="relative">
                        <Input
                          id="minutes"
                          type="number"
                          value={minutes}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(480, parseInt(e.target.value) || 0));
                            setMinutes(val);
                            setValidationErrors((prev) => ({ ...prev, minutes: "" }));
                          }}
                          className={cn(
                            "w-24 h-14 text-center text-2xl font-serif",
                            validationErrors.minutes && "border-destructive"
                          )}
                          min={0}
                          max={480}
                        />
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                          minutes
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => handleMinutesChange(5)}
                        disabled={minutes >= 480}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Preset Buttons */}
                    <div className="flex justify-center gap-2 pt-4">
                      {minutePresets.map((preset) => (
                        <Button
                          key={preset}
                          type="button"
                          variant={minutes === preset ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setMinutes(preset);
                            setValidationErrors((prev) => ({ ...prev, minutes: "" }));
                          }}
                          className="font-serif"
                        >
                          {preset} min
                        </Button>
                      ))}
                    </div>
                  </div>
                </FormField>

                {/* Book Selector with Barcode Scanning */}
                <BookSelector
                  selectedBook={selectedBook}
                  onSelectBook={setSelectedBook}
                  manualTitle={bookTitle}
                  onManualTitleChange={(val) => {
                    setBookTitle(val.slice(0, 200));
                    setValidationErrors((prev) => ({ ...prev, bookTitle: "" }));
                  }}
                />

                {/* Progress Preview */}
                {minutes > 0 && (
                  <div 
                    className="bg-muted/30 p-4 animate-fade-in"
                    style={handDrawnBorder}
                  >
                    <div className="flex items-center gap-4">
                      {/* Mini Progress Ring */}
                      <div className="relative w-16 h-16 shrink-0">
                        <svg
                          className="w-full h-full -rotate-90 transform"
                          viewBox="0 0 64 64"
                        >
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            fill="none"
                            className="stroke-muted"
                            strokeWidth="6"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            fill="none"
                            className="stroke-primary transition-all duration-500"
                            strokeWidth="6"
                            strokeDasharray={`${Math.min(newPercentage, 100) * 1.63} 163`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-serif text-primary">
                          {newPercentage}%
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          This will bring{" "}
                          <span className="font-semibold">
                            {selectedChild.name.split(" ")[0]}
                          </span>{" "}
                          to{" "}
                          <span className="font-serif text-primary">
                            {newMinutesRead} minutes
                          </span>{" "}
                          ({newPercentage}% of goal)
                        </p>
                        {willReachGoal && (
                          <p className="text-sm text-accent font-medium mt-1 flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            This entry will reach the goal!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Section */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={minutes <= 0 || isSubmitting}
                  >
                    {isSubmitting ? "Logging..." : "Log Reading"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    asChild
                    style={handDrawnBorder}
                  >
                    <Link to="/dashboard">Cancel</Link>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Reading History */}
          {selectedChild && (
            <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
              <div 
                className="bg-background p-6 shadow-md"
                style={handDrawnBorder}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between text-left">
                    <div>
                      <h3 className="font-serif text-lg md:text-xl text-foreground">
                        Recent Reading History
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {logs.length} entries for{" "}
                        {selectedChild.name.split(" ")[0]}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        historyOpen && "rotate-180"
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  {logs.length === 0 ? (
                    <div className="text-center py-6">
                      <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No reading logged yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {logs.slice(0, 10).map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-foreground">
                                {entry.minutes} minutes
                              </span>
                              <span className="text-sm text-muted-foreground">
                                • {formatLogDate(entry.logged_at)}
                              </span>
                            </div>
                            {entry.book_title && (
                              <p className="text-sm text-muted-foreground truncate">
                                {entry.book_title}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteLogId(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteLogId} onOpenChange={() => setDeleteLogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reading Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this reading entry and update the total minutes read. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLog}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LogReadingPage;