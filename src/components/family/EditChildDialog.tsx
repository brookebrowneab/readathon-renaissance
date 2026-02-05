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
import { User, Link as LinkIcon, Loader2, KeyRound, Eye, EyeOff, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Child, ChildUpdate } from "@/hooks/useChildren";
import { useStudentAuth, useUpdateStudentAuth } from "@/hooks/useStudentAuth";
import { useHomeroomTeachers } from "@/hooks/useTeachers";

export interface ChildProfile {
  id: string;
  name: string;
  gradeInfo: string;
  className: string;
  goalMinutes: number;
  sharePublicLink: boolean;
  studentUsername: string | null;
  studentLoginEnabled: boolean;
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
  const { data: homeroomTeachers = [], isLoading: teachersLoading } = useHomeroomTeachers();
  const { data: studentAuth, isLoading: authLoading } = useStudentAuth(child?.id);
  const updateStudentAuth = useUpdateStudentAuth();
  const [formData, setFormData] = useState({
    name: "",
    gradeInfo: "",
    homeroomTeacherId: "",
    goalMinutes: 300,
    sharePublicLink: true,
    studentUsername: "",
    studentLoginEnabled: false,
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [hasExistingPassword, setHasExistingPassword] = useState(false);

  // Sync form data when child changes or dialog opens
  useEffect(() => {
    if (open && child && !authLoading) {
      setFormData({
        name: child.name,
        gradeInfo: child.grade_info || "",
        homeroomTeacherId: child.homeroom_teacher_id || "",
        goalMinutes: child.goal_minutes,
        sharePublicLink: child.share_public_link,
        studentUsername: studentAuth?.username || "",
        studentLoginEnabled: studentAuth?.login_enabled || false,
      });
      setPassword("");
      setShowPassword(false);
      // We can't directly check password_hash from client (security), 
      // so we infer from whether login is enabled and username exists
      setHasExistingPassword(!!studentAuth?.login_enabled && !!studentAuth?.username);
    }
  }, [open, child, studentAuth, authLoading]);

  const handleSave = async () => {
    if (!child) return;

    // If password is set, call edge function first (also sends username)
    if (password && password.length >= 8) {
      setIsSettingPassword(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please log in to set a password");
          setIsSettingPassword(false);
          return;
        }

        const response = await supabase.functions.invoke("student-set-password", {
          body: { 
            childId: child.id, 
            password,
            username: formData.studentUsername || undefined,
          },
        });

        if (response.error) {
          toast.error(response.error.message || "Failed to set password");
          setIsSettingPassword(false);
          return;
        }

        toast.success("Password updated!");
        setHasExistingPassword(true);
      } catch (err) {
        console.error("Password set error:", err);
        toast.error("Failed to set password");
        setIsSettingPassword(false);
        return;
      }
      setIsSettingPassword(false);
    } else {
      // Update student auth (username and login_enabled) without password
      try {
        await updateStudentAuth.mutateAsync({
          child_id: child.id,
          username: formData.studentUsername || null,
          login_enabled: formData.studentLoginEnabled,
        });
      } catch (err) {
        // Error handled in hook
        return;
      }
    }

    // Get teacher name for class_name field
    const selectedTeacher = homeroomTeachers.find(t => t.id === formData.homeroomTeacherId);
    
    // Save other fields
    onSave({
      id: child.id,
      name: formData.name,
      grade_info: formData.gradeInfo || null,
      class_name: selectedTeacher?.name || null,
      goal_minutes: formData.goalMinutes,
      share_public_link: formData.sharePublicLink,
      homeroom_teacher_id: formData.homeroomTeacherId || null,
    });
  };

  const handleUsernameChange = (value: string) => {
    // Lowercase, no spaces, alphanumeric + underscore only
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
    updateField("studentUsername", sanitized);
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!child) return null;

  const availableTeachers = homeroomTeachers.filter(t => t.is_active);
  const hasValidCredentials = formData.studentUsername.length >= 3 && hasExistingPassword;
  const needsPassword = formData.studentUsername.length >= 3 && !hasExistingPassword && !password;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="homeroomTeacher" className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Homeroom Teacher
                </Label>
                <Select
                  value={formData.homeroomTeacherId}
                  onValueChange={(value) => updateField("homeroomTeacherId", value)}
                  disabled={teachersLoading}
                >
                  <SelectTrigger id="homeroomTeacher">
                    <SelectValue placeholder={teachersLoading ? "Loading..." : "Select homeroom teacher"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {availableTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Student Login Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Student Login
            </h4>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="loginEnabled" className="text-sm font-normal">
                  Enable Student Login
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow {child.name} to log their own reading
                </p>
              </div>
              <Switch
                id="loginEnabled"
                checked={formData.studentLoginEnabled}
                onCheckedChange={(checked) =>
                  updateField("studentLoginEnabled", checked)
                }
              />
            </div>

            {formData.studentLoginEnabled && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <div className="grid gap-2">
                  <Label htmlFor="studentUsername">Username</Label>
                  <Input
                    id="studentUsername"
                    value={formData.studentUsername}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="e.g., emma_reader"
                    className="font-mono"
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">
                    Letters, numbers, and underscores only. 3-20 characters.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">
                    {hasExistingPassword ? "New Password (leave blank to keep current)" : "Password"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={hasExistingPassword ? "••••••••" : "Set a password"}
                      className="pr-10"
                      minLength={4}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters for security. Use something your child can remember.
                  </p>
                </div>

                {formData.studentUsername.length >= 3 && (
                  <div className={`text-xs p-2 rounded ${hasValidCredentials || password.length >= 8 ? "bg-success/10 text-success" : needsPassword ? "bg-warning/10 text-warning" : "bg-muted"}`}>
                    {hasValidCredentials || password.length >= 8 ? (
                      <>✓ {child.name} can log in at <span className="font-mono">/student/login</span> with username "<span className="font-mono">{formData.studentUsername}</span>"</>
                    ) : needsPassword ? (
                      <>⚠ Set a password to enable login</>
                    ) : null}
                  </div>
                )}
              </div>
            )}
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving || isSettingPassword}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isSettingPassword}>
            {(isSaving || isSettingPassword) ? (
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
