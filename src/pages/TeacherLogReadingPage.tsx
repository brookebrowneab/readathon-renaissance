import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Search,
  Users,
  User,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  Minus,
  Star,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, isToday, isYesterday } from "date-fns";

// Mock data
const mockStudents = [
  { id: "1", name: "Emma S.", initials: "ES", minutes: 245, goal: 300, lastActive: "Today", recentlyLogged: true },
  { id: "2", name: "Liam T.", initials: "LT", minutes: 220, goal: 300, lastActive: "Today", recentlyLogged: true },
  { id: "3", name: "Olivia R.", initials: "OR", minutes: 195, goal: 300, lastActive: "Yesterday", recentlyLogged: false },
  { id: "4", name: "Noah P.", initials: "NP", minutes: 180, goal: 300, lastActive: "Today", recentlyLogged: true },
  { id: "5", name: "Ava M.", initials: "AM", minutes: 165, goal: 300, lastActive: "2 days ago", recentlyLogged: false },
  { id: "6", name: "Mason W.", initials: "MW", minutes: 145, goal: 300, lastActive: "Today", recentlyLogged: false },
  { id: "7", name: "Sophia L.", initials: "SL", minutes: 310, goal: 300, lastActive: "Today", recentlyLogged: true },
  { id: "8", name: "Jackson K.", initials: "JK", minutes: 120, goal: 300, lastActive: "3 days ago", recentlyLogged: false },
  { id: "9", name: "Isabella H.", initials: "IH", minutes: 275, goal: 300, lastActive: "Today", recentlyLogged: false },
  { id: "10", name: "Lucas G.", initials: "LG", minutes: 88, goal: 300, lastActive: "5 days ago", recentlyLogged: false },
  { id: "11", name: "Mia F.", initials: "MF", minutes: 340, goal: 300, lastActive: "Today", recentlyLogged: true },
  { id: "12", name: "Ethan D.", initials: "ED", minutes: 210, goal: 300, lastActive: "Yesterday", recentlyLogged: false },
];

const mockRecentHistory = [
  { date: "Today", minutes: 25, bookTitle: "Charlotte's Web" },
  { date: "Yesterday", minutes: 30, bookTitle: "Charlotte's Web" },
  { date: "2 days ago", minutes: 20, bookTitle: "Magic Tree House" },
];

const popularBooks = [
  "Diary of a Wimpy Kid",
  "Dog Man",
  "Captain Underpants",
  "Harry Potter",
  "Percy Jackson",
  "Magic Tree House",
  "Dork Diaries",
  "The Bad Guys",
  "Wings of Fire",
  "Charlotte's Web",
];

const TeacherLogReadingPage = () => {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [minutes, setMinutes] = useState(20);
  const [bookTitle, setBookTitle] = useState("");
  const [parentNote, setParentNote] = useState("");
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showBookSuggestions, setShowBookSuggestions] = useState(false);

  // Sort students with recently logged first
  const sortedStudents = useMemo(() => {
    return [...mockStudents].sort((a, b) => {
      if (a.recentlyLogged && !b.recentlyLogged) return -1;
      if (!a.recentlyLogged && b.recentlyLogged) return 1;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const filteredBooks = useMemo(() => {
    if (bookTitle.length < 2) return [];
    return popularBooks.filter(book =>
      book.toLowerCase().includes(bookTitle.toLowerCase())
    );
  }, [bookTitle]);

  const handleMinutesChange = (delta: number) => {
    setMinutes(prev => Math.max(1, Math.min(180, prev + delta)));
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === mockStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(mockStudents.map(s => s.id));
    }
  };

  const isUnusualEntry = minutes >= 120;

  const handleSubmit = () => {
    const studentsToLog = isBulkMode 
      ? selectedStudents.map(id => mockStudents.find(s => s.id === id)?.name)
      : [selectedStudent?.name];
    
    console.log("Logging reading:", {
      students: studentsToLog,
      date,
      minutes,
      bookTitle,
      parentNote,
      requiresConfirmation,
    });
    
    setIsSubmitted(true);
  };

  const handleLogAnother = () => {
    setIsSubmitted(false);
    setSelectedStudent(null);
    setSelectedStudents([]);
    setMinutes(20);
    setBookTitle("");
    setParentNote("");
    setRequiresConfirmation(false);
  };

  const canSubmit = isBulkMode 
    ? selectedStudents.length > 0 && minutes > 0
    : selectedStudent && minutes > 0;

  if (isSubmitted) {
    const loggedNames = isBulkMode
      ? selectedStudents.map(id => mockStudents.find(s => s.id === id)?.name).filter(Boolean)
      : [selectedStudent?.name];

    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm flex items-center justify-center py-8">
          <BookContainer variant="default" className="max-w-lg mx-4 p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="h-20 w-20 rounded-full bg-brand-green/20 flex items-center justify-center animate-scale-in">
                <CheckCircle className="h-12 w-12 text-brand-green" />
              </div>

              <h1 className="font-serif text-2xl text-brand-blue">
                Reading Logged Successfully!
              </h1>

              <div className="w-full p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">
                  {isBulkMode ? `${loggedNames.length} students` : loggedNames[0]}
                </p>
                <p className="font-handwritten text-2xl text-brand-blue">
                  {minutes} minutes
                </p>
                {bookTitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Reading: {bookTitle}
                  </p>
                )}
              </div>

              {isBulkMode && loggedNames.length > 0 && (
                <div className="w-full text-left">
                  <p className="text-sm text-muted-foreground mb-2">Students logged:</p>
                  <div className="flex flex-wrap gap-2">
                    {loggedNames.slice(0, 8).map((name, i) => (
                      <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                        {name}
                      </span>
                    ))}
                    {loggedNames.length > 8 && (
                      <span className="px-2 py-1 bg-muted rounded text-sm text-muted-foreground">
                        +{loggedNames.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 w-full mt-4">
                <Button
                  size="lg"
                  className="w-full bg-brand-blue text-white hover:bg-brand-blue/90"
                  onClick={handleLogAnother}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Log Another
                </Button>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/teacher">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Class Overview
                  </Link>
                </Button>
              </div>
            </div>
          </BookContainer>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm pb-8">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/teacher">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-serif text-2xl text-foreground md:text-3xl">
                Log Reading for Students
              </h1>
              <p className="text-muted-foreground">
                Record reading time for your class
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mode Toggle */}
              <BookContainer variant="warm" className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      isBulkMode ? "bg-brand-blue/20" : "bg-muted"
                    )}>
                      {isBulkMode ? <Users className="h-5 w-5 text-brand-blue" /> : <User className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {isBulkMode ? "Bulk Entry Mode" : "Single Student Mode"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isBulkMode ? "Log for multiple students at once" : "Log reading for one student"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsBulkMode(!isBulkMode);
                      setSelectedStudent(null);
                      setSelectedStudents([]);
                    }}
                  >
                    Switch to {isBulkMode ? "Single" : "Bulk"}
                  </Button>
                </div>
              </BookContainer>

              {/* Student Selection */}
              <BookContainer variant="default" className="p-6">
                <h2 className="font-serif text-xl text-brand-blue mb-4">
                  {isBulkMode ? "Select Students" : "Select Student"}
                </h2>

                {isBulkMode ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedStudents.length === mockStudents.length}
                          onCheckedChange={handleSelectAll}
                        />
                        <Label className="text-sm">Select All</Label>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {selectedStudents.length} selected
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {sortedStudents.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => handleStudentToggle(student.id)}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-left",
                            selectedStudents.includes(student.id)
                              ? "border-brand-blue bg-brand-blue/10"
                              : "border-border hover:border-brand-blue/50"
                          )}
                        >
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                            selectedStudents.includes(student.id)
                              ? "bg-brand-blue text-white"
                              : "bg-muted text-muted-foreground"
                          )}>
                            {student.initials}
                          </div>
                          <span className="text-sm font-medium truncate">{student.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-14"
                      >
                        {selectedStudent ? (
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-sm font-medium">
                              {selectedStudent.initials}
                            </div>
                            <span>{selectedStudent.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Search for a student...</span>
                        )}
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search students..." />
                        <CommandList>
                          <CommandEmpty>No student found.</CommandEmpty>
                          <CommandGroup heading="Recent">
                            {sortedStudents.filter(s => s.recentlyLogged).map((student) => (
                              <CommandItem
                                key={student.id}
                                onSelect={() => {
                                  setSelectedStudent(student);
                                  setStudentSearchOpen(false);
                                }}
                                className="flex items-center gap-3 py-3"
                              >
                                <div className="h-8 w-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-medium">
                                  {student.initials}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {student.minutes}/{student.goal} min
                                  </p>
                                </div>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <CommandGroup heading="All Students">
                            {sortedStudents.filter(s => !s.recentlyLogged).map((student) => (
                              <CommandItem
                                key={student.id}
                                onSelect={() => {
                                  setSelectedStudent(student);
                                  setStudentSearchOpen(false);
                                }}
                                className="flex items-center gap-3 py-3"
                              >
                                <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                                  {student.initials}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {student.minutes}/{student.goal} min
                                  </p>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </BookContainer>

              {/* Reading Details */}
              <BookContainer variant="warm" className="p-6">
                <h2 className="font-serif text-xl text-brand-blue mb-4">Reading Details</h2>

                <div className="space-y-6">
                  {/* Date */}
                  <div className="space-y-3">
                    <Label>Date</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={isToday(date) ? "default" : "outline"}
                        className={cn(
                          "flex-1",
                          isToday(date) && "bg-brand-blue text-white hover:bg-brand-blue/90"
                        )}
                        onClick={() => setDate(new Date())}
                      >
                        Today
                      </Button>
                      <Button
                        variant={isYesterday(date) ? "default" : "outline"}
                        className={cn(
                          "flex-1",
                          isYesterday(date) && "bg-brand-blue text-white hover:bg-brand-blue/90"
                        )}
                        onClick={() => setDate(subDays(new Date(), 1))}
                      >
                        Yesterday
                      </Button>
                      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={!isToday(date) && !isYesterday(date) ? "default" : "outline"}
                            size="icon"
                            className={cn(
                              !isToday(date) && !isYesterday(date) && "bg-brand-blue text-white hover:bg-brand-blue/90"
                            )}
                          >
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => {
                              if (d) {
                                setDate(d);
                                setShowCalendar(false);
                              }
                            }}
                            disabled={(d) => d > new Date()}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Minutes */}
                  <div className="space-y-3">
                    <Label>Minutes Read</Label>
                    <div className="flex items-center justify-center gap-6">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={() => handleMinutesChange(-5)}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <div className="text-center">
                        <span className="font-handwritten text-5xl text-brand-blue">{minutes}</span>
                        <p className="text-sm text-muted-foreground">minutes</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={() => handleMinutesChange(5)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {[15, 20, 30, 45, 60].map((m) => (
                        <Button
                          key={m}
                          variant="outline"
                          size="sm"
                          className={cn(
                            minutes === m && "border-brand-blue text-brand-blue"
                          )}
                          onClick={() => setMinutes(m)}
                        >
                          {m}
                        </Button>
                      ))}
                    </div>

                    {/* Unusual entry warning */}
                    {isUnusualEntry && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          This is a longer reading session than usual. Please verify this is correct.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Book Title */}
                  <div className="space-y-2">
                    <Label htmlFor="bookTitle">Book Title (optional)</Label>
                    <div className="relative">
                      <Input
                        id="bookTitle"
                        placeholder="What were they reading?"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        onFocus={() => setShowBookSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowBookSuggestions(false), 200)}
                      />
                      {showBookSuggestions && filteredBooks.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-auto">
                          {filteredBooks.map((book) => (
                            <button
                              key={book}
                              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                              onMouseDown={() => {
                                setBookTitle(book);
                                setShowBookSuggestions(false);
                              }}
                            >
                              {book}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Note for Parent */}
                  <div className="space-y-2">
                    <Label htmlFor="parentNote">Note for Parent (optional)</Label>
                    <Textarea
                      id="parentNote"
                      placeholder="Any message to share with the parent..."
                      value={parentNote}
                      onChange={(e) => setParentNote(e.target.value)}
                      rows={2}
                    />
                  </div>

                  {/* Requires Confirmation */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Checkbox
                      id="requiresConfirmation"
                      checked={requiresConfirmation}
                      onCheckedChange={(checked) => setRequiresConfirmation(checked === true)}
                    />
                    <Label htmlFor="requiresConfirmation" className="text-sm font-normal">
                      Requires parent confirmation before counting toward goal
                    </Label>
                  </div>
                </div>
              </BookContainer>

              {/* Submit Button */}
              <Button
                size="lg"
                className="w-full h-14 text-lg bg-brand-blue text-white hover:bg-brand-blue/90"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Log Reading {isBulkMode && selectedStudents.length > 0 && `for ${selectedStudents.length} Students`}
              </Button>
            </div>

            {/* Sidebar - Student Context */}
            <div className="space-y-6">
              {selectedStudent && !isBulkMode ? (
                <>
                  {/* Student Progress */}
                  <BookContainer variant="default" className="p-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-brand-blue text-white flex items-center justify-center text-xl font-semibold">
                        {selectedStudent.initials}
                      </div>
                      <h3 className="font-serif text-xl text-brand-blue">{selectedStudent.name}</h3>
                      
                      <ReadingGoalRing
                        progress={selectedStudent.minutes + minutes}
                        goal={selectedStudent.goal}
                        size={120}
                      />

                      <div className="w-full grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                          <span className="text-xs text-muted-foreground">Current</span>
                          <span className="font-handwritten text-xl text-brand-blue">
                            {selectedStudent.minutes} min
                          </span>
                        </div>
                        <div className="relative flex flex-col items-center rounded-lg bg-muted/50 p-3">
                          <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                          <span className="text-xs text-muted-foreground">After Log</span>
                          <span className="font-handwritten text-xl text-brand-green">
                            {selectedStudent.minutes + minutes} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </BookContainer>

                  {/* Recent History */}
                  <BookContainer variant="warm" className="p-6">
                    <h3 className="font-serif text-lg text-brand-blue mb-3">Recent Reading</h3>
                    <div className="space-y-2">
                      {mockRecentHistory.map((entry, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-background/80">
                          <BookOpen className="h-4 w-4 text-brand-blue shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{entry.bookTitle}</p>
                            <p className="text-xs text-muted-foreground">{entry.date}</p>
                          </div>
                          <span className="font-handwritten text-brand-blue">{entry.minutes}m</span>
                        </div>
                      ))}
                    </div>
                  </BookContainer>
                </>
              ) : isBulkMode && selectedStudents.length > 0 ? (
                <BookContainer variant="default" className="p-6">
                  <h3 className="font-serif text-xl text-brand-blue mb-4">
                    {selectedStudents.length} Students Selected
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4">
                      <span className="text-sm text-muted-foreground">Each student will log</span>
                      <span className="font-handwritten text-3xl text-brand-blue">{minutes} min</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-brand-green/10 p-4">
                      <span className="text-sm text-muted-foreground">Total minutes logged</span>
                      <span className="font-handwritten text-3xl text-brand-green">
                        {minutes * selectedStudents.length} min
                      </span>
                    </div>
                  </div>
                </BookContainer>
              ) : (
                <BookContainer variant="default" className="p-6">
                  <div className="text-center text-muted-foreground py-8">
                    <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Select a student to see their progress</p>
                  </div>
                </BookContainer>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherLogReadingPage;
