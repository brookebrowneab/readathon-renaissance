import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Upload,
  Download,
  X,
  FileText,
  Edit,
  Trash2,
  Users,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { handDrawnBorder } from "@/lib/admin-styles";
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  useBulkCreateTeachers,
  useHomeroomTeachers,
  useAddClassAssignment,
  useRemoveClassAssignment,
  useTeacherClassAssignments,
  type Teacher,
  type TeacherType,
  type CreateTeacherInput,
} from "@/hooks/useTeachers";

const TEACHER_TYPES: { value: TeacherType; label: string; description: string }[] = [
  { value: "homeroom", label: "Homeroom Teacher", description: "Primary classroom teacher" },
  { value: "partner", label: "Partner Teacher", description: "Assigned to specific homerooms" },
  { value: "specials", label: "Specials Teacher", description: "Art, music, PE, etc." },
  { value: "staff", label: "Staff", description: "Principal, librarian, admin" },
];

const GRADES = ["Pre-K", "Kindergarten", "1st", "2nd", "3rd", "4th", "5th"];

export function TeacherManagement() {
  const { data: teachers = [], isLoading } = useTeachers();
  const { data: homeroomTeachers = [] } = useHomeroomTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();
  const bulkCreateTeachers = useBulkCreateTeachers();
  const addClassAssignment = useAddClassAssignment();
  const removeClassAssignment = useRemoveClassAssignment();

  // UI state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAssignmentsDialog, setShowAssignmentsDialog] = useState(false);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [pendingUpload, setPendingUpload] = useState<CreateTeacherInput[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formType, setFormType] = useState<TeacherType>("homeroom");
  const [formFullAccess, setFormFullAccess] = useState(false);
  const [selectedHomeroomId, setSelectedHomeroomId] = useState("");

  // Get assignments for selected partner teacher
  const { data: assignments = [] } = useTeacherClassAssignments(
    selectedTeacher?.teacher_type === "partner" ? selectedTeacher.id : undefined
  );

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormType("homeroom");
    setFormFullAccess(false);
  };

  const handleAddTeacher = async () => {
    if (!formName.trim()) {
      toast.error("Please enter a teacher name");
      return;
    }

    try {
      await createTeacher.mutateAsync({
        name: formName.trim(),
        email: formEmail.trim() || undefined,
        teacher_type: formType,
        has_full_access: formFullAccess,
      });
      toast.success(`Added ${formName}`);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleEditTeacher = async () => {
    if (!selectedTeacher || !formName.trim()) return;

    try {
      await updateTeacher.mutateAsync({
        id: selectedTeacher.id,
        name: formName.trim(),
        email: formEmail.trim() || undefined,
        teacher_type: formType,
        has_full_access: formFullAccess,
      });
      toast.success(`Updated ${formName}`);
      setShowEditDialog(false);
      setSelectedTeacher(null);
      resetForm();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;

    try {
      await deleteTeacher.mutateAsync(selectedTeacher.id);
      toast.success(`Removed ${selectedTeacher.name}`);
      setShowDeleteDialog(false);
      setSelectedTeacher(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormName(teacher.name);
    setFormEmail(teacher.email || "");
    setFormType(teacher.teacher_type);
    setFormFullAccess(teacher.has_full_access);
    setShowEditDialog(true);
  };

  const openAssignmentsDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setSelectedHomeroomId("");
    setShowAssignmentsDialog(true);
  };

  const handleAddAssignment = async () => {
    if (!selectedTeacher || !selectedHomeroomId) return;

    try {
      await addClassAssignment.mutateAsync({
        teacherId: selectedTeacher.id,
        homeroomTeacherId: selectedHomeroomId,
      });
      toast.success("Added class assignment");
      setSelectedHomeroomId("");
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!selectedTeacher) return;

    try {
      await removeClassAssignment.mutateAsync({
        assignmentId,
        teacherId: selectedTeacher.id,
      });
      toast.success("Removed class assignment");
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());

      // Skip header row if present
      const startIndex =
        lines[0]?.toLowerCase().includes("teacher") ||
        lines[0]?.toLowerCase().includes("name")
          ? 1
          : 0;

      const parsed: CreateTeacherInput[] = [];
      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.trim().replace(/"/g, ""));
        if (parts.length >= 1) {
          const [name, typeStr, email] = parts;
          const teacherType = (typeStr?.toLowerCase() as TeacherType) || "homeroom";
          const validType = TEACHER_TYPES.find((t) => t.value === teacherType);

          if (name) {
            parsed.push({
              name,
              teacher_type: validType ? teacherType : "homeroom",
              email: email || undefined,
              has_full_access: teacherType === "staff",
            });
          }
        }
      }

      if (parsed.length === 0) {
        toast.error("No valid teacher data found. Please check the CSV format.");
        return;
      }

      setPendingUpload(parsed);
      setShowUploadPreview(true);
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmUpload = async () => {
    try {
      await bulkCreateTeachers.mutateAsync(pendingUpload);
      setPendingUpload([]);
      setShowUploadPreview(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const downloadTemplate = () => {
    const csv =
      "Name,Type,Email\nMrs. Smith,homeroom,smith@school.edu\nMr. Johnson,partner,johnson@school.edu\nMs. Davis,staff,davis@school.edu";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teachers_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeBadge = (type: TeacherType, hasFullAccess: boolean) => {
    const variants: Record<TeacherType, "default" | "secondary" | "outline"> = {
      homeroom: "default",
      partner: "secondary",
      specials: "outline",
      staff: "default",
    };

    return (
      <div className="flex items-center gap-1">
        <Badge variant={variants[type]}>{type}</Badge>
        {hasFullAccess && (
          <Shield className="h-3.5 w-3.5 text-primary" />
        )}
      </div>
    );
  };

  // Group teachers by type
  const teachersByType = TEACHER_TYPES.reduce((acc, type) => {
    acc[type.value] = teachers.filter((t) => t.teacher_type === type.value);
    return acc;
  }, {} as Record<TeacherType, Teacher[]>);

  if (isLoading) {
    return (
      <div className="bg-background p-6" style={handDrawnBorder}>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-background p-6" style={handDrawnBorder}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-medium text-foreground">Teachers & Staff</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {teachers.filter((t) => t.is_active).length} active teacher
              {teachers.filter((t) => t.is_active).length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />

        {teachers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No teachers configured yet.</p>
            <p className="text-sm mt-1">Upload a CSV or add teachers manually.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {TEACHER_TYPES.map((type) => {
              const typeTeachers = teachersByType[type.value];
              if (typeTeachers.length === 0) return null;
              return (
                <div key={type.value}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="font-medium">
                      {type.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {typeTeachers.length} teacher
                      {typeTeachers.length !== 1 ? "s" : ""} • {type.description}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {typeTeachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between px-4 py-2.5 bg-muted/30 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{teacher.name}</span>
                          {teacher.email && (
                            <span className="text-sm text-muted-foreground">
                              {teacher.email}
                            </span>
                          )}
                          {teacher.has_full_access && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Full Access
                            </Badge>
                          )}
                          {!teacher.is_active && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {teacher.teacher_type === "partner" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openAssignmentsDialog(teacher)}
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(teacher)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              setShowDeleteDialog(true);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Teacher Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Teacher</DialogTitle>
            <DialogDescription>
              Add a new teacher or staff member to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField label="Name" htmlFor="teacherName" required>
              <Input
                id="teacherName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Mrs. Smith"
              />
            </FormField>
            <FormField label="Email" htmlFor="teacherEmail">
              <Input
                id="teacherEmail"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="e.g., smith@school.edu"
              />
            </FormField>
            <FormField label="Type" htmlFor="teacherType" required>
              <Select value={formType} onValueChange={(v) => setFormType(v as TeacherType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TEACHER_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            {(formType === "staff" || formType === "specials") && (
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="fullAccess" className="font-medium">
                    Full Access
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Can view all students (e.g., principal, librarian)
                  </p>
                </div>
                <Switch
                  id="fullAccess"
                  checked={formFullAccess}
                  onCheckedChange={setFormFullAccess}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeacher} disabled={createTeacher.isPending}>
              {createTeacher.isPending ? "Adding..." : "Add Teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>Update teacher information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField label="Name" htmlFor="editTeacherName" required>
              <Input
                id="editTeacherName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </FormField>
            <FormField label="Email" htmlFor="editTeacherEmail">
              <Input
                id="editTeacherEmail"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </FormField>
            <FormField label="Type" htmlFor="editTeacherType" required>
              <Select value={formType} onValueChange={(v) => setFormType(v as TeacherType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TEACHER_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            {(formType === "staff" || formType === "specials") && (
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="editFullAccess" className="font-medium">
                    Full Access
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Can view all students
                  </p>
                </div>
                <Switch
                  id="editFullAccess"
                  checked={formFullAccess}
                  onCheckedChange={setFormFullAccess}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTeacher} disabled={updateTeacher.isPending}>
              {updateTeacher.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedTeacher?.name}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeacher}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Class Assignments Dialog (for Partner Teachers) */}
      <Dialog open={showAssignmentsDialog} onOpenChange={setShowAssignmentsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Class Assignments</DialogTitle>
            <DialogDescription>
              Assign {selectedTeacher?.name} to homeroom classes. They'll be able to see
              students from these classes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Select value={selectedHomeroomId} onValueChange={setSelectedHomeroomId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select homeroom teacher" />
                </SelectTrigger>
                <SelectContent>
                  {homeroomTeachers
                    .filter(
                      (t) => !assignments.some((a) => a.homeroom_teacher_id === t.id)
                    )
                    .map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddAssignment}
                disabled={!selectedHomeroomId || addClassAssignment.isPending}
              >
                Add
              </Button>
            </div>

            {assignments.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Assigned Classes:</Label>
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg"
                  >
                    <span>{assignment.homeroom_teacher?.name || "Unknown"}'s Class</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No classes assigned yet.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAssignmentsDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Preview Dialog */}
      <Dialog open={showUploadPreview} onOpenChange={setShowUploadPreview}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Preview Upload</DialogTitle>
            <DialogDescription>
              Found {pendingUpload.length} teachers to import.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto space-y-2 py-4">
            {pendingUpload.map((teacher, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg"
              >
                <span>{teacher.name}</span>
                <Badge variant="outline">{teacher.teacher_type}</Badge>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadPreview(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpload} disabled={bulkCreateTeachers.isPending}>
              {bulkCreateTeachers.isPending ? "Importing..." : "Import All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
