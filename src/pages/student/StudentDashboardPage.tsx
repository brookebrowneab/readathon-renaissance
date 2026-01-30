import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ClassFundraisingStack } from "@/components/ui/class-fundraising-stack";
import { Heart, BookOpen, LogOut, Sparkles } from "lucide-react";

interface StudentData {
  firstName: string;
  readingGoal: number;
  minutesRead: number;
}

interface ReadingLog {
  id: string;
  date: string;
  minutes: number;
  bookTitle?: string;
}

// Mock data
const getMockRecentLogs = (): ReadingLog[] => [
  { id: "1", date: "Today", minutes: 25, bookTitle: "Charlotte's Web" },
  { id: "2", date: "Yesterday", minutes: 30, bookTitle: "Charlotte's Web" },
  { id: "3", date: "Monday", minutes: 20 },
  { id: "4", date: "Sunday", minutes: 15, bookTitle: "Diary of a Wimpy Kid" },
];

const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [recentLogs] = useState(getMockRecentLogs);
  useEffect(() => {
    const stored = sessionStorage.getItem("studentData");
    if (stored) {
      const data = JSON.parse(stored);
      setStudentData(data);
    } else {
      // Demo data if not logged in
      setStudentData({
        firstName: "Emma",
        readingGoal: 500,
        minutesRead: 247,
      });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("studentData");
    navigate("/student/login");
  };

  if (!studentData) return null;

  const percentage = Math.round((studentData.minutesRead / studentData.readingGoal) * 100);
  const sponsorCount = 5; // Mock

  const getMilestoneMessage = () => {
    if (percentage >= 100) return { text: "YOU DID IT! 🎉", color: "text-success" };
    if (percentage >= 75) return { text: "So close! ✨", color: "text-brand-blue" };
    if (percentage >= 50) return { text: "Halfway there! 🌟", color: "text-brand-blue" };
    if (percentage >= 25) return { text: "Great start! ⭐", color: "text-brand-yellow" };
    return { text: "Keep reading!", color: "text-muted-foreground" };
  };

  const milestone = getMilestoneMessage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-yellow/20 to-background-warm">
      <PageHeader
        rightContent={
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            Exit
          </Button>
        }
      />

      <main className="px-4 pb-8 space-y-6 max-w-lg mx-auto">
        {/* Welcome */}
        <div className="text-center">
          <h1 className="font-handwritten text-4xl text-brand-blue">
            Hi, {studentData.firstName}! 📚
          </h1>
        </div>

        {/* Hero Progress */}
        <BookContainer variant="default" className="p-8">
          <div className="flex flex-col items-center space-y-4">
            {/* Reading Ring + Class Fundraising Stack */}
            <div className="flex items-center justify-center gap-6 w-full">
              <ReadingGoalRing
                progress={studentData.minutesRead}
                goal={studentData.readingGoal}
                size={200}
                mobileSize={180}
              />
              
              <ClassFundraisingStack
                fundedAmount={420} // TODO: Connect to real data
                goalAmount={1000}
                classLabel="Class Goal"
                rewardLabel="Ice Cream Party! 🍦"
                size="md"
              />
            </div>

            <div className="text-center space-y-2">
              <p className="font-handwritten text-5xl text-brand-blue">
                {studentData.minutesRead} minutes!
              </p>
              <p className={`text-2xl font-medium ${milestone.color}`}>
                {milestone.text}
              </p>
            </div>
          </div>
        </BookContainer>

        {/* Sponsors Cheering */}
        <div className="text-center py-4">
          <p className="text-xl text-muted-foreground mb-3">
            <strong className="text-foreground">{sponsorCount} people</strong> are cheering you on!
          </p>
          <div className="flex justify-center gap-2">
            {Array.from({ length: sponsorCount }).map((_, i) => (
              <Heart
                key={i}
                className="h-8 w-8 text-destructive fill-destructive animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Big CTA */}
        <Button
          asChild
          className="w-full h-[72px] text-2xl font-bold bg-brand-yellow hover:bg-accent-hover text-foreground shadow-lg"
        >
          <Link to="/student/log">
            <Sparkles className="h-8 w-8 mr-3" />
            I Read Today!
          </Link>
        </Button>

        {/* Recent Reading */}
        <BookContainer variant="warm" className="p-6">
          <h2 className="font-serif text-xl text-brand-blue mb-4">
            Your reading this week
          </h2>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 bg-card rounded-lg"
              >
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6 text-brand-blue" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-lg text-foreground">
                    {log.minutes} minutes
                  </p>
                  <p className="text-muted-foreground">
                    {log.date} {log.bookTitle && `• ${log.bookTitle}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </BookContainer>
      </main>
    </div>
  );
};

export default StudentDashboardPage;