import { Card, CardContent } from "@/components/ui/card";
import { ClassFundraisingStack } from "@/components/ui/class-fundraising-stack";
import { Users, School } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassInfo {
  className: string;
  gradeInfo: string | null;
  teacherId: string | null;
  teacherName: string | null;
  studentCount: number;
}

interface ClassSelectorProps {
  classes: ClassInfo[];
  selectedClassName: string | null;
  onSelect: (className: string, teacherId: string | null) => void;
  fundraisingTotals: Record<string, number>;
  milestoneGoal: number;
  milestoneReward?: string | null;
  isLoading?: boolean;
}

export function ClassSelector({
  classes,
  selectedClassName,
  onSelect,
  fundraisingTotals,
  milestoneGoal,
  milestoneReward,
  isLoading = false,
}: ClassSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-32 bg-muted/30" />
          </Card>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <School className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="font-medium text-lg mb-2">No classes available</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          There are no classes available for sponsorship at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Select a Class</h2>
        <p className="text-muted-foreground">
          Choose a class to support with your pledge
        </p>
        {milestoneReward && (
          <p className="text-sm text-muted-foreground mt-1">
            Classes reaching ${milestoneGoal.toLocaleString()} earn: <strong>{milestoneReward}</strong>
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {classes.map((classInfo) => {
          const fundedAmount = fundraisingTotals[classInfo.className] || 0;

          return (
            <Card
              key={classInfo.className}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedClassName === classInfo.className && "ring-2 ring-primary"
              )}
              onClick={() => onSelect(classInfo.className, classInfo.teacherId)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <ClassFundraisingStack
                    fundedAmount={fundedAmount}
                    goalAmount={milestoneGoal}
                    size="sm"
                    showLabel={false}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {classInfo.teacherName 
                        ? `${classInfo.teacherName}'s Class`
                        : classInfo.className}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {classInfo.gradeInfo || "Grade not specified"}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {classInfo.studentCount} students
                      </span>
                      <span className="font-handwritten text-primary">
                        ${fundedAmount.toFixed(0)} / ${milestoneGoal}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
