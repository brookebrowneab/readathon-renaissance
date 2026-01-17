import { useState, useRef } from "react";
import { format } from "date-fns";
import AdminPageLayout from "@/components/layout/AdminPageLayout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Save,
  AlertTriangle,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  Upload,
  Plus,
  X,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Teacher {
  id: string;
  name: string;
  grade: string;
}

const GRADES = ["Pre-K", "Kindergarten", "1st", "2nd", "3rd", "4th", "5th"];

const AdminSettingsPage = () => {
  // Event details
  const [eventName, setEventName] = useState("Spring Read-a-thon 2024");
  const [schoolName, setSchoolName] = useState("Lincoln Elementary");
  const [startDate, setStartDate] = useState<Date>(new Date("2024-12-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2025-01-15"));
  const [goalMinutes, setGoalMinutes] = useState("500");
  const [eventStatus, setEventStatus] = useState<"active" | "paused" | "ended">("active");

  // Payment settings
  const [paymentAddress, setPaymentAddress] = useState(
    "Lincoln Elementary PTA\nRead-a-thon Fund\n123 School Street\nAnytown, ST 12345"
  );
  const [acceptChecks, setAcceptChecks] = useState(true);
  const [acceptCards, setAcceptCards] = useState(true);

  // Email settings
  const [sendReminders, setSendReminders] = useState(true);
  const [reminderDays, setReminderDays] = useState("7");

  // Teachers & Grades
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: "1", name: "Mrs. Johnson", grade: "Kindergarten" },
    { id: "2", name: "Mr. Smith", grade: "1st" },
    { id: "3", name: "Ms. Davis", grade: "2nd" },
    { id: "4", name: "Mrs. Wilson", grade: "3rd" },
    { id: "5", name: "Mr. Brown", grade: "4th" },
  ]);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherGrade, setNewTeacherGrade] = useState("");
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialogs
  const [showEndEventDialog, setShowEndEventDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<Teacher[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Event settings saved successfully!");
  };

  const handleEndEvent = async () => {
    setEventStatus("ended");
    setShowEndEventDialog(false);
    toast.success("Event has been ended. Payment collection emails will be sent.");
  };

  const handlePauseResume = () => {
    if (eventStatus === "active") {
      setEventStatus("paused");
      toast.success("Event paused. Students can still log reading.");
    } else if (eventStatus === "paused") {
      setEventStatus("active");
      toast.success("Event resumed!");
    }
  };

  const getStatusBadge = () => {
    switch (eventStatus) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "paused":
        return <Badge variant="warning">Paused</Badge>;
      case "ended":
        return <Badge variant="secondary">Ended</Badge>;
    }
  };

  // Teacher management functions
  const handleAddTeacher = () => {
    if (!newTeacherName.trim() || !newTeacherGrade) {
      toast.error("Please enter teacher name and select a grade");
      return;
    }
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      name: newTeacherName.trim(),
      grade: newTeacherGrade,
    };
    setTeachers([...teachers, newTeacher]);
    setNewTeacherName("");
    setNewTeacherGrade("");
    setShowAddTeacher(false);
    toast.success(`Added ${newTeacher.name}`);
  };

  const handleRemoveTeacher = (id: string) => {
    const teacher = teachers.find((t) => t.id === id);
    setTeachers(teachers.filter((t) => t.id !== id));
    toast.success(`Removed ${teacher?.name}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());
      
      // Skip header row if present
      const startIndex = lines[0]?.toLowerCase().includes("teacher") || 
                         lines[0]?.toLowerCase().includes("name") ? 1 : 0;
      
      const parsed: Teacher[] = [];
      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.trim().replace(/"/g, ""));
        if (parts.length >= 2) {
          const [name, grade] = parts;
          if (name && GRADES.includes(grade)) {
            parsed.push({
              id: Date.now().toString() + i,
              name,
              grade,
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

  const handleConfirmUpload = (replace: boolean) => {
    if (replace) {
      setTeachers(pendingUpload);
      toast.success(`Replaced with ${pendingUpload.length} teachers`);
    } else {
      setTeachers([...teachers, ...pendingUpload]);
      toast.success(`Added ${pendingUpload.length} teachers`);
    }
    setPendingUpload([]);
    setShowUploadPreview(false);
  };

  const downloadTemplate = () => {
    const csv = "Teacher Name,Grade\nMrs. Smith,Kindergarten\nMr. Johnson,1st\nMs. Davis,2nd";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teachers_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const teachersByGrade = GRADES.reduce((acc, grade) => {
    acc[grade] = teachers.filter((t) => t.grade === grade);
    return acc;
  }, {} as Record<string, Teacher[]>);

  return (
    <AdminPageLayout
      title="Event Settings"
      subtitle={<span className="flex items-center gap-2">{eventName} {getStatusBadge()}</span>}
      actions={
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      }
    >
      <div className="max-w-3xl">
        <div className="space-y-8">
            {/* Event Details */}
            <BookContainer variant="default" className="p-6">
              <h2 className="font-medium text-foreground mb-6">Event Details</h2>

              <div className="space-y-4">
                <FormField label="Event Name" htmlFor="eventName" required>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </FormField>

                <FormField label="School Name" htmlFor="schoolName" required>
                  <Input
                    id="schoolName"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </FormField>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Start Date" htmlFor="startDate" required>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormField>

                  <FormField label="End Date" htmlFor="endDate" required>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => date && setEndDate(date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormField>
                </div>

                <FormField
                  label="Default Reading Goal (minutes)"
                  htmlFor="goalMinutes"
                  helperText="Students can have individual goals set by parents"
                  required
                >
                  <Input
                    id="goalMinutes"
                    type="number"
                    value={goalMinutes}
                    onChange={(e) => setGoalMinutes(e.target.value)}
                    min={1}
                  />
                </FormField>
              </div>
            </BookContainer>

            {/* Payment Settings */}
            <BookContainer variant="default" className="p-6">
              <h2 className="font-medium text-foreground mb-6">Payment Settings</h2>

              <div className="space-y-4">
                <FormField
                  label="Check Mailing Address"
                  htmlFor="paymentAddress"
                  helperText="This address will be shown to sponsors who choose to pay by check"
                >
                  <Textarea
                    id="paymentAddress"
                    value={paymentAddress}
                    onChange={(e) => setPaymentAddress(e.target.value)}
                    rows={4}
                  />
                </FormField>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <Label htmlFor="acceptCards" className="font-medium">Accept Card Payments</Label>
                    <p className="text-sm text-muted-foreground">Allow sponsors to pay online</p>
                  </div>
                  <Switch
                    id="acceptCards"
                    checked={acceptCards}
                    onCheckedChange={setAcceptCards}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <Label htmlFor="acceptChecks" className="font-medium">Accept Check Payments</Label>
                    <p className="text-sm text-muted-foreground">Allow sponsors to mail checks</p>
                  </div>
                  <Switch
                    id="acceptChecks"
                    checked={acceptChecks}
                    onCheckedChange={setAcceptChecks}
                  />
                </div>
              </div>
            </BookContainer>

            {/* Email Settings */}
            <BookContainer variant="default" className="p-6">
              <h2 className="font-medium text-foreground mb-6">Email Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <Label htmlFor="sendReminders" className="font-medium">Send Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Automatically remind sponsors about outstanding pledges</p>
                  </div>
                  <Switch
                    id="sendReminders"
                    checked={sendReminders}
                    onCheckedChange={setSendReminders}
                  />
                </div>

                {sendReminders && (
                  <FormField
                    label="Send reminder after (days)"
                    htmlFor="reminderDays"
                    helperText="Days after event ends before sending automatic reminders"
                  >
                    <Input
                      id="reminderDays"
                      type="number"
                      value={reminderDays}
                      onChange={(e) => setReminderDays(e.target.value)}
                      min={1}
                      max={30}
                      className="max-w-[120px]"
                    />
                  </FormField>
                )}
              </div>
            </BookContainer>

            {/* Teachers & Grades */}
            <BookContainer variant="default" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-medium text-foreground">Teachers & Grades</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} configured
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
                  <Button size="sm" onClick={() => setShowAddTeacher(true)}>
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

              {/* Add Teacher Form */}
              {showAddTeacher && (
                <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                  <div className="flex items-end gap-3">
                    <FormField label="Teacher Name" htmlFor="newTeacherName" className="flex-1">
                      <Input
                        id="newTeacherName"
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        placeholder="e.g., Mrs. Smith"
                      />
                    </FormField>
                    <FormField label="Grade" htmlFor="newTeacherGrade" className="w-40">
                      <Select value={newTeacherGrade} onValueChange={setNewTeacherGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                    <Button onClick={handleAddTeacher}>Add</Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowAddTeacher(false);
                        setNewTeacherName("");
                        setNewTeacherGrade("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Teachers by Grade */}
              {teachers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No teachers configured yet.</p>
                  <p className="text-sm mt-1">Upload a CSV or add teachers manually.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {GRADES.map((grade) => {
                    const gradeTeachers = teachersByGrade[grade];
                    if (gradeTeachers.length === 0) return null;
                    return (
                      <div key={grade}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{grade}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {gradeTeachers.length} teacher{gradeTeachers.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {gradeTeachers.map((teacher) => (
                            <div
                              key={teacher.id}
                              className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm"
                            >
                              <span>{teacher.name}</span>
                              <button
                                onClick={() => handleRemoveTeacher(teacher.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </BookContainer>

            {/* Event Controls */}
            <BookContainer variant="default" className="p-6">
              <h2 className="font-medium text-foreground mb-6">Event Controls</h2>

              <div className="space-y-4">
                {eventStatus !== "ended" && (
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">
                        {eventStatus === "active" ? "Pause Event" : "Resume Event"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {eventStatus === "active"
                          ? "Temporarily pause the event (students can still log reading)"
                          : "Resume accepting pledges and normal operation"}
                      </p>
                    </div>
                    <Button variant="outline" onClick={handlePauseResume}>
                      {eventStatus === "active" ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {eventStatus !== "ended" && (
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">End Event</p>
                      <p className="text-sm text-muted-foreground">
                        Close the event and begin payment collection
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="text-warning border-warning hover:bg-warning/10"
                      onClick={() => setShowEndEventDialog(true)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      End Event
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-destructive">Delete Event</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this event and all data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </BookContainer>
          </div>
        </div>

        {/* End Event Dialog */}
      <Dialog open={showEndEventDialog} onOpenChange={setShowEndEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Event?</DialogTitle>
            <DialogDescription>
              This will close the event and begin payment collection. Students will no longer be able to log reading minutes.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 bg-warning/10 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">What happens next:</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Final pledge amounts will be calculated</li>
                  <li>• Payment collection emails will be sent to sponsors</li>
                  <li>• Reading log will be closed</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEndEvent}>
              <CheckCircle className="h-4 w-4 mr-2" />
              End Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All event data including students, pledges, and payment records will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 bg-destructive/10 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-foreground">
                Type <strong>DELETE</strong> to confirm.
              </p>
            </div>
            <Input className="mt-3" placeholder="Type DELETE to confirm" />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Preview Dialog */}
      <Dialog open={showUploadPreview} onOpenChange={setShowUploadPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Teachers</DialogTitle>
            <DialogDescription>
              Found {pendingUpload.length} teachers in the uploaded file. Choose how to import them.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[300px] overflow-auto border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher Name</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUpload.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{teacher.grade}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {teachers.length > 0 && (
            <div className="py-3 px-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                You currently have {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} configured.
                Choose whether to add to the existing list or replace it entirely.
              </p>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPendingUpload([]);
                setShowUploadPreview(false);
              }}
            >
              Cancel
            </Button>
            {teachers.length > 0 && (
              <Button variant="outline" onClick={() => handleConfirmUpload(false)}>
                <Plus className="h-4 w-4 mr-2" />
                Add to Existing
              </Button>
            )}
            <Button onClick={() => handleConfirmUpload(true)}>
              <Upload className="h-4 w-4 mr-2" />
              {teachers.length > 0 ? "Replace All" : "Import Teachers"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

export default AdminSettingsPage;
