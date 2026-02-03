import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReadingGoalRing } from "@/components/legacy";
import { User, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChildSelectorProps {
  children: Array<{
    id: string;
    display_name: string;
    grade_info: string | null;
    class_name: string | null;
    total_minutes: number;
    goal_minutes: number;
    teacher_name?: string | null;
    source?: "public" | "invited";
  }>;
  selectedChildId: string | null;
  onSelect: (childId: string) => void;
  title?: string;
  subtitle?: string;
  showSource?: boolean;
}

export function ChildSelector({
  children,
  selectedChildId,
  onSelect,
  title = "Select a Child",
  subtitle,
  showSource = false,
}: ChildSelectorProps) {
  if (children.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="font-medium text-lg mb-2">No children available</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          There are no children available to sponsor at this time. Children need to have public sharing enabled or you need a direct invitation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {children.map((child) => {
          const displayName = child.display_name;
          const progress = Math.round((child.total_minutes / child.goal_minutes) * 100);

          return (
            <Card
              key={child.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedChildId === child.id && "ring-2 ring-primary"
              )}
              onClick={() => onSelect(child.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <ReadingGoalRing
                    progress={child.total_minutes}
                    goal={child.goal_minutes}
                    size={64}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{displayName}</h3>
                      {showSource && child.source === "invited" && (
                        <Badge variant="secondary" className="shrink-0">
                          <Mail className="h-3 w-3 mr-1" />
                          Invited
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {child.grade_info || "Grade not specified"}
                    </p>
                    {child.teacher_name && (
                      <p className="text-xs text-muted-foreground">
                        {child.teacher_name}'s class
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {progress}% of goal • {child.total_minutes.toLocaleString()} min read
                    </p>
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
