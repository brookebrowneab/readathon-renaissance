import { Card, CardContent } from "@/components/ui/card";
import { User, Users, School } from "lucide-react";
import { cn } from "@/lib/utils";

export type SponsorType = "my-children" | "another-child" | "entire-class";

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
    type: "another-child" as SponsorType,
    icon: Users,
    title: "Another Child",
    description: "Support a child in the program",
  },
  {
    type: "entire-class" as SponsorType,
    icon: School,
    title: "Entire Class",
    description: "Pool your pledge for an entire class",
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

      <div className="grid gap-4 md:grid-cols-3">
        {sponsorTypes.map(({ type, icon: Icon, title, description }) => {
          const isDisabled = type === "my-children" && !hasChildren;
          
          return (
            <Card
              key={type}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedType === type && "ring-2 ring-primary",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isDisabled && onSelect(type)}
            >
              <CardContent className="p-6 text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
                {isDisabled && (
                  <p className="text-xs text-destructive mt-2">
                    You need to add children first
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
