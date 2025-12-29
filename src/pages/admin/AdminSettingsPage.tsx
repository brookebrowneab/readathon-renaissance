import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { MainNav, Footer } from "@/components/layout";
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
  ArrowLeft,
  Calendar as CalendarIcon,
  Save,
  AlertTriangle,
  Trash2,
  Play,
  Pause,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  // Dialogs
  const [showEndEventDialog, setShowEndEventDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-3xl">
          {/* Back Link */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
                Event Settings
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-muted-foreground">{eventName}</span>
                {getStatusBadge()}
              </div>
            </div>
            <Button onClick={handleSave} loading={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>

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
      </main>

      <Footer />

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
    </div>
  );
};

export default AdminSettingsPage;
