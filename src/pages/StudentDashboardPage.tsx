import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Plus,
  Trophy,
  Star,
  Users,
  Clock,
  LogOut,
  Sparkles,
  Heart,
} from "lucide-react";

type TimeUnit = "minutes" | "hours" | "days";

const formatTime = (minutes: number, unit: TimeUnit): string => {
  switch (unit) {
    case "hours":
      return `${(minutes / 60).toFixed(1)} hrs`;
    case "days":
      return `${(minutes / 60 / 24).toFixed(1)} days`;
    default:
      return `${minutes.toLocaleString()} min`;
  }
};

const cycleUnit = (current: TimeUnit): TimeUnit => {
  const order: TimeUnit[] = ["minutes", "hours", "days"];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
};

// Mock data for the student
const mockStudent = {
  firstName: "Emma",
  grade: "3rd Grade",
  avatarInitials: "EJ",
  minutesRead: 245,
  goalMinutes: 300,
  minutesToday: 25,
  booksRead: 8,
  sponsors: 4,
  moneyRaised: 85.50,
  classTotal: 4250,
  gradeTotal: 18500,
  streak: 5,
};

const mockRecentBooks = [
  { id: "1", title: "Charlotte's Web", author: "E.B. White", minutesRead: 120 },
  { id: "2", title: "Diary of a Wimpy Kid", author: "Jeff Kinney", minutesRead: 85 },
  { id: "3", title: "Magic Tree House", author: "Mary Pope Osborne", minutesRead: 40 },
];

const mockLeaderboard = [
  { name: "Emma S.", minutes: 245, isCurrentUser: true },
  { name: "Liam T.", minutes: 220, isCurrentUser: false },
  { name: "Olivia R.", minutes: 195, isCurrentUser: false },
  { name: "Noah P.", minutes: 180, isCurrentUser: false },
  { name: "Ava M.", minutes: 165, isCurrentUser: false },
];

const StudentDashboardPage = () => {
  const [totalTimeUnit, setTotalTimeUnit] = useState<TimeUnit>("minutes");
  const [classUnit, setClassUnit] = useState<TimeUnit>("minutes");
  const [gradeUnit, setGradeUnit] = useState<TimeUnit>("minutes");

  const percentage = Math.round((mockStudent.minutesRead / mockStudent.goalMinutes) * 100);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
                <span className="font-handwritten text-4xl text-brand-blue">Hi,</span>{" "}
                {mockStudent.firstName}! 
                <Sparkles className="inline-block h-6 w-6 text-brand-yellow ml-2" />
              </h1>
              <p className="text-muted-foreground mt-1">
                Keep up the great reading! You're doing amazing!
              </p>
            </div>
            <Link to="/student-login">
              <Button variant="ghost" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Exit Demo
              </Button>
            </Link>
          </div>

          {/* Streak Banner */}
          {mockStudent.streak > 0 && (
            <div className="bg-brand-yellow/20 border border-brand-yellow/30 rounded-xl p-4 flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-full bg-brand-yellow/30 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-brand-yellow" />
              </div>
              <div>
                <p className="font-handwritten text-2xl text-brand-blue">
                  {mockStudent.streak} Day Streak! 🔥
                </p>
                <p className="text-sm text-muted-foreground">
                  You've read every day this week. Keep it up!
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Main Progress Card - Like Emma's Journey */}
            <BookContainer variant="default" className="p-6">
              <div className="flex flex-col items-center gap-4">
                <h2 className="w-full text-left font-serif text-2xl font-normal tracking-tight text-brand-blue md:text-3xl">
                  {mockStudent.firstName}'s Reading
                </h2>
                
                <ReadingGoalRing 
                  progress={mockStudent.minutesRead} 
                  goal={mockStudent.goalMinutes} 
                  size={160} 
                />
                
                {/* Stats Grid */}
                <div className="mt-2 grid w-full grid-cols-2 gap-3">
                  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                    <span className="text-xs text-muted-foreground">Reading Goal</span>
                    <span className="font-handwritten text-xl text-brand-blue">{mockStudent.goalMinutes} min</span>
                  </div>
                  <div 
                    className="relative flex cursor-pointer flex-col items-center rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                    onClick={() => setTotalTimeUnit(cycleUnit(totalTimeUnit))}
                  >
                    <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                    <span className="text-xs text-muted-foreground">Total Time Read</span>
                    <span className="font-handwritten text-xl text-brand-blue">{formatTime(mockStudent.minutesRead, totalTimeUnit)}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                    <span className="text-xs text-muted-foreground">Minutes Today</span>
                    <span className="font-handwritten text-xl text-brand-blue">{mockStudent.minutesToday} min</span>
                  </div>
                  <div 
                    className="relative flex cursor-pointer flex-col items-center rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                    onClick={() => setClassUnit(cycleUnit(classUnit))}
                  >
                    <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                    <span className="text-xs text-muted-foreground">My Class Has Read</span>
                    <span className="font-handwritten text-xl text-brand-blue">{formatTime(mockStudent.classTotal, classUnit)}</span>
                  </div>
                  <div 
                    className="relative flex cursor-pointer flex-col items-center rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                    onClick={() => setGradeUnit(cycleUnit(gradeUnit))}
                  >
                    <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                    <span className="text-xs text-muted-foreground">My Grade Has Read</span>
                    <span className="font-handwritten text-xl text-brand-blue">{formatTime(mockStudent.gradeTotal, gradeUnit)}</span>
                  </div>
                  <div className="relative flex flex-col items-center rounded-lg bg-muted/50 p-3">
                    <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                    <span className="text-xs text-muted-foreground">Money I've Raised</span>
                    <span className="font-handwritten text-xl text-brand-green">${mockStudent.moneyRaised.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                    <span className="text-xs text-muted-foreground">My Sponsors</span>
                    <span className="font-handwritten text-xl text-brand-blue">{mockStudent.sponsors}</span>
                  </div>
                  <div className="relative flex flex-col items-center rounded-lg bg-muted/50 p-3">
                    <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                    <span className="text-xs text-muted-foreground">Books I've Read</span>
                    <span className="font-handwritten text-xl text-brand-blue">{mockStudent.booksRead}</span>
                  </div>
                </div>

                {/* Log Reading Button */}
                <Button className="w-full mt-4 h-14 text-lg bg-brand-blue text-white hover:bg-brand-blue/90" asChild>
                  <Link to="/student-log-reading">
                    <Plus className="h-5 w-5 mr-2" />
                    Log My Reading
                  </Link>
                </Button>
              </div>
            </BookContainer>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Class Leaderboard */}
              <BookContainer variant="warm" className="p-6">
                <h3 className="font-serif text-xl text-brand-blue mb-4">Class Leaderboard</h3>
                <div className="space-y-3">
                  {mockLeaderboard.map((student, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 rounded-lg p-3 ${
                        student.isCurrentUser 
                          ? "bg-brand-blue/10 border border-brand-blue/20" 
                          : "bg-background/80"
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        index === 0 
                          ? "bg-brand-yellow text-foreground" 
                          : index === 1 
                          ? "bg-gray-300 text-foreground" 
                          : index === 2 
                          ? "bg-amber-600 text-white" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${student.isCurrentUser ? "text-brand-blue" : "text-foreground"}`}>
                          {student.name} {student.isCurrentUser && "(You!)"}
                        </p>
                      </div>
                      <span className="font-handwritten text-lg text-brand-blue">
                        {student.minutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </BookContainer>

              {/* Recent Books */}
              <BookContainer variant="default" className="p-6">
                <h3 className="font-serif text-xl text-brand-blue mb-4">My Books</h3>
                <div className="space-y-3">
                  {mockRecentBooks.map((book) => (
                    <div 
                      key={book.id} 
                      className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                    >
                      <div className="h-10 w-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-brand-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{book.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                      </div>
                      <span className="font-handwritten text-lg text-brand-blue shrink-0">
                        {book.minutesRead} min
                      </span>
                    </div>
                  ))}
                </div>
              </BookContainer>

              {/* Encouragement Card */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20">
                <Heart className="h-5 w-5 text-brand-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="font-handwritten text-xl text-brand-blue">You're a Reading Star! ⭐</p>
                  <p className="text-sm text-muted-foreground">
                    Just {mockStudent.goalMinutes - mockStudent.minutesRead} more minutes to reach your goal!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border lg:hidden z-40">
          <Button className="w-full h-14 text-lg bg-brand-blue text-white hover:bg-brand-blue/90" asChild>
            <Link to="/student-log-reading">
              <Plus className="h-5 w-5 mr-2" />
              Log My Reading
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboardPage;
