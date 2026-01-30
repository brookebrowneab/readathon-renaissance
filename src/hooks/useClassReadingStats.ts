import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ClassReadingStats {
  total_minutes: number;
  total_books: number;
  student_count: number;
}

export function useClassReadingStats(className: string | null | undefined) {
  return useQuery({
    queryKey: ["class-reading-stats", className],
    queryFn: async (): Promise<ClassReadingStats> => {
      if (!className) {
        return { total_minutes: 0, total_books: 0, student_count: 0 };
      }

      const { data, error } = await supabase.rpc("get_class_reading_stats", {
        p_class_name: className,
      });

      if (error) throw error;

      // RPC returns array, get first row
      const row = Array.isArray(data) ? data[0] : data;
      return {
        total_minutes: row?.total_minutes ?? 0,
        total_books: Number(row?.total_books ?? 0),
        student_count: Number(row?.student_count ?? 0),
      };
    },
    enabled: !!className,
  });
}
