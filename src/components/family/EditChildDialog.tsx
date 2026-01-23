import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
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
import { User, Link as LinkIcon, Loader2, KeyRound, RefreshCw } from "lucide-react";
import type { Child, ChildUpdate } from "@/hooks/useChildren";

export interface ChildProfile {
  id: string;
  name: string;
  gradeInfo: string;
  className: string;
  goalMinutes: number;
  sharePublicLink: boolean;
  studentPin: string | null;
}

interface EditChildDialogProps {
  child: Child | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: ChildUpdate) => void;
  isSaving?: boolean;
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
  isSaving = false,
}: EditChildDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    gradeInfo: "",
    className: "",
    goalMinutes: 300,
    sharePublicLink: true,
    studentPin: "",
  });

  // Generate random 4-digit PIN
  const generatePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    updateField("studentPin", pin);
    toast.success("New PIN generated!");
  };

  // Sync form data when child changes or dialog opens
  useEffect(() => {
    if (open && child) {
      setFormData({
        name: child.name,
        gradeInfo: child.grade_info || "",
        className: child.class_name || "",
        goalMinutes: child.goal_minutes,
        sharePublicLink: child.share_public_link,
        studentPin: child.student_pin || "",
      });
    }
  }, [open, child]);

  const handleSave = () => {
    if (child) {
      onSave({
        id: child.id,
        name: formData.name,
        grade_info: formData.gradeInfo || null,
        class_name: formData.className || null,
        goal_minutes: formData.goalMinutes,
        share_public_link: formData.sharePublicLink,
        student_pin: formData.studentPin || null,
      });
    }
  };

  const handlePinChange = (value: string) => {
    // Only allow digits, max 6 characters
    const sanitized = value.replace(/\D/g, "").slice(0, 6);
    updateField("studentPin", sanitized);
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!child) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Child Profile
          </DialogTitle>
          <DialogDescription>
            Update {child.name}'s profile information and sharing settings.
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

          {/* Student Login PIN Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Student Login PIN
            </h4>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Set a 4-6 digit PIN so {child.name} can log their own reading at{" "}
                <span className="font-medium">/student/login</span>
              </p>
              
              <div className="flex items-center gap-2">
                <Input
                  id="studentPin"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter 4-6 digit PIN"
                  value={formData.studentPin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  className="text-center text-lg tracking-widest font-mono flex-1"
                  maxLength={6}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePin}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Generate
                </Button>
              </div>
              
              {formData.studentPin && formData.studentPin.length >= 4 && (
                <p className="text-xs text-success">
                  ✓ PIN set! {child.name} can log in at /student/login
                </p>
              )}
              {formData.studentPin && formData.studentPin.length < 4 && formData.studentPin.length > 0 && (
                <p className="text-xs text-warning">
                  PIN must be at least 4 digits
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Sharing Settings Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Sponsor Link Access
            </h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shareLink" className="text-sm font-normal">
                  Allow Public Signups
                </Label>
                <p className="text-xs text-muted-foreground">
                  Anyone with the link can sign up as a sponsor (no invitation needed)
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

            {formData.sharePublicLink ? (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Input
                  readOnly
                  value={`${window.location.origin}/sponsor/${child.id}`}
                  className="text-xs bg-background"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/sponsor/${child.id}`);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  Copy
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic p-3 bg-muted/30 rounded-lg">
                When disabled, sponsors will need a direct invitation from your family to pledge.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
