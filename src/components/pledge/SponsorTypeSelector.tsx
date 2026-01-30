import { Card, CardContent } from "@/components/ui/card";
import { User, Users, School } from "lucide-react";
import { cn } from "@/lib/utils";

export type SponsorType = "my-children" | "another-child" | "support-classroom";

interface SponsorTypeSelectorProps {
  selectedType: SponsorType | null;
  onSelect: (type: SponsorType) => void;
  hasChildren: boolean;
  isSponsorOnly?: boolean;
}

const sponsorTypes = [
  {
    type: "my-children" as SponsorType,
    icon: User,
    title: "My Children",
    description: "Sponsor your own child's reading journey",
  },
  {
    type: "another-child" as SponsorType,
    icon: Users,
    title: "Another Child",
    description: "Support a child in the program",
  },
  {
    type: "support-classroom" as SponsorType,
    icon: School,
    title: "Support a Classroom",
    description: "Make a general donation to support a class",
  },
];

export function SponsorTypeSelector({
  selectedType,
  onSelect,
  hasChildren,
  isSponsorOnly = false,
}: SponsorTypeSelectorProps) {
  // Override labels for sponsor-only users
  const getLabel = (type: SponsorType, defaultTitle: string) => {
    if (isSponsorOnly && type === "another-child") {
      return "Sponsor a Student";
    }
    return defaultTitle;
  };

  const getDescription = (type: SponsorType, defaultDesc: string) => {
    if (isSponsorOnly && type === "another-child") {
      return "Support a student's reading journey";
    }
    return defaultDesc;
  };
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Who would you like to sponsor?</h2>
        <p className="text-muted-foreground">Choose how you'd like to support reading</p>
      </div>

      <div className={cn(
        "grid gap-4",
        hasChildren ? "md:grid-cols-3" : "md:grid-cols-2"
      )}>
        {sponsorTypes
          .filter(({ type }) => {
            // Hide "My Children" option entirely if user has no children
            if (type === "my-children" && !hasChildren) return false;
            return true;
          })
          .map(({ type, icon: Icon, title, description }) => {
            return (
              <Card
                key={type}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedType === type && "ring-2 ring-primary"
                )}
                onClick={() => onSelect(type)}
              >
                <CardContent className="p-6 text-center">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{getLabel(type, title)}</h3>
                  <p className="text-sm text-muted-foreground">{getDescription(type, description)}</p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
