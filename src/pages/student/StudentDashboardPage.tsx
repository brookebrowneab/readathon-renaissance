import { Link } from "react-router-dom";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ClassProgressCard } from "@/components/classroom/ClassProgressCard";
import { Heart, BookOpen, LogOut, Sparkles, Target } from "lucide-react";
import { useClassMilestoneStatus } from "@/hooks/useClassMilestoneStatus";
import { useClassReadingStats } from "@/hooks/useClassReadingStats";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useStudentSession } from "@/hooks/useStudentSession";
import { useReadingLogs } from "@/hooks/useReadingLogs";
import type { ReadingLog } from "@/hooks/useReadingLogs";

const StudentDashboardPage = () => {
  const { session, isLoading, logout, requireAuth } = useStudentSession();
  const { data: activeEvent } = useActiveEvent();

  // Redirect if not authenticated
  requireAuth();

  // Get milestone status for the student's class
  const { data: milestoneStatus } = useClassMilestoneStatus(
    session?.className,
    activeEvent?.id
  );
  const { data: classStats } = useClassReadingStats(session?.className);

  // Fetch recent reading logs for this student
  const { logs: recentLogs } = useReadingLogs(session?.childId);

  if (isLoading || !session) return null;

  const percentage = Math.round((session.totalMinutes / session.goalMinutes) * 100);
  const sponsorCount = 5; // TODO: fetch real sponsor count

  const getMilestoneMessage = () => {
    if (percentage >= 100) return { text: "YOU DID IT! 🎉", color: "text-success" };
    if (percentage >= 75) return { text: "So close! ✨", color: "text-brand-blue" };
    if (percentage >= 50) return { text: "Halfway there! 🌟", color: "text-brand-blue" };
    if (percentage >= 25) return { text: "Great start! ⭐", color: "text-brand-yellow" };
    return { text: "Keep reading!", color: "text-muted-foreground" };
  };

  const milestone = getMilestoneMessage();
  const firstName = session.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-yellow/20 to-background-warm">
      <PageHeader
        rightContent={
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-5 w-5 mr-2" />
            Exit
          </Button>
        }
      />

      <main className="px-4 pb-8 space-y-6 max-w-lg mx-auto md:mt-[15px] lg:mt-0">
        {/* Welcome */}
        <div className="text-center">
          <h1 className="font-handwritten text-4xl text-brand-blue">
            Hi, {firstName}! 📚
          </h1>
        </div>

        {/* Hero Progress */}
        <BookContainer variant="default" className="p-8 md:mt-[15px] lg:mt-0">
          <div className="flex flex-col items-center space-y-4">
            <ReadingGoalRing
              progress={session.totalMinutes}
              goal={session.goalMinutes}
              size={200}
              mobileSize={180}
            />

            <div className="text-center space-y-2">
              <p className="font-serif text-5xl text-brand-blue">
                {session.totalMinutes} minutes!
              </p>
              <p className={`text-2xl font-medium ${milestone.color}`}>
                {milestone.text}
              </p>
            </div>
          </div>
        </BookContainer>
        
        {/* Class Progress toward Party */}
        {session.className && milestoneStatus && (
          <BookContainer variant="warm" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl text-brand-blue">
                Help Your Class Earn More!
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Class has earned</span>
                <span className="text-2xl font-bold text-success">
                  ${milestoneStatus.total_unlocked.toFixed(0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Class total minutes</span>
                <span className="text-lg font-medium">
                  {(classStats?.total_minutes || 0).toLocaleString()}
                </span>
              </div>
              
              {milestoneStatus.next_milestone_minutes && milestoneStatus.next_milestone_amount && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Next milestone</p>
                  <p className="text-lg font-bold text-primary">
                    Read {((milestoneStatus.next_milestone_minutes) - (classStats?.total_minutes || 0)).toLocaleString()} more minutes
                  </p>
                  <p className="text-sm mt-1">
                    to unlock <span className="font-bold text-success">${milestoneStatus.next_milestone_amount.toFixed(0)}</span> more for your class party!
                  </p>
                </div>
              )}
              
              {!milestoneStatus.next_milestone_minutes && milestoneStatus.total_unlocked > 0 && (
                <div className="mt-4 p-4 bg-success/10 rounded-lg text-center">
                  <p className="text-lg font-bold text-success">🎉 All milestones reached!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Keep reading to help your class earn even more!
                  </p>
                </div>
              )}
            </div>
          </BookContainer>
        )}

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
            {(recentLogs || []).slice(0, 5).map((log) => (
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
                    {new Date(log.logged_at).toLocaleDateString()} {log.book_title && `• ${log.book_title}`}
                  </p>
                </div>
              </div>
            ))}
            {(!recentLogs || recentLogs.length === 0) && (
              <p className="text-muted-foreground text-center py-4">
                No reading logged yet. Tap "I Read Today!" to get started!
              </p>
            )}
          </div>
        </BookContainer>
      </main>
    </div>
  );
};

export default StudentDashboardPage;
