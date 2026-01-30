import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface TeacherProfile {
  id: string;
  name: string;
  email: string | null;
  teacher_type: "homeroom" | "partner" | "specials" | "staff";
  has_full_access: boolean;
  is_active: boolean;
  grade_level: string | null;
}

export const useTeacherAuth = () => {
  const { user, isLoading: authLoading } = useAuth();

  const { data: teacherProfile, isLoading: teacherLoading, error } = useQuery({
    queryKey: ["teacher-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("teachers")
        .select("id, name, email, teacher_type, has_full_access, is_active, grade_level")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as TeacherProfile | null;
    },
    enabled: !!user,
  });

  return {
    user,
    teacherProfile,
    isTeacher: !!teacherProfile,
    isLoading: authLoading || teacherLoading,
    error,
  };
};
