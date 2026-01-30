import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ClassMilestoneStatus {
  total_pledged: number;
  total_unlocked: number;
  next_milestone_minutes: number | null;
  next_milestone_amount: number | null;
}

export function useClassMilestoneStatus(
  className: string | null | undefined,
  eventId?: string | null
) {
  return useQuery({
    queryKey: ["class-milestone-status", className, eventId],
    queryFn: async (): Promise<ClassMilestoneStatus> => {
      if (!className) {
        return {
          total_pledged: 0,
          total_unlocked: 0,
          next_milestone_minutes: null,
          next_milestone_amount: null,
        };
      }

      const { data, error } = await supabase.rpc("get_class_milestone_status", {
        p_class_name: className,
        p_event_id: eventId ?? null,
      });

      if (error) throw error;

      // RPC returns array, get first row
      const row = Array.isArray(data) ? data[0] : data;
      return {
        total_pledged: Number(row?.total_pledged ?? 0),
        total_unlocked: Number(row?.total_unlocked ?? 0),
        next_milestone_minutes: row?.next_milestone_minutes ?? null,
        next_milestone_amount: row?.next_milestone_amount
          ? Number(row.next_milestone_amount)
          : null,
      };
    },
    enabled: !!className,
  });
}
