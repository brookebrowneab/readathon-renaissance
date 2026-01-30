import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ActiveEvent {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  last_log_date: string;
  is_active: boolean;
  goal_minutes: number;
  school_name: string;
  payment_address: string;
  accept_checks: boolean;
  accept_cards: boolean;
  send_reminders: boolean;
  reminder_days: number;
  class_milestone_enabled: boolean;
  class_milestone_goal: number;
  class_milestone_reward: string;
  teacher_logging_grades: string[];
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useActiveEvent() {
  return useQuery({
    queryKey: ['active-event'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as ActiveEvent | null;
    },
  });
}

export function formatEventDates(event: ActiveEvent | null) {
  if (!event) {
    return {
      startDate: "TBD",
      endDate: "TBD",
      lastLogDate: "TBD",
      daysRemaining: 0,
      status: "setup" as const,
    };
  }

  const start = new Date(event.start_date);
  const end = new Date(event.end_date);
  const lastLog = new Date(event.last_log_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const daysRemaining = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  let status: "setup" | "active" | "ended" = "setup";
  if (today >= start && today <= end) {
    status = "active";
  } else if (today > end) {
    status = "ended";
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    lastLogDate: formatDate(lastLog),
    daysRemaining,
    status,
  };
}
