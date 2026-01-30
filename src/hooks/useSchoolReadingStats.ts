import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SchoolReadingStats {
  total_minutes: number;
  total_students: number;
}

export function useSchoolReadingStats() {
  return useQuery({
    queryKey: ["school-reading-stats"],
    queryFn: async (): Promise<SchoolReadingStats> => {
      const { data, error } = await supabase
        .from("children")
        .select("total_minutes");

      if (error) throw error;

      const total_minutes = data?.reduce((sum, child) => sum + (child.total_minutes || 0), 0) ?? 0;
      const total_students = data?.length ?? 0;

      return { total_minutes, total_students };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
