import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Plus,
  Minus,
  Calendar,
  Keyboard,
  ArrowLeft,
  Sparkles,
  Star,
  CheckCircle,
  PartyPopper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays, isToday, isYesterday } from "date-fns";

// Mock data
const mockStudent = {
  firstName: "Emma",
  currentMinutes: 245,
  goalMinutes: 300,
};

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
  "Minecraft Books",
  "Charlotte's Web",
  "Wonder",
];

const StudentLogReadingPage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [minutes, setMinutes] = useState(15);
  const [bookTitle, setBookTitle] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Calculate preview progress
  const previewProgress = mockStudent.currentMinutes + minutes;
  const previewPercentage = Math.round((previewProgress / mockStudent.goalMinutes) * 100);
  const willReachGoal = previewProgress >= mockStudent.goalMinutes && mockStudent.currentMinutes < mockStudent.goalMinutes;

  // Filter books based on input
  useEffect(() => {
    if (bookTitle.length > 1) {
      const filtered = popularBooks.filter(book =>
        book.toLowerCase().includes(bookTitle.toLowerCase())
      );
      setFilteredBooks(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [bookTitle]);

  const handleMinutesChange = (delta: number) => {
    setMinutes(prev => Math.max(1, Math.min(180, prev + delta)));
  };

  const handlePresetClick = (value: number) => {
    setMinutes(value);
  };

  const getDateLabel = () => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMM d");
  };

  const handleSubmit = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setShowConfetti(false);
    }, 1500);
  };

  const getEncouragingMessage = () => {
    if (minutes >= 60) return "Wow! You're a reading superstar! 🌟";
    if (minutes >= 30) return "Amazing reading session! 📚";
    if (minutes >= 15) return "Great job reading today! ⭐";
    return "Every minute counts! Keep going! 💪";
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm flex items-center justify-center py-8">
          <BookContainer variant="default" className="max-w-md mx-4 p-8">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Success Icon */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-brand-green/20 flex items-center justify-center animate-scale-in">
                  <CheckCircle className="h-14 w-14 text-brand-green" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-brand-yellow animate-pulse" />
                <Star className="absolute -bottom-1 -left-2 h-6 w-6 text-brand-yellow fill-brand-yellow animate-pulse" />
              </div>

              <h1 className="font-handwritten text-4xl text-brand-blue">
                You Did It! 🎉
              </h1>
              
              <p className="text-lg text-muted-foreground">
                You logged <span className="font-handwritten text-2xl text-brand-blue">{minutes} minutes</span> of reading!
              </p>

              {willReachGoal && (
                <div className="p-4 rounded-xl bg-brand-yellow/20 border border-brand-yellow/30">
                  <PartyPopper className="h-8 w-8 text-brand-yellow mx-auto mb-2" />
                  <p className="font-handwritten text-xl text-brand-blue">
                    You reached your goal! 🏆
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 w-full mt-4">
                <Button 
                  size="lg"
                  className="w-full h-14 text-lg bg-brand-blue text-white hover:bg-brand-blue/90"
                  onClick={() => {
                    setIsSubmitted(false);
                    setMinutes(15);
                    setBookTitle("");
                  }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Log More Reading
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full h-12"
                  asChild
                >
                  <Link to="/student">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to My Dashboard
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
      
      <main className="flex-1 bg-background-warm pb-24 lg:pb-8">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#A855F7'][i % 7],
                  width: `${8 + Math.random() * 8}px`,
                  height: `${8 + Math.random() * 8}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '3px',
                }}
              />
            ))}
          </div>
        )}

        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/student">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-handwritten text-3xl text-brand-blue md:text-4xl">
                Log My Reading 📖
              </h1>
              <p className="text-muted-foreground">
                Tell us about your reading today!
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Date Display */}
              <BookContainer variant="warm" className="p-6">
                <h2 className="font-serif text-xl text-brand-blue mb-4">When did you read?</h2>
                <div className="flex gap-3">
                  <Button
                    variant={isToday(date) ? "default" : "outline"}
                    size="lg"
                    className={cn(
                      "flex-1 h-14 text-lg",
                      isToday(date) && "bg-brand-blue text-white hover:bg-brand-blue/90"
                    )}
                    onClick={() => setDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant={isYesterday(date) ? "default" : "outline"}
                    size="lg"
                    className={cn(
                      "flex-1 h-14 text-lg",
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
                          "h-14 w-14",
                          !isToday(date) && !isYesterday(date) && "bg-brand-blue text-white hover:bg-brand-blue/90"
                        )}
                      >
                        <Calendar className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
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
                {!isToday(date) && !isYesterday(date) && (
                  <p className="text-center mt-3 font-handwritten text-lg text-brand-blue">
                    {format(date, "EEEE, MMMM d")}
                  </p>
                )}
              </BookContainer>

              {/* Minutes Input */}
              <BookContainer variant="default" className="p-6">
                <h2 className="font-serif text-xl text-brand-blue mb-4">How long did you read?</h2>
                
                {/* Large Number Display */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full text-2xl font-bold border-2 hover:bg-brand-blue hover:text-white hover:border-brand-blue"
                    onClick={() => handleMinutesChange(-5)}
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  
                  <div className="flex flex-col items-center">
                    <span className="font-handwritten text-7xl text-brand-blue leading-none">
                      {minutes}
                    </span>
                    <span className="text-muted-foreground text-lg">minutes</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full text-2xl font-bold border-2 hover:bg-brand-blue hover:text-white hover:border-brand-blue"
                    onClick={() => handleMinutesChange(5)}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>

                {/* Preset Buttons as Books */}
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => handlePresetClick(15)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      minutes === 15 
                        ? "border-brand-blue bg-brand-blue/10" 
                        : "border-border hover:border-brand-blue/50"
                    )}
                  >
                    <BookOpen className="h-6 w-6 text-brand-blue" />
                    <span className="font-handwritten text-lg text-brand-blue">15</span>
                  </button>
                  <button
                    onClick={() => handlePresetClick(30)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      minutes === 30 
                        ? "border-brand-blue bg-brand-blue/10" 
                        : "border-border hover:border-brand-blue/50"
                    )}
                  >
                    <BookOpen className="h-8 w-8 text-brand-blue" />
                    <span className="font-handwritten text-lg text-brand-blue">30</span>
                  </button>
                  <button
                    onClick={() => handlePresetClick(60)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      minutes === 60 
                        ? "border-brand-blue bg-brand-blue/10" 
                        : "border-border hover:border-brand-blue/50"
                    )}
                  >
                    <BookOpen className="h-10 w-10 text-brand-blue" />
                    <span className="font-handwritten text-lg text-brand-blue">60</span>
                  </button>
                  <button
                    onClick={() => {
                      const custom = prompt("Enter minutes:");
                      if (custom && !isNaN(Number(custom))) {
                        setMinutes(Math.max(1, Math.min(180, Number(custom))));
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      ![15, 30, 60].includes(minutes)
                        ? "border-brand-blue bg-brand-blue/10" 
                        : "border-border hover:border-brand-blue/50"
                    )}
                  >
                    <Keyboard className="h-7 w-7 text-brand-blue" />
                    <span className="font-handwritten text-lg text-brand-blue">?</span>
                  </button>
                </div>
              </BookContainer>

              {/* Book Title */}
              <BookContainer variant="warm" className="p-6">
                <h2 className="font-serif text-xl text-brand-blue mb-4">What did you read?</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  You don't have to fill this in, but it's fun to track your books! 📚
                </p>
                <div className="relative">
                  <Input
                    placeholder="Type a book name..."
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    onFocus={() => bookTitle.length > 1 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="h-12 text-lg"
                  />
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                      {filteredBooks.map((book) => (
                        <button
                          key={book}
                          className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-2"
                          onMouseDown={() => {
                            setBookTitle(book);
                            setShowSuggestions(false);
                          }}
                        >
                          <BookOpen className="h-4 w-4 text-brand-blue shrink-0" />
                          <span>{book}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </BookContainer>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <BookContainer variant="default" className="p-6">
                <h2 className="font-serif text-xl text-brand-blue mb-4 text-center">
                  Your Progress Preview ✨
                </h2>
                
                <div className="flex justify-center mb-6">
                  <ReadingGoalRing 
                    progress={previewProgress} 
                    goal={mockStudent.goalMinutes} 
                    size={180}
                  />
                </div>

                <div className="text-center space-y-3">
                  <p className="text-muted-foreground">
                    This will bring you to
                  </p>
                  <p className="font-handwritten text-3xl text-brand-blue">
                    {previewProgress} minutes
                  </p>
                  <p className="text-muted-foreground">
                    ({previewPercentage}% of your goal!)
                  </p>
                </div>

                {/* Encouraging Message */}
                <div className="mt-6 p-4 rounded-xl bg-brand-yellow/20 border border-brand-yellow/30 text-center">
                  <div className="flex justify-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-brand-yellow fill-brand-yellow" />
                    <Sparkles className="h-5 w-5 text-brand-yellow" />
                    <Star className="h-5 w-5 text-brand-yellow fill-brand-yellow" />
                  </div>
                  <p className="font-handwritten text-xl text-brand-blue">
                    {getEncouragingMessage()}
                  </p>
                </div>

                {willReachGoal && (
                  <div className="mt-4 p-4 rounded-xl bg-brand-green/20 border border-brand-green/30 text-center animate-scale-in">
                    <PartyPopper className="h-8 w-8 text-brand-green mx-auto mb-2" />
                    <p className="font-handwritten text-xl text-brand-green">
                      You'll reach your goal! 🎉
                    </p>
                  </div>
                )}
              </BookContainer>

              {/* Submit Button - Desktop */}
              <div className="hidden lg:block">
                <Button
                  size="lg"
                  className="w-full h-16 text-xl bg-brand-green text-white hover:bg-brand-green/90 shadow-lg"
                  onClick={handleSubmit}
                >
                  <CheckCircle className="h-6 w-6 mr-3" />
                  I Read!
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border lg:hidden z-40">
          <Button
            size="lg"
            className="w-full h-16 text-xl bg-brand-green text-white hover:bg-brand-green/90 shadow-lg"
            onClick={handleSubmit}
          >
            <CheckCircle className="h-6 w-6 mr-3" />
            I Read!
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentLogReadingPage;
