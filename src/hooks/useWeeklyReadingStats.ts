import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, format } from "date-fns";

export interface WeeklyReadingStats {
  total_minutes: number;
  daily_breakdown: { date: string; minutes: number }[];
}

export function useWeeklyReadingStats(childId: string | undefined) {
  return useQuery({
    queryKey: ["weekly-reading-stats", childId],
    queryFn: async (): Promise<WeeklyReadingStats> => {
      if (!childId) {
        return { total_minutes: 0, daily_breakdown: [] };
      }

      const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("reading_logs")
        .select("logged_at, minutes")
        .eq("child_id", childId)
        .gte("logged_at", sevenDaysAgo)
        .order("logged_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const dailyMap = new Map<string, number>();
      let total_minutes = 0;

      for (const log of data || []) {
        total_minutes += log.minutes;
        const existing = dailyMap.get(log.logged_at) || 0;
        dailyMap.set(log.logged_at, existing + log.minutes);
      }

      const daily_breakdown = Array.from(dailyMap.entries()).map(([date, minutes]) => ({
        date,
        minutes,
      }));

      return { total_minutes, daily_breakdown };
    },
    enabled: !!childId,
  });
}
