import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MainNav, Footer, AppBreadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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
} from "lucide-react";

// Hand-drawn border style (consistent with HomePage)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Mock data
const mockChildren = [
  {
    id: "1",
    name: "Emma Johnson",
    avatarInitials: "EJ",
    minutesRead: 245,
    goalMinutes: 300,
  },
  {
    id: "2",
    name: "Lucas Johnson",
    avatarInitials: "LJ",
    minutesRead: 180,
    goalMinutes: 250,
  },
];

const mockRecentEntries = [
  {
    id: "1",
    childId: "1",
    date: "2024-03-25",
    minutes: 25,
    bookTitle: "Charlotte's Web",
    notes: "Read chapters 3-4",
  },
  {
    id: "2",
    childId: "1",
    date: "2024-03-24",
    minutes: 30,
    bookTitle: "Charlotte's Web",
    notes: "",
  },
  {
    id: "3",
    childId: "1",
    date: "2024-03-23",
    minutes: 20,
    bookTitle: null,
    notes: "Reading before bed",
  },
  {
    id: "4",
    childId: "2",
    date: "2024-03-25",
    minutes: 15,
    bookTitle: "Diary of a Wimpy Kid",
    notes: "",
  },
  {
    id: "5",
    childId: "2",
    date: "2024-03-24",
    minutes: 20,
    bookTitle: "Diary of a Wimpy Kid",
    notes: "Really enjoying this book!",
  },
];

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
  const initialChildId = searchParams.get("child") || mockChildren[0]?.id;

  const [selectedChildId, setSelectedChildId] = useState(initialChildId);
  const [date, setDate] = useState<Date>(new Date());
  const [minutes, setMinutes] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const selectedChild = mockChildren.find((c) => c.id === selectedChildId);

  const filteredSuggestions = bookSuggestions.filter((book) =>
    book.toLowerCase().includes(bookTitle.toLowerCase())
  );

  // Calculate new progress
  const newMinutesRead = (selectedChild?.minutesRead || 0) + minutes;
  const goalMinutes = selectedChild?.goalMinutes || 300;
  const newPercentage = Math.round((newMinutesRead / goalMinutes) * 100);
  const currentPercentage = Math.round(
    ((selectedChild?.minutesRead || 0) / goalMinutes) * 100
  );
  const willReachGoal = newPercentage >= 100 && currentPercentage < 100;

  // Filter history for selected child
  const childHistory = mockRecentEntries.filter(
    (e) => e.childId === selectedChildId
  );

  const handleMinutesChange = (delta: number) => {
    setMinutes((prev) => Math.max(0, prev + delta));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minutes <= 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after showing success
    setTimeout(() => {
      setMinutes(0);
      setBookTitle("");
      setNotes("");
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Breadcrumbs */}
          <AppBreadcrumbs
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Log Reading" },
            ]}
            className="mb-6"
          />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground">
              Log Reading
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Record today's reading session for your child
            </p>
          </div>

          {/* Child Selector */}
          {mockChildren.length > 1 && (
            <div className="mb-6">
              <div 
                className="flex gap-2 p-1 bg-background"
                style={handDrawnBorder}
              >
                {mockChildren.map((child) => (
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
                      {child.avatarInitials}
                    </span>
                    <span className="font-serif">{child.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Child Stats */}
          <div 
            className="bg-background p-6 mb-8 shadow-md"
            style={handDrawnBorder}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-serif">
                {selectedChild?.avatarInitials}
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-xl md:text-2xl text-foreground">
                  {selectedChild?.name.split(" ")[0]}'s Progress
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedChild?.minutesRead} / {selectedChild?.goalMinutes} minutes ({currentPercentage}%)
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-2xl md:text-3xl text-primary">{currentPercentage}%</p>
                <p className="text-xs text-muted-foreground">of goal</p>
              </div>
            </div>
          </div>

          {/* Success State */}
          {isSuccess && (
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
                    {selectedChild?.name.split(" ")[0]} now has {newMinutesRead}{" "}
                    minutes ({newPercentage}% of goal)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {!isSuccess && (
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
                        disabled={(d) =>
                          d > new Date() || d < new Date("2024-01-01")
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </FormField>

                {/* Minutes Input */}
                <FormField label="Minutes Read" htmlFor="minutes">
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
                          onChange={(e) =>
                            setMinutes(Math.max(0, parseInt(e.target.value) || 0))
                          }
                          className="w-24 h-14 text-center text-2xl font-serif"
                          min={0}
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
                          onClick={() => setMinutes(preset)}
                          className="font-serif"
                        >
                          {preset} min
                        </Button>
                      ))}
                    </div>
                  </div>
                </FormField>

                {/* Book Title with Autocomplete */}
                <FormField
                  label="Book Title"
                  htmlFor="bookTitle"
                  helperText="Optional - helps track what they're reading"
                >
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="bookTitle"
                      placeholder="Enter book title..."
                      value={bookTitle}
                      onChange={(e) => {
                        setBookTitle(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                      }
                      className="pl-10"
                    />
                    {showSuggestions &&
                      bookTitle &&
                      filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredSuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                              onClick={() => {
                                setBookTitle(suggestion);
                                setShowSuggestions(false);
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </FormField>

                {/* Notes */}
                <FormField
                  label="Notes"
                  htmlFor="notes"
                  helperText="Optional - add any notes about this reading session"
                >
                  <Textarea
                    id="notes"
                    placeholder="What did they read about? Any thoughts?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </FormField>

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
                            {selectedChild?.name.split(" ")[0]}
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
                      {childHistory.length} entries for{" "}
                      {selectedChild?.name.split(" ")[0]}
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
                <div className="space-y-3">
                  {childHistory.map((entry) => (
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
                            •{" "}
                            {format(new Date(entry.date), "MMM d, yyyy")}
                          </span>
                        </div>
                        {entry.bookTitle && (
                          <p className="text-sm text-muted-foreground truncate">
                            {entry.bookTitle}
                          </p>
                        )}
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground truncate mt-1 italic">
                            "{entry.notes}"
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LogReadingPage;
