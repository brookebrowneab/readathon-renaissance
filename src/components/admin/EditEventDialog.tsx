import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventData {
  id?: string;
  name: string;
  start_date: Date;
  end_date: Date;
  last_log_date: Date;
  is_active: boolean;
}

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: EventData | null;
  onSave: () => void;
}

export function EditEventDialog({ open, onOpenChange, event, onSave }: EditEventDialogProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [lastLogDate, setLastLogDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const isNewEvent = !event?.id;

  useEffect(() => {
    if (event) {
      setName(event.name);
      setStartDate(event.start_date);
      setEndDate(event.end_date);
      setLastLogDate(event.last_log_date);
    } else {
      // Default for new event
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      setName(`Read-a-thon ${today.getFullYear()}`);
      setStartDate(today);
      setEndDate(nextMonth);
      setLastLogDate(nextMonth);
    }
  }, [event, open]);

  const handleSave = async () => {
    if (!name || !startDate || !endDate || !lastLogDate) {
      toast.error("Please fill in all fields");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date must be after start date");
      return;
    }

    if (lastLogDate < startDate || lastLogDate > endDate) {
      toast.error("Last log date must be between start and end dates");
      return;
    }

    // If creating a new event, ask about archiving old data
    if (isNewEvent) {
      // Check if there's existing active event
      const { data: existingEvents } = await supabase
        .from('events')
        .select('id')
        .eq('is_active', true);

      if (existingEvents && existingEvents.length > 0) {
        setShowArchiveConfirm(true);
        return;
      }
    }

    await saveEvent(false);
  };

  const saveEvent = async (archiveOldData: boolean) => {
    setLoading(true);

    try {
      if (archiveOldData) {
        // Archive old reading logs
        const { data: oldLogs } = await supabase
          .from('reading_logs')
          .select('*, events(name)');

        if (oldLogs && oldLogs.length > 0) {
          const archivedLogs = oldLogs.map(log => ({
            original_id: log.id,
            event_id: log.event_id,
            event_name: log.events?.name || 'Unknown Event',
            student_name: log.student_name,
            minutes: log.minutes,
            book_title: log.book_title,
            logged_at: log.logged_at,
          }));

          await supabase.from('archived_reading_logs').insert(archivedLogs);
          await supabase.from('reading_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        }

        // Archive old pledges
        const { data: oldPledges } = await supabase
          .from('pledges')
          .select('*, events(name), sponsors(name)');

        if (oldPledges && oldPledges.length > 0) {
          const archivedPledges = oldPledges.map(pledge => ({
            original_id: pledge.id,
            event_id: pledge.event_id,
            event_name: pledge.events?.name || 'Unknown Event',
            sponsor_name: pledge.sponsors?.name || 'Unknown Sponsor',
            student_name: pledge.student_name,
            pledge_type: pledge.pledge_type,
            amount: pledge.amount,
            is_paid: pledge.is_paid,
          }));

          await supabase.from('archived_pledges').insert(archivedPledges);
          await supabase.from('pledges').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        }

        // Deactivate old events
        await supabase
          .from('events')
          .update({ is_active: false })
          .eq('is_active', true);
      }

      const eventData = {
        name,
        start_date: format(startDate!, 'yyyy-MM-dd'),
        end_date: format(endDate!, 'yyyy-MM-dd'),
        last_log_date: format(lastLogDate!, 'yyyy-MM-dd'),
        is_active: true,
      };

      if (event?.id) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id);

        if (error) throw error;
        toast.success("Event updated successfully");
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert(eventData);

        if (error) throw error;
        toast.success("New read-a-thon created successfully");
      }

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(error.message || "Failed to save event");
    } finally {
      setLoading(false);
      setShowArchiveConfirm(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {isNewEvent ? "Create New Read-a-thon" : "Edit Event"}
            </DialogTitle>
            <DialogDescription>
              {isNewEvent 
                ? "Set up a new read-a-thon event. This will update dates across the entire site."
                : "Update the event details. Changes will reflect across the entire site."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Spring Read-a-thon 2024"
              />
            </div>

            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
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
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
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
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Last Day to Log Reading</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !lastLogDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastLogDate ? format(lastLogDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={lastLogDate}
                    onSelect={setLastLogDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Students can log reading until this date
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : (isNewEvent ? "Create Event" : "Save Changes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Previous Data?</AlertDialogTitle>
            <AlertDialogDescription>
              There is an existing active read-a-thon. Would you like to archive the 
              previous reading logs and pledges before starting the new event?
              <br /><br />
              <strong>Archive:</strong> Old data will be moved to archive tables and 
              cleared from active tables.
              <br />
              <strong>Keep:</strong> Old data will remain but be associated with the 
              previous event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowArchiveConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <Button variant="outline" onClick={() => saveEvent(false)}>
              Keep Data
            </Button>
            <AlertDialogAction onClick={() => saveEvent(true)}>
              Archive & Start Fresh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
