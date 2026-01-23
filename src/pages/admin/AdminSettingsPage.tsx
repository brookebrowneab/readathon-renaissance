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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEventSettings } from "@/hooks/useEventSettings";
import { EditEventDialog } from "@/components/admin/EditEventDialog";
import { TeacherManagement } from "@/components/admin/TeacherManagement";



const AdminSettingsPage = () => {
  const { event, isLoading, updateEvent, endEvent, isUpdating, isEnding } = useEventSettings();
  
  // Event details - initialized from database
  const [eventName, setEventName] = useState("");
  const [schoolName, setSchoolName] = useState("Lincoln Elementary");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [lastLogDate, setLastLogDate] = useState<Date | undefined>();
  const [goalMinutes, setGoalMinutes] = useState("500");

  // Create new event dialog
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  // Payment settings
  const [paymentAddress, setPaymentAddress] = useState(
    "Lincoln Elementary PTA\nRead-a-thon Fund\n123 School Street\nAnytown, ST 12345"
  );
  const [acceptChecks, setAcceptChecks] = useState(true);
  const [acceptCards, setAcceptCards] = useState(true);

  // Email settings
  const [sendReminders, setSendReminders] = useState(true);
  const [reminderDays, setReminderDays] = useState("7");

  // Dialogs
  const [showEndEventDialog, setShowEndEventDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize form from database
  useEffect(() => {
    if (event) {
      setEventName(event.name);
      setStartDate(parseISO(event.start_date));
      setEndDate(parseISO(event.end_date));
      setLastLogDate(parseISO(event.last_log_date));
      setHasUnsavedChanges(false);
    }
  }, [event]);

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
                    onChange={(e) => setGoalMinutes(e.target.value)}
                    min={1}
                  />
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
