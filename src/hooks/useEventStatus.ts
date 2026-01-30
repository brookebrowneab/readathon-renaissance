import { useMemo } from "react";
import { useActiveEvent, ActiveEvent } from "./useActiveEvent";

export type EventPhase = 'setup' | 'pre_event' | 'active' | 'grace_period' | 'closed';

export interface EventStatus {
  phase: EventPhase;
  
  // Permissions
  canSignUp: boolean;           // true during pre_event and active
  canMakePledges: boolean;      // true during pre_event, active, grace_period
  canStudentsLog: boolean;      // true only during active
  canParentsLog: boolean;       // true during active and grace_period
  canTeachersLog: boolean;      // true during active (grade-restricted separately)
  
  // Derived states
  isLoggingOpen: boolean;       // anyone can log
  isPaymentsDue: boolean;       // event is closed
  
  // Countdowns (in days)
  daysUntilStart: number | null;
  daysUntilEnd: number | null;
  daysUntilClose: number | null;
  
  // Valid date range for logging
  validLogDates: { start: Date; end: Date } | null;
  
  // Phase-specific messages
  phaseMessage: string;
  
  // Loading state
  isLoading: boolean;
}

/**
 * Converts a date string to a Date object in the event's timezone
 * For start_date: beginning of day (midnight)
 * For end_date/last_log_date: end of day (11:59:59 PM)
 */
function getDateInTimezone(
  dateStr: string, 
  timezone: string, 
  endOfDay: boolean = false
): Date {
  // Parse the date string as a local date in the specified timezone
  // Since the database stores dates as YYYY-MM-DD, we treat them as local to the timezone
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Create a date string with time in the target timezone
  const timeStr = endOfDay ? '23:59:59' : '00:00:00';
  const dateTimeStr = `${dateStr}T${timeStr}`;
  
  try {
    // Create a formatter to get the timezone offset
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    // For simplicity, we'll calculate based on current timezone offset
    // This works for most US timezones (EST/EDT, CST, MST, PST)
    const now = new Date();
    const utcOffset = getTimezoneOffset(timezone, now);
    
    // Create the date with the offset
    const localDate = new Date(year, month - 1, day, 
      endOfDay ? 23 : 0, 
      endOfDay ? 59 : 0, 
      endOfDay ? 59 : 0
    );
    
    // Adjust for the timezone difference from local
    const localOffset = now.getTimezoneOffset();
    const targetOffset = utcOffset;
    const diff = (localOffset - targetOffset) * 60 * 1000;
    
    return new Date(localDate.getTime() + diff);
  } catch {
    // Fallback: just parse as local time
    return new Date(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0);
  }
}

/**
 * Get timezone offset in minutes for a given timezone
 */
function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    // Get the timezone offset by comparing UTC and local representations
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (utcDate.getTime() - tzDate.getTime()) / (60 * 1000);
  } catch {
    // Default to EST (-300 minutes)
    return -300;
  }
}

function calculateDaysUntil(targetDate: Date): number {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function calculatePhase(event: ActiveEvent | null): EventPhase {
  if (!event) return 'setup';
  
  const now = new Date();
  const timezone = event.timezone || 'America/New_York';
  
  const startDate = getDateInTimezone(event.start_date, timezone, false);
  const endDate = getDateInTimezone(event.end_date, timezone, true);
  const lastLogDate = getDateInTimezone(event.last_log_date, timezone, true);
  
  if (now < startDate) {
    return 'pre_event';
  } else if (now >= startDate && now <= endDate) {
    return 'active';
  } else if (now > endDate && now <= lastLogDate) {
    return 'grace_period';
  } else {
    return 'closed';
  }
}

function getPhaseMessage(phase: EventPhase, event: ActiveEvent | null): string {
  if (!event) return "No active read-a-thon event";
  
  const timezone = event.timezone || 'America/New_York';
  const startDate = getDateInTimezone(event.start_date, timezone, false);
  const endDate = getDateInTimezone(event.end_date, timezone, true);
  const lastLogDate = getDateInTimezone(event.last_log_date, timezone, true);
  
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  
  switch (phase) {
    case 'setup':
      return "No active read-a-thon event";
    case 'pre_event':
      return `Reading starts ${formatDate(startDate)}! Get your sponsors now.`;
    case 'active':
      const daysLeft = calculateDaysUntil(endDate);
      if (daysLeft <= 1) return "Last day to read!";
      return `${daysLeft} days left to read!`;
    case 'grace_period':
      const daysToClose = calculateDaysUntil(lastLogDate);
      if (daysToClose <= 1) return "Final day to log reading!";
      return `Final logging deadline: ${formatDate(lastLogDate)}`;
    case 'closed':
      return "This year's read-a-thon is complete! Results are in.";
  }
}

export function useEventStatus(): EventStatus {
  const { data: event, isLoading } = useActiveEvent();
  
  return useMemo(() => {
    const phase = calculatePhase(event);
    const timezone = event?.timezone || 'America/New_York';
    
    // Calculate dates for logging restrictions
    let validLogDates: { start: Date; end: Date } | null = null;
    let daysUntilStart: number | null = null;
    let daysUntilEnd: number | null = null;
    let daysUntilClose: number | null = null;
    
    if (event) {
      const startDate = getDateInTimezone(event.start_date, timezone, false);
      const endDate = getDateInTimezone(event.end_date, timezone, true);
      const lastLogDate = getDateInTimezone(event.last_log_date, timezone, true);
      
      validLogDates = { start: startDate, end: endDate };
      daysUntilStart = calculateDaysUntil(startDate);
      daysUntilEnd = calculateDaysUntil(endDate);
      daysUntilClose = calculateDaysUntil(lastLogDate);
    }
    
    // Determine permissions based on phase
    const canSignUp = phase === 'pre_event' || phase === 'active';
    const canMakePledges = phase === 'pre_event' || phase === 'active' || phase === 'grace_period';
    const canStudentsLog = phase === 'active';
    const canParentsLog = phase === 'active' || phase === 'grace_period';
    const canTeachersLog = phase === 'active';
    const isLoggingOpen = phase === 'active';
    const isPaymentsDue = phase === 'closed';
    
    return {
      phase,
      canSignUp,
      canMakePledges,
      canStudentsLog,
      canParentsLog,
      canTeachersLog,
      isLoggingOpen,
      isPaymentsDue,
      daysUntilStart,
      daysUntilEnd,
      daysUntilClose,
      validLogDates,
      phaseMessage: getPhaseMessage(phase, event),
      isLoading,
    };
  }, [event, isLoading]);
}

export { getDateInTimezone };
