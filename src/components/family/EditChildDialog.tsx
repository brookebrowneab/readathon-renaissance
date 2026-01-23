import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Link as LinkIcon } from "lucide-react";

export interface ChildProfile {
  id: string;
  name: string;
  gradeInfo: string;
  className: string;
  goalMinutes: number;
  sharePublicLink: boolean;
}

interface EditChildDialogProps {
  child: ChildProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (child: ChildProfile) => void;
}

const gradeOptions = [
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
];

export const EditChildDialog = ({
  child,
  open,
  onOpenChange,
  onSave,
}: EditChildDialogProps) => {
  const [formData, setFormData] = useState<ChildProfile | null>(null);

  // Sync form data when child changes
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && child) {
      setFormData({ ...child });
    }
    onOpenChange(isOpen);
  };

  if (!formData && open && child) {
    setFormData({ ...child });
  }

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  const updateField = <K extends keyof ChildProfile>(
    field: K,
    value: ChildProfile[K]
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Child Profile
          </DialogTitle>
          <DialogDescription>
            Update {child?.name}'s profile information and sharing settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Information Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile Information
            </h4>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Child's Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter child's name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select
                    value={formData.gradeInfo}
                    onValueChange={(value) => updateField("gradeInfo", value)}
                  >
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="goalMinutes">Reading Goal (mins)</Label>
                  <Input
                    id="goalMinutes"
                    type="number"
                    min={30}
                    max={1000}
                    value={formData.goalMinutes}
                    onChange={(e) =>
                      updateField("goalMinutes", parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="className">Teacher/Classroom</Label>
                <Input
                  id="className"
                  value={formData.className}
                  onChange={(e) => updateField("className", e.target.value)}
                  placeholder="e.g., Mrs. Peterson's Class"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Sharing Settings Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Sharing
            </h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shareLink" className="text-sm font-normal">
                  Share Public Link
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow sponsors to view progress via a shareable link
                </p>
              </div>
              <Switch
                id="shareLink"
                checked={formData.sharePublicLink}
                onCheckedChange={(checked) =>
                  updateField("sharePublicLink", checked)
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
