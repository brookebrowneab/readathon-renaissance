import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch class fundraising total using RPC function
export function useClassFundraisingTotal(className: string | undefined, eventId?: string) {
  return useQuery({
    queryKey: ["class-fundraising", className, eventId],
    queryFn: async (): Promise<number> => {
      if (!className) return 0;

      // Using type assertion for new RPC function
      const { data, error } = await (supabase as any)
        .rpc("get_class_fundraising_total", {
          p_class_name: className,
          p_event_id: eventId || null,
        });

      if (error) throw error;
      return Number(data) || 0;
    },
    enabled: !!className,
  });
}

// Get fundraising totals for multiple classes (for class selector)
export function useMultipleClassFundraisingTotals(classNames: string[], eventId?: string) {
  return useQuery({
    queryKey: ["class-fundraising", "multiple", classNames, eventId],
    queryFn: async (): Promise<Record<string, number>> => {
      if (!classNames.length) return {};

      const results: Record<string, number> = {};

      // Fetch totals for each class in parallel
      await Promise.all(
        classNames.map(async (className) => {
          const { data, error } = await (supabase as any)
            .rpc("get_class_fundraising_total", {
              p_class_name: className,
              p_event_id: eventId || null,
            });

          if (!error && data !== null) {
            results[className] = Number(data) || 0;
          }
        })
      );

      return results;
    },
    enabled: classNames.length > 0,
  });
}

// Get available classes for sponsorship
export function useAvailableClasses() {
  return useQuery({
    queryKey: ["available-classes"],
    queryFn: async () => {
      // Get distinct classes with their info
      const { data, error } = await supabase
        .from("children")
        .select(`
          class_name,
          grade_info,
          homeroom_teacher_id
        `)
        .not("class_name", "is", null)
        .eq("share_public_link", true);

      if (error) throw error;

      // Get all unique teacher IDs
      const teacherIds = [...new Set((data || [])
        .map(c => c.homeroom_teacher_id)
        .filter(Boolean))] as string[];

      // Fetch teacher names
      let teacherMap = new Map<string, { id: string; name: string }>();
      if (teacherIds.length > 0) {
        const { data: teachers } = await supabase
          .from("teachers")
          .select("id, name")
          .in("id", teacherIds);
        
        teachers?.forEach(t => teacherMap.set(t.id, t));
      }

      // Aggregate by class
      const classMap = new Map<string, {
        className: string;
        gradeInfo: string | null;
        teacherId: string | null;
        teacherName: string | null;
        studentCount: number;
      }>();

      data?.forEach((child) => {
        if (!child.class_name) return;
        
        const existing = classMap.get(child.class_name);
        if (existing) {
          existing.studentCount++;
        } else {
          const teacher = child.homeroom_teacher_id ? teacherMap.get(child.homeroom_teacher_id) : null;
          classMap.set(child.class_name, {
            className: child.class_name,
            gradeInfo: child.grade_info,
            teacherId: teacher?.id || null,
            teacherName: teacher?.name || null,
            studentCount: 1,
          });
        }
      });

      return Array.from(classMap.values());
    },
  });
}
