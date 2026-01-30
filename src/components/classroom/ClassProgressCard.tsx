import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, DollarSign, Target } from "lucide-react";
import { useClassReadingStats } from "@/hooks/useClassReadingStats";
import { useClassMilestoneStatus } from "@/hooks/useClassMilestoneStatus";
import { Skeleton } from "@/components/ui/skeleton";

interface ClassProgressCardProps {
  className: string;
  teacherName?: string | null;
  eventId?: string | null;
  showFundraising?: boolean;
  milestoneGoal?: number;
  compact?: boolean;
}

export function ClassProgressCard({
  className,
  teacherName,
  eventId,
  showFundraising = true,
  milestoneGoal = 1000,
  compact = false,
}: ClassProgressCardProps) {
  const { data: stats, isLoading: statsLoading } = useClassReadingStats(className);
  const { data: milestone, isLoading: milestoneLoading } = useClassMilestoneStatus(
    className,
    eventId
  );

  const isLoading = statsLoading || milestoneLoading;

  if (isLoading) {
    return (
      <Card className={compact ? "p-4" : ""}>
        <CardHeader className={compact ? "p-0 pb-3" : ""}>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className={compact ? "p-0" : ""}>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMinutes = stats?.total_minutes ?? 0;
  const totalBooks = stats?.total_books ?? 0;
  const studentCount = stats?.student_count ?? 0;
  const totalUnlocked = milestone?.total_unlocked ?? 0;
  const nextMilestoneMinutes = milestone?.next_milestone_minutes;
  const nextMilestoneAmount = milestone?.next_milestone_amount;

  // Progress toward class milestone goal
  const fundraisingProgress = Math.min((totalUnlocked / milestoneGoal) * 100, 100);
  const hasReachedGoal = totalUnlocked >= milestoneGoal;

  // Progress toward next reading milestone
  const readingProgress = nextMilestoneMinutes
    ? Math.min((totalMinutes / nextMilestoneMinutes) * 100, 100)
    : 100;
  const minutesToNextMilestone = nextMilestoneMinutes
    ? Math.max(nextMilestoneMinutes - totalMinutes, 0)
    : 0;

  return (
    <Card className={compact ? "border-0 shadow-none bg-transparent" : ""}>
      {!compact && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="font-serif">{className}</span>
            {teacherName && (
              <span className="text-sm font-normal text-muted-foreground">
                • {teacherName}
              </span>
            )}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-0" : ""}>
        {/* Stats Grid */}
        <div className={`grid gap-4 mb-6 ${compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
          <div className="text-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{totalMinutes.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Minutes Read</p>
          </div>

          <div className="text-center">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-2xl font-bold">{totalBooks}</p>
            <p className="text-xs text-muted-foreground">Books Read</p>
          </div>

          {!compact && (
            <div className="text-center">
              <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-secondary-foreground" />
              </div>
              <p className="text-2xl font-bold">{studentCount}</p>
              <p className="text-xs text-muted-foreground">Readers</p>
            </div>
          )}

          {showFundraising && (
            <div className="text-center">
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <p className="text-2xl font-bold">${totalUnlocked.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </div>
          )}
        </div>

        {/* Fundraising Progress */}
        {showFundraising && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Class Party Progress</span>
              <span className="font-medium">
                ${totalUnlocked.toFixed(0)} / ${milestoneGoal}
              </span>
            </div>
            <Progress value={fundraisingProgress} className="h-3" />
            {hasReachedGoal ? (
              <p className="text-sm text-success font-medium text-center">
                🎉 Goal reached! Class party earned!
              </p>
            ) : (
              <p className="text-xs text-muted-foreground text-center">
                ${(milestoneGoal - totalUnlocked).toFixed(0)} more to unlock class party
              </p>
            )}
          </div>
        )}

        {/* Next Reading Milestone */}
        {nextMilestoneMinutes && nextMilestoneAmount && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Next Milestone</span>
            </div>
            <Progress value={readingProgress} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {minutesToNextMilestone.toLocaleString()} more minutes to unlock ${nextMilestoneAmount.toFixed(0)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
