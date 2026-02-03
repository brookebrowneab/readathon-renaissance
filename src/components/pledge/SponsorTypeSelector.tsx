import { Card, CardContent } from "@/components/ui/card";
import { User, School } from "lucide-react";
import { cn } from "@/lib/utils";
export type SponsorType = "my-children" | "support-classroom";

interface SponsorTypeSelectorProps {
  selectedType: SponsorType | null;
  onSelect: (type: SponsorType) => void;
  hasChildren: boolean;
}

const sponsorTypes = [
  {
    type: "my-children" as SponsorType,
    icon: User,
    title: "My Children",
    description: "Sponsor your own child's reading journey",
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
}: SponsorTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-primary mb-2">Who would you like to sponsor?</h2>
        <p className="text-muted-foreground">Choose how you'd like to support reading</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
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
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
