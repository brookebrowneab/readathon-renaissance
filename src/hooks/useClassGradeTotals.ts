import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClassGradeTotals {
  [key: string]: {
    classTotal: number;
    gradeTotal: number;
  };
}

export const useClassGradeTotals = (
  children: { id: string; class_name: string | null; grade_info: string | null }[]
) => {
  return useQuery({
    queryKey: ["class-grade-totals", children.map(c => c.id).join(",")],
    queryFn: async () => {
      const totals: ClassGradeTotals = {};

      // Get unique class names and grade info
      const uniqueClasses = [...new Set(children.map(c => c.class_name).filter(Boolean))] as string[];
      const uniqueGrades = [...new Set(children.map(c => c.grade_info).filter(Boolean))] as string[];

      // Fetch class totals
      const classTotals: Record<string, number> = {};
      for (const className of uniqueClasses) {
        const { data, error } = await supabase.rpc("get_class_total_minutes", {
          p_class_name: className,
        });
        if (!error && data !== null) {
          classTotals[className] = data;
        }
      }

      // Fetch grade totals
      const gradeTotals: Record<string, number> = {};
      for (const gradeInfo of uniqueGrades) {
        const { data, error } = await supabase.rpc("get_grade_total_minutes", {
          p_grade_info: gradeInfo,
        });
        if (!error && data !== null) {
          gradeTotals[gradeInfo] = data;
        }
      }

      // Map totals to each child
      for (const child of children) {
        totals[child.id] = {
          classTotal: child.class_name ? classTotals[child.class_name] || 0 : 0,
          gradeTotal: child.grade_info ? gradeTotals[child.grade_info] || 0 : 0,
        };
      }

      return totals;
    },
    enabled: children.length > 0,
  });
};
