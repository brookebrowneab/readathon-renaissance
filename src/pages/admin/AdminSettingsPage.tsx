import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import AdminPageLayout from "@/components/layout/AdminPageLayout";
import { handDrawnBorder } from "@/lib/admin-styles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Calendar as CalendarIcon,
  Save,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Plus,
  FileText,
  Trophy,
  GraduationCap,
  Globe,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEventSettings } from "@/hooks/useEventSettings";
import { useAvailableGrades } from "@/hooks/useAvailableGrades";
import { EditEventDialog } from "@/components/admin/EditEventDialog";
import { TeacherManagement } from "@/components/admin/TeacherManagement";
import { LogoGenerator } from "@/components/admin/LogoGenerator";

const US_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
];



const AdminSettingsPage = () => {
  const { event, isLoading, updateEvent, endEvent, isUpdating, isEnding } = useEventSettings();
  const { data: availableGrades = [], isLoading: gradesLoading } = useAvailableGrades();
  
  // Event details - initialized from database
  const [eventName, setEventName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [lastLogDate, setLastLogDate] = useState<Date | undefined>();
  const [goalMinutes, setGoalMinutes] = useState("500");
  const [timezone, setTimezone] = useState("America/New_York");

  // Create new event dialog
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  // Payment settings
  const [paymentAddress, setPaymentAddress] = useState("");
  const [acceptChecks, setAcceptChecks] = useState(true);
  const [acceptCards, setAcceptCards] = useState(true);

  // Email settings
  const [sendReminders, setSendReminders] = useState(true);
  const [reminderDays, setReminderDays] = useState("7");

  // Class Milestone settings
  const [classMilestoneEnabled, setClassMilestoneEnabled] = useState(true);
  const [classMilestoneGoal, setClassMilestoneGoal] = useState("1000");
  const [classMilestoneReward, setClassMilestoneReward] = useState("Pizza party for the whole class!");
  
  // Teacher logging settings
  const [teacherLoggingGrades, setTeacherLoggingGrades] = useState<string[]>([]);


  // Dialogs
  const [showEndEventDialog, setShowEndEventDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track event ID to detect actual event changes vs refetches
  const [initializedEventId, setInitializedEventId] = useState<string | null>(null);

  // Initialize form from database (only when event ID changes, not on refetches)
  useEffect(() => {
    if (event && event.id !== initializedEventId) {
      setEventName(event.name);
      setStartDate(parseISO(event.start_date));
      setEndDate(parseISO(event.end_date));
      setLastLogDate(parseISO(event.last_log_date));
      setSchoolName(event.school_name || "");
      setTimezone(event.timezone || "America/New_York");
      setPaymentAddress(event.payment_address || "");
      setAcceptChecks(event.accept_checks ?? true);
      setAcceptCards(event.accept_cards ?? true);
      setSendReminders(event.send_reminders ?? true);
      setReminderDays(String(event.reminder_days ?? 7));
      setGoalMinutes(String(event.goal_minutes ?? 500));
      setClassMilestoneEnabled(event.class_milestone_enabled ?? true);
      setClassMilestoneGoal(String(event.class_milestone_goal ?? 1000));
      setClassMilestoneReward(event.class_milestone_reward || "Pizza party for the whole class!");
      setTeacherLoggingGrades(event.teacher_logging_grades || []);
      setHasUnsavedChanges(false);
      setInitializedEventId(event.id);
    }
  }, [event, initializedEventId]);

  // Track changes
  const handleFieldChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!event?.id || !startDate || !endDate || !lastLogDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date must be after start date");
      return;
    }

    if (lastLogDate < startDate) {
      toast.error("Last log date must be on or after start date");
      return;
    }

    try {
      await updateEvent({
        id: event.id,
        name: eventName,
        start_date: startDate,
        end_date: endDate,
        last_log_date: lastLogDate,
        school_name: schoolName,
        timezone: timezone,
        payment_address: paymentAddress,
        accept_checks: acceptChecks,
        accept_cards: acceptCards,
        send_reminders: sendReminders,
        reminder_days: parseInt(reminderDays, 10) || 7,
        goal_minutes: parseInt(goalMinutes, 10) || 500,
        class_milestone_enabled: classMilestoneEnabled,
        class_milestone_goal: parseFloat(classMilestoneGoal) || 1000,
        class_milestone_reward: classMilestoneReward,
        teacher_logging_grades: teacherLoggingGrades,
      });
      setHasUnsavedChanges(false);
      toast.success("Event settings saved successfully!");
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEndEvent = async () => {
    if (!event?.id) return;
    
    try {
      await endEvent(event.id);
      setShowEndEventDialog(false);
      toast.success("Event has been ended. Payment collection emails will be sent.");
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getStatusBadge = () => {
    if (!event) return <Badge variant="secondary">No Event</Badge>;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = parseISO(event.end_date);
    const start = parseISO(event.start_date);

    if (!event.is_active || today > end) {
      return <Badge variant="secondary">Ended</Badge>;
    } else if (today < start) {
      return <Badge variant="outline">Upcoming</Badge>;
    } else {
      return <Badge variant="success">Active</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayout
        title="Event Settings"
        subtitle="Loading..."
      >
        <div className="max-w-3xl space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Event Settings"
      subtitle={<span className="flex items-center gap-2">{event?.name || "No Active Event"} {getStatusBadge()}</span>}
      actions={
        <div className="flex gap-2">
          {!event && (
            <Button onClick={() => setShowCreateEvent(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
          {event && (
            <Button onClick={handleSave} disabled={isUpdating || !hasUnsavedChanges}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : hasUnsavedChanges ? "Save Changes" : "Saved"}
            </Button>
          )}
        </div>
      }
    >
      <div className="max-w-3xl">
        {!event ? (
          <div className="bg-background p-8 text-center" style={handDrawnBorder}>
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="font-serif text-2xl mb-2">No Active Event</h2>
            <p className="text-muted-foreground mb-6">
              Create a new read-a-thon event to get started. You can set dates, goals, and manage all settings.
            </p>
            <Button onClick={() => setShowCreateEvent(true)} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create New Read-a-thon
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Event Details */}
            <div className="bg-background p-6" style={handDrawnBorder}>
              <h2 className="font-medium text-foreground mb-6">Event Details</h2>

              <div className="space-y-4">
                <FormField label="Event Name" htmlFor="eventName" required>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => {
                      setEventName(e.target.value);
                      handleFieldChange();
                    }}
                  />
                </FormField>

                <FormField label="School Name" htmlFor="schoolName" required>
                  <Input
                    id="schoolName"
                    value={schoolName}
                    onChange={(e) => {
                      setSchoolName(e.target.value);
                      handleFieldChange();
                    }}
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
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            if (date) {
                              setStartDate(date);
                              handleFieldChange();
                            }
                          }}
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
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            if (date) {
                              setEndDate(date);
                              handleFieldChange();
                            }
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormField>
                </div>

                <FormField label="Last Day to Log Reading" htmlFor="lastLogDate" required>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !lastLogDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lastLogDate ? format(lastLogDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={lastLogDate}
                        onSelect={(date) => {
                          if (date) {
                            setLastLogDate(date);
                            handleFieldChange();
                          }
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground mt-1">
                    Students can log reading until this date
                  </p>
                </FormField>

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
                    onChange={(e) => {
                      setGoalMinutes(e.target.value);
                      handleFieldChange();
                    }}
                    min={1}
                  />
                </FormField>

                <FormField
                  label="Event Timezone"
                  htmlFor="timezone"
                  helperText="Determines when reading periods start and end each day"
                  required
                >
                  <Select
                    value={timezone}
                    onValueChange={(value) => {
                      setTimezone(value);
                      handleFieldChange();
                    }}
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select timezone" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {US_TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            {/* Payment Settings */}
            <div className="bg-background p-6" style={handDrawnBorder}>
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
                    onChange={(e) => {
                      setPaymentAddress(e.target.value);
                      handleFieldChange();
                    }}
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
                    onCheckedChange={(checked) => {
                      setAcceptCards(checked);
                      handleFieldChange();
                    }}
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
                    onCheckedChange={(checked) => {
                      setAcceptChecks(checked);
                      handleFieldChange();
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div className="bg-background p-6" style={handDrawnBorder}>
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
                    onCheckedChange={(checked) => {
                      setSendReminders(checked);
                      handleFieldChange();
                    }}
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
                      onChange={(e) => {
                        setReminderDays(e.target.value);
                        handleFieldChange();
                      }}
                      min={1}
                      max={30}
                      className="max-w-[120px]"
                    />
                  </FormField>
                )}
              </div>
            </div>

            {/* Class Milestone Settings */}
            <div className="bg-background p-6" style={handDrawnBorder}>
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-5 w-5 text-primary" />
                <h2 className="font-medium text-foreground">Class Milestone Reward</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <Label htmlFor="classMilestoneEnabled" className="font-medium">Enable Class Milestone</Label>
                    <p className="text-sm text-muted-foreground">Show fundraising progress toward class reward</p>
                  </div>
                  <Switch
                    id="classMilestoneEnabled"
                    checked={classMilestoneEnabled}
                    onCheckedChange={(checked) => {
                      setClassMilestoneEnabled(checked);
                      handleFieldChange();
                    }}
                  />
                </div>

                {classMilestoneEnabled && (
                  <>
                    <FormField
                      label="Milestone Goal ($)"
                      htmlFor="classMilestoneGoal"
                      helperText="When a class reaches this fundraising amount, they earn the reward"
                    >
                      <div className="relative max-w-[200px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="classMilestoneGoal"
                          type="number"
                          value={classMilestoneGoal}
                          onChange={(e) => {
                            setClassMilestoneGoal(e.target.value);
                            handleFieldChange();
                          }}
                          min={1}
                          className="pl-7"
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Reward Description"
                      htmlFor="classMilestoneReward"
                      helperText="Describe what the class earns when they reach the goal"
                    >
                      <Input
                        id="classMilestoneReward"
                        value={classMilestoneReward}
                        onChange={(e) => {
                          setClassMilestoneReward(e.target.value);
                          handleFieldChange();
                        }}
                        placeholder="Pizza party for the whole class!"
                      />
                    </FormField>
                  </>
                )}
              </div>
            </div>

            {/* Teacher Reading Log Permissions */}
            <div className="bg-background p-6" style={handDrawnBorder}>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="font-medium text-foreground">Teacher Reading Log Permissions</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Select which grade levels allow teachers to log reading on behalf of students. 
                If a grade is not selected, the "Log Reading" button will be disabled for teachers of that grade.
              </p>

              <div className="space-y-3">
                {gradesLoading ? (
                  <Skeleton className="h-8 w-48" />
                ) : availableGrades.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No students enrolled yet. Grades will appear once students are added.
                  </p>
                ) : (
                  availableGrades.map((grade) => (
                    <div key={grade} className="flex items-center space-x-3">
                      <Checkbox
                        id={`grade-${grade}`}
                        checked={teacherLoggingGrades.includes(grade)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTeacherLoggingGrades([...teacherLoggingGrades, grade]);
                          } else {
                            setTeacherLoggingGrades(teacherLoggingGrades.filter(g => g !== grade));
                          }
                          handleFieldChange();
                        }}
                      />
                      <Label htmlFor={`grade-${grade}`} className="text-sm font-medium cursor-pointer">
                        {grade}
                      </Label>
                    </div>
                  ))
                )}
              </div>

              {teacherLoggingGrades.length > 0 && (
                <div className="mt-4 p-3 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    <strong>Enabled for:</strong> {teacherLoggingGrades.join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Teachers & Staff */}
            <TeacherManagement />

            {/* Event Controls */}
            <div className="bg-background p-6" style={handDrawnBorder}>
              <h2 className="font-medium text-foreground mb-6">Event Controls</h2>

              <div className="space-y-4">
                {event.is_active && (
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

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Create New Event</p>
                    <p className="text-sm text-muted-foreground">
                      Start a new read-a-thon (will end current event)
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setShowCreateEvent(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </div>

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
            </div>

            {/* Logo Generator */}
            <LogoGenerator />
          </div>
        )}
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
            <Button onClick={handleEndEvent} disabled={isEnding}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {isEnding ? "Ending..." : "End Event"}
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

      {/* Create Event Dialog */}
      <EditEventDialog
        open={showCreateEvent}
        onOpenChange={setShowCreateEvent}
        event={null}
        onSave={() => {
          setShowCreateEvent(false);
        }}
      />
    </AdminPageLayout>
  );
};

export default AdminSettingsPage;
