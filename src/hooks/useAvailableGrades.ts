import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAvailableGrades() {
  return useQuery({
    queryKey: ['available-grades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('grade_info')
        .not('grade_info', 'is', null);

      if (error) throw error;
      
      // Get unique grades and sort them
      const uniqueGrades = [...new Set(data.map(c => c.grade_info).filter(Boolean))] as string[];
      
      // Sort grades in a sensible order (K, 1st, 2nd, etc.)
      return uniqueGrades.sort((a, b) => {
        const gradeOrder = (grade: string) => {
          if (grade.toLowerCase().startsWith('k')) return 0;
          if (grade.toLowerCase().startsWith('pre')) return -1;
          const match = grade.match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 100;
        };
        return gradeOrder(a) - gradeOrder(b);
      });
    },
  });
}
